import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MYSURU_CITY_CENTER,
  MYSURU_DEFAULT_ZOOM,
  MYSURU_POLICE_STATIONS,
  MYSURU_HOSPITALS,
  MYSURU_LANDMARKS,
  MYSURU_INCIDENT_CLUSTERS,
  MYSURU_SAFE_CORRIDORS,
  MYSURU_CAUTION_ZONES,
  MysuruPOI,
  IncidentCluster,
  SafeCorridor,
  CautionZone,
} from '../data/mysuruLocations';
import { GeoState } from '../hooks/useGeolocation';
import { MapLegend } from '../components/MapLegend';
import {
  searchLocations,
  SearchResult,
} from '../services/mapService';
import {
  calculateOSRMRoute,
  OSRMRouteResult,
  formatDuration,
} from '../services/osrmRoutingService';
import {
  Search,
  Navigation,
  Layers,
  Phone,
  Route as RouteIcon,
  ShieldCheck,
  AlertTriangle,
  X,
  Footprints,
  Info,
  Car,
  Compass,
  ArrowRight,
  ArrowUpDown,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Map as MapIcon,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';

interface MapViewProps {
  geoState: GeoState;
  onStartWalkEscort?: (destination: string, etaMins: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({ geoState, onStartWalkEscort }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerRef = useRef<L.LayerGroup | null>(null);
  const cautionLayerRef = useRef<L.LayerGroup | null>(null);
  const incidentsLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Routing state
  const [routingMode, setRoutingMode] = useState<'driving' | 'walking'>('driving');
  // Default origin: VVCE (12.3364, 76.6186) or User GPS
  const [originCoord, setOriginCoord] = useState<[number, number]>(
    geoState.isLive ? geoState.coords : [12.3364, 76.6186]
  );
  const [originName, setOriginName] = useState(
    geoState.isLive ? 'My GPS Location' : 'VVCE'
  );
  // Default destination: Mysuru Railway Station (12.3157, 76.6443)
  const [destinationCoord, setDestinationCoord] = useState<[number, number] | null>([
    12.3157, 76.6443,
  ]);
  const [destinationName, setDestinationName] = useState('Mysuru Railway Station');
  const [routes, setRoutes] = useState<OSRMRouteResult[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Layer filter state
  const [activeLayers, setActiveLayers] = useState({
    police: true,
    hospitals: true,
    landmarks: true,
    safeCorridors: true,
    cautionZones: false,
    incidents: false,
  });

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Selected item modal/drawer state
  const [selectedPOI, setSelectedPOI] = useState<MysuruPOI | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentCluster | null>(null);
  const [selectedCaution, setSelectedCaution] = useState<CautionZone | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Initialize Leaflet Map with Dark Cartography Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MYSURU_CITY_CENTER,
      zoom: 13.5,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles with dark styling
    const tileLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'dark-map-tiles',
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer groups in order
    incidentsLayerRef.current = L.layerGroup().addTo(map);
    cautionLayerRef.current = L.layerGroup().addTo(map);
    corridorsLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Trigger initial route calculation between VVCE and Railway Station
    setTimeout(() => {
      map.invalidateSize();
      calculateRouteInternal([12.3364, 76.6186], [12.3157, 76.6443], 'driving', map);
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GPS Origin when live GPS is active and user hasn't overridden
  useEffect(() => {
    if (geoState.isLive && originName === 'My GPS Location') {
      setOriginCoord(geoState.coords);
    }
  }, [geoState.coords, geoState.isLive, originName]);

  // Update user GPS location beacon & accuracy radius
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(geoState.coords);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <div style="width: 14px; height: 14px; background: #FFD400; border: 2.5px solid #090909; border-radius: 50%; box-shadow: 0 0 12px #FFD400;"></div>
            <div style="position: absolute; width: 32px; height: 32px; background: rgba(255,212,0,0.3); border-radius: 50%;" class="pulse-beacon"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker(geoState.coords, {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }

    if (geoState.accuracy && geoState.isLive) {
      if (userCircleRef.current) {
        userCircleRef.current.setLatLng(geoState.coords);
        userCircleRef.current.setRadius(geoState.accuracy);
      } else {
        userCircleRef.current = L.circle(geoState.coords, {
          radius: geoState.accuracy,
          color: '#FFD400',
          weight: 1,
          opacity: 0.35,
          fillColor: '#FFD400',
          fillOpacity: 0.05,
        }).addTo(map);
      }
    }
  }, [geoState.coords, geoState.accuracy, geoState.isLive]);

  // Render POI Markers (Police: Blue Shield, Hospital: Red Cross, Pharmacy: Green Plus)
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const poisToRender: MysuruPOI[] = [];
    if (activeLayers.police) poisToRender.push(...MYSURU_POLICE_STATIONS);
    if (activeLayers.hospitals) poisToRender.push(...MYSURU_HOSPITALS);
    if (activeLayers.landmarks) poisToRender.push(...MYSURU_LANDMARKS);

    poisToRender.forEach((poi) => {
      const getPOIConfig = (cat: string) => {
        switch (cat) {
          case 'police':
            return { bg: '#2563EB', symbol: '🛡️', border: '#60A5FA' };
          case 'hospital':
            return { bg: '#DC2626', symbol: '✚', border: '#F87171' };
          case 'pharmacy':
            return { bg: '#10B981', symbol: '✚', border: '#34D399' };
          case 'education':
            return { bg: '#4F46E5', symbol: '🎓', border: '#818CF8' };
          case 'transit':
            return { bg: '#D97706', symbol: '🚉', border: '#FBBF24' };
          default:
            return { bg: '#1C1C1C', symbol: '📍', border: '#FFD400' };
        }
      };

      const cfg = getPOIConfig(poi.category);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: ${cfg.bg};
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid ${cfg.border};
            box-shadow: 0 4px 10px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            font-weight: bold;
            cursor: pointer;
          ">
            ${cfg.symbol}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedIncident(null);
        setSelectedCaution(null);
        setSelectedPOI(poi);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [activeLayers.police, activeLayers.hospitals, activeLayers.landmarks]);

  // Render Historical Incident Clusters
  useEffect(() => {
    if (!incidentsLayerRef.current) return;
    incidentsLayerRef.current.clearLayers();
    if (!activeLayers.incidents) return;

    MYSURU_INCIDENT_CLUSTERS.forEach((cluster) => {
      const circle = L.circle([cluster.lat, cluster.lng], {
        radius: cluster.radiusMeters,
        color: '#FF3434',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '4, 6',
        fillColor: '#FF3434',
        fillOpacity: 0.1,
      });

      const icon = L.divIcon({
        className: 'incident-cluster-icon',
        html: `
          <div style="
            background: #FF3434;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
          ">
            !
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([cluster.lat, cluster.lng], { icon });
      const handleSelect = () => {
        setSelectedPOI(null);
        setSelectedCaution(null);
        setSelectedIncident(cluster);
      };

      circle.on('click', handleSelect);
      marker.on('click', handleSelect);

      incidentsLayerRef.current?.addLayer(circle);
      incidentsLayerRef.current?.addLayer(marker);
    });
  }, [activeLayers.incidents]);

  // Render Safe Corridors
  useEffect(() => {
    if (!corridorsLayerRef.current) return;
    corridorsLayerRef.current.clearLayers();
    if (!activeLayers.safeCorridors) return;

    MYSURU_SAFE_CORRIDORS.forEach((corridor) => {
      const polyline = L.polyline(corridor.waypoints, {
        color: '#FFD400',
        weight: 4,
        opacity: 0.5,
        dashArray: '6, 6',
      });
      corridorsLayerRef.current?.addLayer(polyline);
    });
  }, [activeLayers.safeCorridors]);

  // Search input with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Render Route polylines matching Mockup 3 (Electric Yellow #FFD400 for primary route)
  const renderRoutePolylines = useCallback(
    (
      calculated: OSRMRouteResult[],
      selectedIndex: number,
      origin: [number, number],
      dest: [number, number]
    ) => {
      if (!mapInstanceRef.current || !routesLayerRef.current) return;
      routesLayerRef.current.clearLayers();

      // Render secondary/alternative routes first in subtle grey
      calculated.forEach((r, idx) => {
        if (idx === selectedIndex) return;
        const polyline = L.polyline(r.coordinates, {
          color: '#6B7280',
          weight: 4,
          opacity: 0.6,
          dashArray: '6, 6',
        });
        polyline.on('click', () => {
          setSelectedRouteIndex(idx);
          renderRoutePolylines(calculated, idx, origin, dest);
        });
        routesLayerRef.current?.addLayer(polyline);
      });

      // Render Primary Active Route in Bold Electric Yellow (#FFD400)
      const sel = calculated[selectedIndex];
      if (sel) {
        // Glowing halo
        const halo = L.polyline(sel.coordinates, {
          color: '#FFD400',
          weight: 8,
          opacity: 0.25,
        });
        // Vibrant main line
        const mainPoly = L.polyline(sel.coordinates, {
          color: '#FFD400',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routesLayerRef.current.addLayer(halo);
        routesLayerRef.current.addLayer(mainPoly);
      }

      // Origin Marker: Electric Yellow Pin with "VVCE" label (Mockup 3)
      const originIcon = L.divIcon({
        className: 'origin-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #1C1C1C; border: 1.5px solid #FFD400; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; color: #FFFFFF; white-space: nowrap; margin-bottom: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
              ${originName.slice(0, 16)}
            </div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFD400; border: 2.5px solid #090909; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px #FFD400;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #090909;"></div>
            </div>
          </div>
        `,
        iconSize: [60, 48],
        iconAnchor: [30, 48],
      });
      routesLayerRef.current.addLayer(L.marker(origin, { icon: originIcon }));

      // Destination Marker: Red Pin with "Mysuru Railway Station" label (Mockup 3)
      const destIcon = L.divIcon({
        className: 'dest-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #1C1C1C; border: 1.5px solid #FF3434; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; color: #FFFFFF; white-space: nowrap; margin-bottom: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
              ${destinationName.slice(0, 22)}
            </div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #FF3434; border: 2.5px solid #090909; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px #FF3434;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
          </div>
        `,
        iconSize: [70, 48],
        iconAnchor: [35, 48],
      });
      routesLayerRef.current.addLayer(L.marker(dest, { icon: destIcon }));

      // Fit map bounds
      if (sel && sel.coordinates.length > 0) {
        const bounds = L.latLngBounds(sel.coordinates);
        mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80] });
      }
    },
    [originName, destinationName]
  );

  // Internal route calculation
  const calculateRouteInternal = async (
    origin: [number, number],
    dest: [number, number],
    mode: 'driving' | 'walking',
    mapInstance?: L.Map
  ) => {
    setIsCalculatingRoute(true);
    try {
      const calculated = await calculateOSRMRoute(origin, dest, mode);
      setRoutes(calculated);
      setSelectedRouteIndex(0);
      renderRoutePolylines(calculated, 0, origin, dest);
    } catch (err) {
      console.error('Route calculation failed:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    setSearchQuery('');
    setSearchResults([]);
    setDestinationCoord([result.lat, result.lng]);
    setDestinationName(result.name);
    mapInstanceRef.current?.flyTo([result.lat, result.lng], 15, { duration: 1.2 });
    calculateRouteInternal(originCoord, [result.lat, result.lng], routingMode);
  };

  const handleRouteToPOI = (poi: MysuruPOI) => {
    setSelectedPOI(null);
    setDestinationCoord([poi.lat, poi.lng]);
    setDestinationName(poi.name);
    calculateRouteInternal(originCoord, [poi.lat, poi.lng], routingMode);
  };

  const activeRoute = routes[selectedRouteIndex];

  return (
    <div className="relative w-full h-[calc(100vh-130px)] sm:h-[620px] rounded-3xl overflow-hidden bg-[#090909] border border-[#1C1C1C] select-none">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Top Search Bar (Matches Mockup 3) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a location (e.g., VVCE, Mysuru Jn)..."
            className="w-full bg-[#1C1C1C]/95 backdrop-blur-md border border-[#2A2A2A] rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#FFD400] shadow-2xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden divide-y divide-[#2A2A2A] z-50 max-h-72 overflow-y-auto animate-in fade-in">
              {searchResults.map((res) => (
                <button
                  key={res.placeId}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full p-3 text-left hover:bg-[#252525] flex items-start gap-2.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#FFD400] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{res.name}</h4>
                    <p className="text-[11px] text-[#A0A0A0] truncate">{res.displayName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layer Toggle Button */}
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="w-10 h-10 rounded-2xl bg-[#1C1C1C]/95 backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] hover:bg-[#252525] transition-colors shadow-xl shrink-0"
          title="Toggle Layers"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Legend Toggle Button */}
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-10 h-10 rounded-2xl bg-[#1C1C1C]/95 backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#FFD400] transition-colors shadow-xl shrink-0"
          title="Legend"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Selection Menu (Dropdown) */}
      {showLayerMenu && (
        <div className="absolute top-16 right-4 z-30 w-52 bg-[#1C1C1C]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl p-3 shadow-2xl space-y-1.5 text-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#2A2A2A]">
            <span className="font-bold text-white text-[11px]">Map Layers</span>
            <button
              onClick={() => setShowLayerMenu(false)}
              className="text-[#A0A0A0] hover:text-white"
            >
              ✕
            </button>
          </div>
          <label className="flex items-center justify-between text-slate-300 py-1 cursor-pointer">
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> Police Stations
            </span>
            <input
              type="checkbox"
              checked={activeLayers.police}
              onChange={(e) => setActiveLayers((p) => ({ ...p, police: e.target.checked }))}
              className="accent-[#FFD400]"
            />
          </label>
          <label className="flex items-center justify-between text-slate-300 py-1 cursor-pointer">
            <span className="flex items-center gap-1.5">
              <span>✚</span> Hospitals
            </span>
            <input
              type="checkbox"
              checked={activeLayers.hospitals}
              onChange={(e) => setActiveLayers((p) => ({ ...p, hospitals: e.target.checked }))}
              className="accent-[#FFD400]"
            />
          </label>
          <label className="flex items-center justify-between text-slate-300 py-1 cursor-pointer">
            <span className="flex items-center gap-1.5">
              <span>🎓</span> Colleges &amp; Transit
            </span>
            <input
              type="checkbox"
              checked={activeLayers.landmarks}
              onChange={(e) => setActiveLayers((p) => ({ ...p, landmarks: e.target.checked }))}
              className="accent-[#FFD400]"
            />
          </label>
          <label className="flex items-center justify-between text-slate-300 py-1 cursor-pointer">
            <span className="flex items-center gap-1.5">
              <span>⚡</span> Safe Corridors
            </span>
            <input
              type="checkbox"
              checked={activeLayers.safeCorridors}
              onChange={(e) => setActiveLayers((p) => ({ ...p, safeCorridors: e.target.checked }))}
              className="accent-[#FFD400]"
            />
          </label>
        </div>
      )}

      {/* Map Zoom Controls (+ / -) Matching Mockup 3 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-9 h-9 rounded-xl bg-[#1C1C1C]/95 border border-[#2A2A2A] text-white hover:text-[#FFD400] flex items-center justify-center shadow-lg transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-9 h-9 rounded-xl bg-[#1C1C1C]/95 border border-[#2A2A2A] text-white hover:text-[#FFD400] flex items-center justify-center shadow-lg transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (geoState.coords) {
              mapInstanceRef.current?.flyTo(geoState.coords, 15, { duration: 1 });
            }
          }}
          className="w-9 h-9 rounded-xl bg-[#1C1C1C]/95 border border-[#2A2A2A] text-[#FFD400] flex items-center justify-center shadow-lg transition-colors mt-2"
          title="Recenter GPS"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Dedicated Map Legend */}
      <MapLegend isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />

      {/* Selected POI Details Modal */}
      {selectedPOI && (
        <div className="absolute top-20 left-4 right-4 z-30 max-w-sm mx-auto bg-[#1C1C1C]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl p-4 shadow-2xl animate-in fade-in space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#FFD400] font-bold">
                {selectedPOI.category} • {selectedPOI.is24x7 ? '24/7 OPEN' : 'REGULAR'}
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">{selectedPOI.name}</h4>
            </div>
            <button
              onClick={() => setSelectedPOI(null)}
              className="text-[#A0A0A0] hover:text-white p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#A0A0A0]">{selectedPOI.address}</p>
          <p className="text-[11px] text-slate-300 bg-[#090909] p-2 rounded-xl border border-[#2A2A2A]">
            {selectedPOI.details}
          </p>
          <div className="flex items-center gap-2 pt-1">
            {selectedPOI.emergencyContact ? (
              <a
                href={`tel:${selectedPOI.emergencyContact}`}
                className="flex-1 py-2 rounded-xl bg-[#FF3434]/20 border border-[#FF3434]/40 text-[#FF3434] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call {selectedPOI.emergencyContact}
              </a>
            ) : null}
            <button
              onClick={() => handleRouteToPOI(selectedPOI)}
              className="flex-1 py-2 rounded-xl bg-[#FFD400] text-[#090909] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#FFD400]/20"
            >
              <RouteIcon className="w-3.5 h-3.5" /> Route Here
            </button>
          </div>
        </div>
      )}

      {/* Bottom Route Details Drawer (Matches Mockup 3 Exactly) */}
      {routes.length > 0 && activeRoute && (
        <div className="absolute bottom-3 left-3 right-3 z-30 max-w-md mx-auto bg-[#1C1C1C]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 space-y-3">
          {/* Header Title: VVCE -> Mysuru Railway Station */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white truncate max-w-[80%]">
              {originName} → {destinationName}
            </h3>
            <button
              onClick={() => setRoutes([])}
              className="text-[#A0A0A0] hover:text-white p-1"
              title="Close Route"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Route Options Switcher Pills (Mockup 3: 16 min • 6.2 km / 20 min • 6.8 km) */}
          <div className="flex items-center gap-2">
            {routes.map((r, i) => {
              const isSelected = selectedRouteIndex === i;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRouteIndex(i);
                    if (destinationCoord) {
                      renderRoutePolylines(routes, i, originCoord, destinationCoord);
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#FFD400] text-[#090909] shadow-md shadow-[#FFD400]/20 font-bold'
                      : 'bg-[#090909] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {r.durationMins} min • {r.distanceKm} km
                  </span>
                </button>
              );
            })}
          </div>

          {/* Safety Rating Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-[#FFD400]" />
              <span className="font-semibold">
                Route Safety: {activeRoute.safetyScore >= 80 ? 'High' : 'Moderate'}
              </span>
            </div>
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-[11px] font-mono text-[#A0A0A0] hover:text-[#FFD400] flex items-center gap-1"
            >
              <span>{activeRoute.steps.length} Steps</span>
              {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Steps Drawer */}
          {showSteps && activeRoute.steps.length > 0 && (
            <div className="p-2.5 bg-[#090909] rounded-xl border border-[#2A2A2A] max-h-36 overflow-y-auto space-y-1 text-xs">
              {activeRoute.steps.map((st, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 py-0.5">
                  <span className="w-4 h-4 rounded-full bg-[#1C1C1C] text-[#FFD400] text-[9px] flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <div className="flex-1 text-[11px] text-[#A0A0A0]">
                    <span className="text-white">{st.instruction}</span>
                    <span className="ml-1 text-[10px] text-[#6B7280]">({st.distanceMeters}m)</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Primary Action Button: "Start Navigation" in Solid Electric Yellow */}
          <button
            onClick={() => {
              if (onStartWalkEscort) {
                onStartWalkEscort(destinationName, activeRoute.durationMins);
              }
            }}
            className="w-full py-3 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-[#090909] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#FFD400]/25 transition-all active:scale-98"
          >
            <Navigation className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>Start Navigation</span>
          </button>

          {/* Bottom Legend Pills (Matches Mockup 3: Police, Hospital, Pharmacy) */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-[#A0A0A0] pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Police
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Hospital
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Pharmacy
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

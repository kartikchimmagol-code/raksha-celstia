import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MYSURU_CENTER,
  MYSURU_SAFETY_POINTS,
} from '../data/mysuruData';
import { SafetyPoint } from '../types';
import { GeoState } from '../hooks/useGeolocation';
import { Badge } from '../components/Badge';
import {
  searchLocations,
  getCalculatedRoutes,
  SearchResult,
  CalculatedRoute,
} from '../services/mapService';
import {
  Search,
  Navigation,
  Layers,
  Phone,
  Route as RouteIcon,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  X,
  Footprints,
  Info,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

interface MapViewProps {
  geoState: GeoState;
  onStartWalkEscort?: (destination: string, etaMins: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({ geoState, onStartWalkEscort }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Routing state
  const [originCoord, setOriginCoord] = useState<[number, number]>(geoState.coords);
  const [originName, setOriginName] = useState('Current GPS Location');
  const [destinationCoord, setDestinationCoord] = useState<[number, number] | null>(null);
  const [destinationName, setDestinationName] = useState('');
  const [routes, setRoutes] = useState<CalculatedRoute[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Layer filter state
  const [activeLayers, setActiveLayers] = useState<{
    police: boolean;
    hospital: boolean;
    safe_corridor: boolean;
    caution_zone: boolean;
  }>({
    police: true,
    hospital: true,
    safe_corridor: true,
    caution_zone: true,
  });

  const [selectedPoint, setSelectedPoint] = useState<SafetyPoint | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MYSURU_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // Dark-themed high-contrast map tiles with clean streets
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const routesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    routesLayerRef.current = routesGroup;
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Fix map rendering when initialized in dynamic layouts
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update POI markers when layer filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const filtered = MYSURU_SAFETY_POINTS.filter((p) => {
      if (p.category === 'police' && activeLayers.police) return true;
      if (p.category === 'hospital' && activeLayers.hospital) return true;
      if (p.category === 'safe_corridor' && activeLayers.safe_corridor) return true;
      if (p.category === 'caution_zone' && activeLayers.caution_zone) return true;
      return false;
    });

    filtered.forEach((pt) => {
      const getCategoryStyle = (cat: string) => {
        switch (cat) {
          case 'police':
            return { bg: '#2563eb', symbol: '👮' };
          case 'hospital':
            return { bg: '#dc2626', symbol: '🏥' };
          case 'safe_corridor':
            return { bg: '#059669', symbol: '🛡️' };
          case 'caution_zone':
            return { bg: '#d97706', symbol: '⚠️' };
          default:
            return { bg: '#475569', symbol: '📍' };
        }
      };

      const style = getCategoryStyle(pt.category);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: ${style.bg};
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${style.symbol}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(pt);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [activeLayers]);

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
            <div style="width: 14px; height: 14px; background: #0284c7; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 10px #0284c7;"></div>
            <div style="position: absolute; width: 30px; height: 30px; background: rgba(2,132,199,0.25); border-radius: 50%; animation: ping 2.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker(geoState.coords, { icon: userIcon }).addTo(map);
    }

    // Accuracy circle
    if (geoState.accuracy && geoState.isLive) {
      if (userCircleRef.current) {
        userCircleRef.current.setLatLng(geoState.coords);
        userCircleRef.current.setRadius(geoState.accuracy);
      } else {
        userCircleRef.current = L.circle(geoState.coords, {
          radius: geoState.accuracy,
          color: '#0284c7',
          weight: 1,
          opacity: 0.4,
          fillColor: '#0284c7',
          fillOpacity: 0.08,
        }).addTo(map);
      }
    }
  }, [geoState.coords, geoState.accuracy, geoState.isLive]);

  // Handle Search Input with debounce
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
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Execute Route Calculation
  const calculateRouteTo = useCallback(
    async (dest: [number, number], name: string) => {
      setIsCalculatingRoute(true);
      setDestinationCoord(dest);
      setDestinationName(name);

      const calculated = await getCalculatedRoutes(originCoord, dest, 'driving');
      setRoutes(calculated);
      setSelectedRouteIndex(0);
      setIsCalculatingRoute(false);

      // Render routes on Leaflet map
      if (mapInstanceRef.current && routesLayerRef.current) {
        routesLayerRef.current.clearLayers();

        calculated.forEach((r, idx) => {
          const isSelected = idx === 0; // Primary safe corridor
          const polyline = L.polyline(r.geometry, {
            color: isSelected ? '#059669' : '#64748b',
            weight: isSelected ? 5 : 3,
            opacity: isSelected ? 0.95 : 0.6,
            dashArray: isSelected ? undefined : '6, 8',
          });

          routesLayerRef.current?.addLayer(polyline);
        });

        // Destination Marker (Red Flag)
        const destIcon = L.divIcon({
          className: 'dest-marker',
          html: `
            <div style="background: #dc2626; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              🏁
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const destMarker = L.marker(dest, { icon: destIcon });
        routesLayerRef.current.addLayer(destMarker);

        // Fit map bounds to show full route
        const allPoints = calculated.flatMap((r) => r.geometry);
        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints);
          mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
        }
      }
    },
    [originCoord]
  );

  const handleSelectSearchResult = (result: SearchResult) => {
    setSearchQuery('');
    setSearchResults([]);
    mapInstanceRef.current?.flyTo([result.lat, result.lng], 16, { duration: 1.2 });
    calculateRouteTo([result.lat, result.lng], result.name);
  };

  const handleRouteToPoint = (point: SafetyPoint) => {
    setSelectedPoint(null);
    calculateRouteTo([point.lat, point.lng], point.name);
  };

  const clearCurrentRoute = () => {
    routesLayerRef.current?.clearLayers();
    setRoutes([]);
    setDestinationCoord(null);
    setDestinationName('');
  };

  const activeRoute = routes[selectedRouteIndex];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Search Bar & Layer Toggles */}
      <div className="relative z-30 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination in Mysuru (e.g. K.R. Hospital, VVCE, Kuvempunagar)..."
              className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Live Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800 z-50 animate-in fade-in max-h-72 overflow-y-auto">
                {searchResults.map((res) => (
                  <button
                    key={res.placeId}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full p-3 text-left hover:bg-slate-800 flex items-start gap-2.5 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{res.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{res.displayName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, police: !prev.police }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
                activeLayers.police
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
            >
              <span>👮</span> Police
            </button>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, hospital: !prev.hospital }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
                activeLayers.hospital
                  ? 'bg-red-600/20 text-red-300 border-red-500/40'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
            >
              <span>🏥</span> Hospitals
            </button>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({
                  ...prev,
                  safe_corridor: !prev.safe_corridor,
                }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
                activeLayers.safe_corridor
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
            >
              <span>🛡️</span> Safe Corridors
            </button>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({
                  ...prev,
                  caution_zone: !prev.caution_zone,
                }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
                activeLayers.caution_zone
                  ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
            >
              <span>⚠️</span> Caution
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative w-full h-[500px] sm:h-[540px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Legend Toggle */}
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-lg backdrop-blur"
            title="Map Legend & Safety Explanation"
          >
            <Layers className="w-4 h-4 text-teal-400" />
          </button>

          {/* Recenter GPS */}
          <button
            onClick={() => {
              setOriginCoord(geoState.coords);
              mapInstanceRef.current?.flyTo(geoState.coords, 15, { duration: 1 });
            }}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-lg backdrop-blur"
            title="Recenter on My Location"
          >
            <Navigation className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Map Legend Overlay */}
        {isLegendOpen && (
          <div className="absolute top-16 right-4 z-20 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-3.5 shadow-2xl text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="font-bold text-white">Map Legend & Transparency</span>
              <button
                onClick={() => setIsLegendOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <span>Police Stations & Aid Posts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                <span>24/7 Tertiary Trauma Hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <span>Smart Illuminated Safe Corridors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span>Late-Night Caution Zones (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                <span>Your Live Position (GPS)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Corridor safety weights use verified arterial lighting proxies and emergency proximity.
            </p>
          </div>
        )}

        {/* Selected POI Details Modal / Bottom Sheet */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-80 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {selectedPoint.category.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-bold text-white">{selectedPoint.name}</h4>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-1">{selectedPoint.address}</p>
            <p className="text-[11px] text-slate-400 mt-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              {selectedPoint.notes}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {selectedPoint.contact && (
                <a
                  href={`tel:${selectedPoint.contact}`}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
              )}
              <button
                onClick={() => handleRouteToPoint(selectedPoint)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <RouteIcon className="w-3.5 h-3.5" /> Route Here
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner for OSRM Route Calculation */}
        {isCalculatingRoute && (
          <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center gap-2 text-white text-xs font-mono">
            <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <span>Calculating OSRM Safe Corridors...</span>
          </div>
        )}
      </div>

      {/* Active Route Comparison Drawer (Google Maps-Style) */}
      {routes.length > 0 && activeRoute && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={activeRoute.type === 'safest' ? 'success' : 'neutral'}>
                  {activeRoute.type === 'safest' ? 'RECOMMENDED SAFE CORRIDOR' : 'ALTERNATIVE ROUTE'}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  {destinationName}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{activeRoute.name}</h3>
            </div>

            <button
              onClick={clearCurrentRoute}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              title="Clear Route"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Route Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DISTANCE</span>
              <span className="text-lg font-bold text-white">{activeRoute.distanceKm} km</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">EST. TRAVEL TIME</span>
              <span className="text-lg font-bold text-white">{activeRoute.durationMins} mins</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ILLUMINATION INDEX</span>
              <span className="text-lg font-bold text-amber-400">{activeRoute.lightingIndex}%</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SAFETY RATING</span>
              <span className="text-lg font-bold text-emerald-400">{activeRoute.safetyScore}/100</span>
            </div>
          </div>

          {/* Alternative Route Switcher (if OSRM returned multiple routes) */}
          {routes.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Routes Found:</span>
              {routes.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRouteIndex(i);
                    // Update active polyline styling
                    if (mapInstanceRef.current && routesLayerRef.current) {
                      routesLayerRef.current.clearLayers();
                      routes.forEach((subR, subIdx) => {
                        const isSel = subIdx === i;
                        const polyline = L.polyline(subR.geometry, {
                          color: isSel ? '#059669' : '#64748b',
                          weight: isSel ? 5 : 3,
                          opacity: isSel ? 0.95 : 0.6,
                          dashArray: isSel ? undefined : '6, 8',
                        });
                        routesLayerRef.current?.addLayer(polyline);
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border ${
                    selectedRouteIndex === i
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Option {i + 1} ({r.distanceKm} km • {r.durationMins}m)
                </button>
              ))}
            </div>
          )}

          {/* Safety Factors Explainability List */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Safety Corridor Assessment:
            </h4>
            <div className="space-y-1.5 text-xs">
              {activeRoute.safetyFactors.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span
                    className={
                      f.impact === 'positive'
                        ? 'text-emerald-400'
                        : f.impact === 'caution'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }
                  >
                    •
                  </span>
                  <div>
                    <span className="font-semibold text-white">{f.title}: </span>
                    <span className="text-slate-400">{f.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Walk With Me Hand-off */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              {activeRoute.transparencyNotice}
            </p>

            <button
              onClick={() => {
                if (onStartWalkEscort) {
                  onStartWalkEscort(destinationName, activeRoute.durationMins);
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
            >
              <Footprints className="w-4 h-4" />
              Start Escort to {destinationName.slice(0, 20)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

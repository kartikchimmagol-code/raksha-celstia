import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MYSURU_CENTER,
  MYSURU_SAFETY_POINTS,
} from '../data/mysuruData';
import { SafetyPoint } from '../types';
import { GeoState } from '../hooks/useGeolocation';
import { Badge } from '../components/Badge';
import { Shield, Cross, Navigation, Phone, AlertTriangle, Layers } from 'lucide-react';

interface MapViewProps {
  geoState: GeoState;
}

export const MapView: React.FC<MapViewProps> = ({ geoState }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<SafetyPoint | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: MYSURU_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // Dark-mode themed CartoDB / OSM tiles
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when category filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered =
      selectedCategory === 'all'
        ? MYSURU_SAFETY_POINTS
        : MYSURU_SAFETY_POINTS.filter((p) => p.category === selectedCategory);

    filtered.forEach((pt) => {
      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case 'police':
            return '#3b82f6';
          case 'hospital':
            return '#ef4444';
          case 'safe_corridor':
            return '#10b981';
          case 'caution_zone':
            return '#f59e0b';
          default:
            return '#8b5cf6';
        }
      };

      const color = getCategoryColor(pt.category);

      // Custom DivIcon for high-tech marker
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            ${pt.category === 'police' ? '👮' : pt.category === 'hospital' ? '🏥' : pt.category === 'caution_zone' ? '⚠️' : '🛡️'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(pt);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [selectedCategory]);

  // Update User GPS marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(geoState.coords);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div style="width: 22px; height: 22px; background: #06b6d4; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px #06b6d4;"></div>
            <div style="position: absolute; width: 38px; height: 38px; background: rgba(6,182,212,0.3); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      userMarkerRef.current = L.marker(geoState.coords, { icon: userIcon }).addTo(map);
    }
  }, [geoState.coords]);

  const jumpToLocation = (coords: [number, number], zoom = 15) => {
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1.2 });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Layer Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mysuru Tactical Safety Map
            </h2>
            <Badge variant="demo">MYSURU PILOT</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Real-time police chowkis, tertiary hospitals, illuminated safe corridors & caution zones.
          </p>
        </div>

        {/* Quick Landmarks Jump */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => jumpToLocation(MYSURU_CENTER)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0 font-medium"
          >
            K.R. Circle
          </button>
          <button
            onClick={() => jumpToLocation([12.3101, 76.6575])}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0 font-medium"
          >
            Suburban Bus Stand
          </button>
          <button
            onClick={() => jumpToLocation([12.2921, 76.6315])}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0 font-medium"
          >
            Kuvempunagar
          </button>
          <button
            onClick={() => jumpToLocation([12.2854, 76.6712])}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0 font-medium"
          >
            Chamundi Hill
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Layers' },
          { key: 'police', label: 'Police Outposts', icon: '👮' },
          { key: 'hospital', label: 'Hospitals / Trauma', icon: '🏥' },
          { key: 'safe_corridor', label: 'Safe Corridors', icon: '🛡️' },
          { key: 'caution_zone', label: 'Caution Zones', icon: '⚠️' },
        ].map((chip) => (
          <button
            key={chip.key}
            onClick={() => setSelectedCategory(chip.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === chip.key
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {chip.icon && <span>{chip.icon}</span>}
            {chip.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Recenter GPS Button */}
        <button
          onClick={() => jumpToLocation(geoState.coords, 16)}
          className="absolute bottom-5 left-5 z-20 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur"
        >
          <Navigation className="w-4 h-4 text-cyan-400" />
          My Location
        </button>

        {/* Selected Point Overlay Card */}
        {selectedPoint && (
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {selectedPoint.category.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-bold text-white">{selectedPoint.name}</h4>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-1">{selectedPoint.address}</p>
            <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              {selectedPoint.notes}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {selectedPoint.contact && (
                <a
                  href={`tel:${selectedPoint.contact}`}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call {selectedPoint.contact}
                </a>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1"
              >
                Directions
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          Showing {MYSURU_SAFETY_POINTS.length} verified safety hubs & risk-assessed corridors in Mysuru.
        </span>
        <Badge variant="demo">Demo Dataset</Badge>
      </div>
    </div>
  );
};

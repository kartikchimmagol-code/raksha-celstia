import React, { useState, useEffect } from 'react';
import {
  Route,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Navigation,
  Car,
} from 'lucide-react';
import { getCalculatedRoutes, CalculatedRoute } from '../services/mapService';

const MYSURU_ROUTE_HUBS: { name: string; coord: [number, number] }[] = [
  { name: 'Vidyavardhaka College (VVCE)', coord: [12.3364, 76.6186] },
  { name: 'Mysuru Junction Railway Station', coord: [12.3157, 76.6443] },
  { name: 'Suburban Bus Stand (KSRTC)', coord: [12.3101, 76.6575] },
  { name: 'Mysuru Palace (Amba Vilas)', coord: [12.3051, 76.6554] },
  { name: 'Kuvempunagar Complex', coord: [12.2921, 76.6315] },
  { name: 'Chamundi Hill Foothills', coord: [12.2854, 76.6712] },
];

export const RoutesView: React.FC = () => {
  const [originIndex, setOriginIndex] = useState(0);
  const [destIndex, setDestIndex] = useState(1);
  const [routes, setRoutes] = useState<CalculatedRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const origin = MYSURU_ROUTE_HUBS[originIndex].coord;
    const dest = MYSURU_ROUTE_HUBS[destIndex].coord;

    setIsLoading(true);
    getCalculatedRoutes(origin, dest, 'driving').then((res) => {
      setRoutes(res);
      if (res.length > 0) {
        setSelectedRouteId(res[0].id);
      }
      setIsLoading(false);
    });
  }, [originIndex, destIndex]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto animate-in fade-in">
      {/* Route Selector Card */}
      <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Mysuru Corridor Planning
        </h3>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#A0A0A0] block font-semibold mb-1">
              Origin Location
            </label>
            <select
              value={originIndex}
              onChange={(e) => setOriginIndex(Number(e.target.value))}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
            >
              {MYSURU_ROUTE_HUBS.map((hub, idx) => (
                <option key={hub.name} value={idx}>
                  {hub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#A0A0A0] block font-semibold mb-1">
              Destination Location
            </label>
            <select
              value={destIndex}
              onChange={(e) => setDestIndex(Number(e.target.value))}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
            >
              {MYSURU_ROUTE_HUBS.map((hub, idx) => (
                <option key={hub.name} value={idx}>
                  {hub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calculated Routes Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-[#A0A0A0] font-mono bg-[#1C1C1C] rounded-3xl border border-[#2A2A2A]">
          Calculating OSRM corridor weights...
        </div>
      ) : (
        routes.length > 0 &&
        activeRoute && (
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#FFD400]/15 text-[#FFD400] font-bold border border-[#FFD400]/40">
                RECOMMENDED CORRIDOR
              </span>
              <span className="text-xs font-mono text-white font-bold">
                {activeRoute.durationMins} mins • {activeRoute.distanceKm} km
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#090909] p-3 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[10px] text-[#A0A0A0] block">SAFETY SCORE</span>
                <span className="text-lg font-bold text-[#FFD400]">
                  {activeRoute.safetyScore}/100
                </span>
              </div>
              <div className="bg-[#090909] p-3 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[10px] text-[#A0A0A0] block">ILLUMINATION</span>
                <span className="text-lg font-bold text-white">
                  {activeRoute.lightingIndex}%
                </span>
              </div>
            </div>

            {/* Proximity Assessment */}
            <div className="p-3 bg-[#090909] rounded-2xl border border-[#2A2A2A] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#FFD400]" />
                <span>Corridor Safety Assessment</span>
              </div>
              <ul className="space-y-1 text-[#A0A0A0] text-[11px]">
                {activeRoute.safetyFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#FFD400]">•</span>
                    <span>
                      <strong className="text-white">{f.title}: </strong>
                      {f.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}
    </div>
  );
};

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
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { getCalculatedRoutes, CalculatedRoute } from '../services/mapService';

const MYSURU_ROUTE_HUBS: { name: string; coord: [number, number] }[] = [
  { name: 'Suburban Bus Stand (KSRTC)', coord: [12.3101, 76.6575] },
  { name: 'Mysuru Palace (Amba Vilas)', coord: [12.3051, 76.6554] },
  { name: 'K.R. Circle & City Bus Stand', coord: [12.3072, 76.6531] },
  { name: 'Kuvempunagar Complex', coord: [12.2921, 76.6315] },
  { name: 'Jayalakshmipuram / VVCE Corridor', coord: [12.3218, 76.6322] },
  { name: 'Chamundi Hill Foothills', coord: [12.2854, 76.6712] },
];

export const RoutesView: React.FC = () => {
  const [originIndex, setOriginIndex] = useState(0);
  const [destIndex, setDestIndex] = useState(4);
  const [routes, setRoutes] = useState<CalculatedRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Safe Route Navigator</h2>
          <Badge variant="success">OSRM ENGINE ACTIVE</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Evaluates transit corridors weighted by street illumination proxies, active commercial density, and police outpost proximity.
        </p>
      </div>

      {/* Origin / Destination Hub Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="w-0.5 h-7 bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-red-500" />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Origin Transit Hub
              </label>
              <select
                value={originIndex}
                onChange={(e) => setOriginIndex(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
              >
                {MYSURU_ROUTE_HUBS.map((hub, idx) => (
                  <option key={hub.name} value={idx}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Destination Point
              </label>
              <select
                value={destIndex}
                onChange={(e) => setDestIndex(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
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
      </div>

      {/* Calculated Routes Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Calculated Route Corridors ({routes.length} Available)
          </h3>
          {isLoading && (
            <span className="text-xs font-mono text-teal-400 animate-pulse">
              Computing OSRM road geometry...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isSafest = route.type === 'safest';

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`rounded-3xl p-5 border cursor-pointer transition-all ${
                  isSelected
                    ? isSafest
                      ? 'bg-slate-900 border-emerald-500 shadow-xl ring-1 ring-emerald-500/40'
                      : 'bg-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={isSafest ? 'success' : 'warning'}>
                      {isSafest ? 'RECOMMENDED SAFE CORRIDOR' : 'ALTERNATIVE ROUTE'}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Safety Rating</span>
                    <span
                      className={`text-xl font-black font-mono ${
                        route.safetyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {route.safetyScore}/100
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mt-2.5">{route.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{route.summary}</p>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">DISTANCE / DURATION</span>
                    <span className="text-white font-bold">
                      {route.distanceKm} km • {route.durationMins} mins
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">LIGHTING INDEX</span>
                    <span className="text-amber-400 font-bold">{route.lightingIndex}%</span>
                  </div>
                </div>

                {/* Factors */}
                <div className="mt-3 space-y-1 text-xs">
                  {route.safetyFactors.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <span className={f.impact === 'positive' ? 'text-emerald-400' : 'text-amber-400'}>
                        •
                      </span>
                      <span>{f.description}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isSelected ? 'Active Selected Corridor' : 'Tap to inspect'}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium font-mono text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Activation Action */}
      {activeRoute && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-teal-400" />
              {isNavigating ? 'Active Corridor Escort Engaged' : 'Corridor Navigation Ready'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeRoute.name} ({activeRoute.distanceKm} km • {activeRoute.durationMins} mins)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isNavigating ? (
              <button
                onClick={() => setIsNavigating(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/30 text-xs font-bold"
              >
                End Navigation
              </button>
            ) : (
              <button
                onClick={() => setIsNavigating(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-950 flex items-center justify-center gap-1.5"
              >
                Start Corridor Escort
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {isNavigating && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-4 text-xs text-slate-300 font-mono space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>ACTIVE GPS ARTERIAL MONITORING</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Following designated Mysuru municipal arterial corridor. Keep to well-illuminated main thoroughfares. If you deviate into unlit alleys, a safety check-in prompt will activate.
          </p>
        </div>
      )}

      {/* Advisory Notice */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 font-mono flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Safety indices represent advisory proxies derived from street hierarchy and emergency proximity. Always exercise situational awareness.
        </span>
      </div>
    </div>
  );
};

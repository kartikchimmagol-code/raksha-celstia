import React, { useState } from 'react';
import { Route, ShieldCheck, AlertTriangle, Lightbulb, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import { DEMO_ROUTES } from '../data/mysuruData';
import { Badge } from '../components/Badge';

export const RoutesView: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(DEMO_ROUTES[0].id);
  const [origin, setOrigin] = useState('Suburban Bus Stand, Mysuru');
  const [destination, setDestination] = useState('Jayalakshmipuram, Mysuru');
  const [isNavigating, setIsNavigating] = useState(false);

  const activeRoute = DEMO_ROUTES.find((r) => r.id === selectedRouteId) || DEMO_ROUTES[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Safe Route Navigation</h2>
          <Badge variant="demo">MYSURU PILOT</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Compare routes weighted by street illumination index, active commercial density, and police proximity.
        </p>
      </div>

      {/* Origin / Destination Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="w-0.5 h-6 bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-rose-500" />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Origin Point</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Suburban Bus Stand, Mysuru">Suburban Bus Stand (KSRTC)</option>
                <option value="Mysuru Palace South Gate">Mysuru Palace South Gate</option>
                <option value="K.R. Circle">K.R. Circle</option>
                <option value="Kuvempunagar Complex">Kuvempunagar Complex</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Jayalakshmipuram, Mysuru">Jayalakshmipuram (VVCE / Temple Rd)</option>
                <option value="Gokulam 3rd Stage">Gokulam 3rd Stage</option>
                <option value="K.R. Hospital Casualty">K.R. Hospital Casualty</option>
                <option value="Chamundi Hill Foothills">Chamundi Hill Foothills</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Route Cards Comparison */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Analyzed Route Corridors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isSafest = route.type === 'safest';

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`relative rounded-2xl p-5 border cursor-pointer transition-all ${
                  isSelected
                    ? isSafest
                      ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isSafest ? (
                      <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                        SAFEST ROUTE
                      </Badge>
                    ) : (
                      <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                        FASTEST (CAUTION)
                      </Badge>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      {route.distance} • {route.duration}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">Safety Score</span>
                    <span
                      className={`text-lg font-black font-mono ${
                        route.safetyScore >= 80
                          ? 'text-emerald-400'
                          : route.safetyScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {route.safetyScore}/100
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mt-3">{route.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{route.description}</p>

                {/* Score meters */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        Illumination
                      </span>
                      <span className="text-white font-bold">{route.lightingIndex}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${route.lightingIndex}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-sky-400" />
                        Police Proximity
                      </span>
                      <span className="text-white font-bold">{route.policeProximityScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full"
                        style={{ width: `${route.policeProximityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Status: {isSelected ? 'Selected Active Path' : 'Click to select'}
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

      {/* Navigation Dispatch Action */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Route className="w-4 h-4 text-emerald-400" />
            {isNavigating ? 'Active Safe Corridor Escort' : 'Ready to Navigate'}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeRoute.title} ({activeRoute.distance})
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isNavigating ? (
            <button
              onClick={() => setIsNavigating(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 text-xs font-bold"
            >
              End Navigation
            </button>
          ) : (
            <button
              onClick={() => setIsNavigating(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5"
            >
              Start Safe Escort
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isNavigating && (
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-300 font-mono space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">ACTIVE GPS CORRIDOR MONITORING</span>
          </div>
          <p className="text-slate-300">
            Following Sayyaji Rao heritage corridor. If you deviate more than 200m into unlit alleys, an automatic check-in prompt will be dispatched.
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Footprints,
  Clock,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Play,
  Square,
  Navigation,
  PhoneCall,
} from 'lucide-react';
import { GeoState } from '../hooks/useGeolocation';
import { Badge } from '../components/Badge';

interface WalkWithMeProps {
  geoState: GeoState;
  onOpenSiren: () => void;
}

export const WalkWithMe: React.FC<WalkWithMeProps> = ({ geoState, onOpenSiren }) => {
  const [isActive, setIsActive] = useState(false);
  const [destination, setDestination] = useState('Kuvempunagar Bus Depot, Mysuru');
  const [etaMinutes, setEtaMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [checkInSecondsLeft, setCheckInSecondsLeft] = useState(5 * 60);
  const [isEscalated, setIsEscalated] = useState(false);
  const [checkInsCompleted, setCheckInsCompleted] = useState(0);

  // Timer loop
  useEffect(() => {
    let timer: number;
    if (isActive && !isEscalated) {
      timer = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsEscalated(true);
            return 0;
          }
          return prev - 1;
        });

        setCheckInSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsEscalated(true); // Missed periodic check-in
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [isActive, isEscalated]);

  const handleStartWalk = () => {
    setSecondsLeft(etaMinutes * 60);
    setCheckInSecondsLeft(Math.min(5 * 60, etaMinutes * 60));
    setIsEscalated(false);
    setCheckInsCompleted(0);
    setIsActive(true);
  };

  const handleStopWalk = () => {
    setIsActive(false);
    setIsEscalated(false);
  };

  const handleImSafeCheckIn = () => {
    setCheckInSecondsLeft(5 * 60);
    setCheckInsCompleted((prev) => prev + 1);
  };

  const handleSimulateMissedCheckIn = () => {
    setIsEscalated(true);
    setCheckInSecondsLeft(0);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Walk With Me (Virtual Escort)</h2>
          <Badge variant="success">LIVE ESCORT</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Automated safety timer. If you miss your check-in or fail to arrive within your ETA, alerts are dispatched.
        </p>
      </div>

      {!isActive ? (
        /* Configuration Form */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Set Up Transit Escort
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Where are you walking to?
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Home via Sayyaji Rao Road, Kuvempunagar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">
                  Estimated Walk Duration (ETA)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">{etaMinutes} mins</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={etaMinutes}
                onChange={(e) => setEtaMinutes(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>5m</span>
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="font-mono font-bold text-slate-300 block">Safety Protocol:</span>
              <p>• Regular check-in requested every 5 minutes.</p>
              <p>• If check-in fails, audio alarm activates & emergency contacts are notified with live GPS coordinates.</p>
            </div>
          </div>

          <button
            onClick={handleStartWalk}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Virtual Escort Session
          </button>
        </div>
      ) : (
        /* Active Walk Session */
        <div className="space-y-4">
          <div
            className={`border-2 rounded-3xl p-6 text-center space-y-4 shadow-2xl transition-all ${
              isEscalated
                ? 'bg-rose-950/40 border-rose-500 animate-pulse'
                : 'bg-slate-900 border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant={isEscalated ? 'danger' : 'success'}>
                {isEscalated ? 'CHECK-IN MISSED (ESCALATED)' : 'SESSION IN TRANSIT'}
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                Check-ins: {checkInsCompleted}
              </span>
            </div>

            {/* Big Countdown Clocks */}
            <div className="py-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                Overall ETA Countdown
              </span>
              <h2 className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight mt-1">
                {formatTimer(secondsLeft)}
              </h2>
            </div>

            {/* Periodic Check-in Meter */}
            {!isEscalated && (
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Next Check-in Due:
                  </span>
                  <span className="font-bold text-amber-400">{formatTimer(checkInSecondsLeft)}</span>
                </div>

                <button
                  onClick={handleImSafeCheckIn}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I&apos;m Safe (Confirm Check-In)
                </button>
              </div>
            )}

            {/* Escalation Emergency State */}
            {isEscalated && (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-500/40 text-left space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
                  <AlertOctagon className="w-4 h-4" />
                  EMERGENCY PROTOCOL TRIGGERED:
                </div>
                <p className="text-xs text-slate-300">
                  Missed check-in detected along route to {destination}. Emergency coordinates:
                  {geoState.coords[0].toFixed(5)}, {geoState.coords[1].toFixed(5)}.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onOpenSiren}
                    className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5"
                  >
                    Activate Siren
                  </button>
                  <a
                    href="tel:112"
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    Call 112
                  </a>
                </div>
              </div>
            )}

            {/* Stop Walk / Test Simulator controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
              <button
                onClick={handleStopWalk}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 text-rose-400" />
                End Walk (Arrived Safely)
              </button>

              {!isEscalated && (
                <button
                  onClick={handleSimulateMissedCheckIn}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 text-amber-400 border border-amber-500/30 text-[11px] font-mono"
                >
                  [Demo: Simulate Missed Check-In]
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2 font-mono text-[11px]">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Destination: {destination}</span>
          </div>
        </div>
      )}
    </div>
  );
};

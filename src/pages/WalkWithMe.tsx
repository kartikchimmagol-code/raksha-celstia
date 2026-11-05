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
  Info,
  Share2,
} from 'lucide-react';
import { GeoState } from '../hooks/useGeolocation';

interface WalkWithMeProps {
  geoState: GeoState;
  onOpenSiren: () => void;
  initialDestination?: string;
  initialEtaMins?: number;
}

export const WalkWithMe: React.FC<WalkWithMeProps> = ({
  geoState,
  onOpenSiren,
  initialDestination,
  initialEtaMins,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [destination, setDestination] = useState(
    initialDestination || 'Mysuru Railway Station'
  );
  const [etaMinutes, setEtaMinutes] = useState(initialEtaMins || 15);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [checkInSecondsLeft, setCheckInSecondsLeft] = useState(5 * 60);
  const [isEscalated, setIsEscalated] = useState(false);
  const [checkInsCompleted, setCheckInsCompleted] = useState(0);

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
    if (initialEtaMins) {
      setEtaMinutes(initialEtaMins);
      setSecondsLeft(initialEtaMins * 60);
    }
  }, [initialDestination, initialEtaMins]);

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
            setIsEscalated(true);
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

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto animate-in fade-in">
      {/* Live Journey Progress Card */}
      <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFD400]/15 border border-[#FFD400]/40 flex items-center justify-center text-[#FFD400]">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Walk With Me Guardian</h3>
              <p className="text-[11px] text-[#A0A0A0]">
                {isActive ? 'Live Journey Tracking Active' : 'Standby Mode'}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isActive
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 animate-pulse'
                : 'bg-[#090909] text-[#A0A0A0] border-[#2A2A2A]'
            }`}
          >
            {isActive ? 'MONITORING' : 'READY'}
          </span>
        </div>

        {/* Destination & ETA Setup (When Inactive) */}
        {!isActive ? (
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Where are you walking to?
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kuvempunagar Bus Depot, Mysuru"
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Estimated Transit Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 25, 40].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setEtaMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      etaMinutes === mins
                        ? 'bg-[#FFD400] text-[#090909] shadow-md shadow-[#FFD400]/20'
                        : 'bg-[#090909] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartWalk}
              className="w-full py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-[#090909] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#FFD400]/25 transition-all active:scale-98 mt-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Walk Escort</span>
            </button>
          </div>
        ) : (
          /* Active Countdown & Check-in Controls */
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#090909] rounded-2xl border border-[#2A2A2A] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#A0A0A0] uppercase block">
                  DESTINATION
                </span>
                <span className="text-sm font-bold text-white">{destination}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#A0A0A0] uppercase block">
                  TOTAL ETA REMAINING
                </span>
                <span className="text-xl font-extrabold font-mono text-[#FFD400]">
                  {formatTimer(secondsLeft)}
                </span>
              </div>
            </div>

            {/* Periodic Check-in Button */}
            <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs text-[#A0A0A0]">Next Routine Safety Check-In in:</span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {formatTimer(checkInSecondsLeft)}
              </div>

              <button
                onClick={handleImSafeCheckIn}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I&apos;m Safe • Reset Check-in ({checkInsCompleted} logged)</span>
              </button>
            </div>

            {/* Stop Escort Button */}
            <button
              onClick={handleStopWalk}
              className="w-full py-2.5 rounded-2xl bg-[#090909] border border-[#2A2A2A] hover:border-[#FF3434]/50 text-xs font-bold text-[#A0A0A0] hover:text-[#FF3434] transition-colors"
            >
              End Journey Escort
            </button>
          </div>
        )}
      </div>

      {/* Escalation Warning Modal If Missed */}
      {isEscalated && (
        <div className="p-4 rounded-3xl bg-[#FF3434]/20 border border-[#FF3434]/50 shadow-2xl space-y-3 animate-in zoom-in-95">
          <div className="flex items-center gap-2 text-[#FF3434]">
            <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
            <h4 className="font-extrabold text-sm">Routine Check-In Overdue!</h4>
          </div>
          <p className="text-xs text-white leading-relaxed">
            You missed your safety check-in. If you are in distress, sound the siren or call 112 immediately.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenSiren}
              className="flex-1 py-2 rounded-xl bg-[#FF3434] text-white font-bold text-xs shadow-lg"
            >
              Trigger Siren
            </button>
            <button
              onClick={handleImSafeCheckIn}
              className="flex-1 py-2 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-white font-bold text-xs"
            >
              I Am Safe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

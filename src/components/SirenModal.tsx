import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, PhoneCall, X, AlertTriangle } from 'lucide-react';
import { useEmergencyAudio } from '../hooks/useEmergencyAudio';

interface SirenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SirenModal: React.FC<SirenModalProps> = ({ isOpen, onClose }) => {
  const { isPlaying, startSiren, stopSiren } = useEmergencyAudio();
  const [strobeActive, setStrobeActive] = useState(true);
  const [isStrobeColorRed, setIsStrobeColorRed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startSiren();
    } else {
      stopSiren();
    }
    return () => {
      stopSiren();
    };
  }, [isOpen, startSiren, stopSiren]);

  // Screen strobe effect
  useEffect(() => {
    if (!isOpen || !strobeActive) return;
    const interval = window.setInterval(() => {
      setIsStrobeColorRed((prev) => !prev);
    }, 280);
    return () => window.clearInterval(interval);
  }, [isOpen, strobeActive]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-150 ${
        strobeActive && isStrobeColorRed ? 'bg-red-950/85' : 'bg-slate-950/95'
      }`}
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-3xl p-6 text-center shadow-2xl animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Acoustic Emergency Alarm
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          High-decibel acoustic deterrent active to attract immediate public attention and deter threats.
        </p>

        {/* Visual Strobe toggle */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setStrobeActive(!strobeActive)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
              strobeActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Visual Strobe: {strobeActive ? 'ACTIVE' : 'PAUSED'}
          </button>
        </div>

        {/* Primary Siren Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              if (isPlaying) {
                stopSiren();
              } else {
                startSiren();
              }
            }}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-5 h-5" />
                MUTE SIREN
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                RESUME SIREN
              </>
            )}
          </button>

          <a
            href="tel:112"
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold flex items-center justify-center gap-2 text-xs"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Direct Dial: Namma 112 (Karnataka Police)
          </a>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Dismiss and return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

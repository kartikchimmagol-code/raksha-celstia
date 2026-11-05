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
    }, 250);
    return () => window.clearInterval(interval);
  }, [isOpen, strobeActive]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-150 ${
        strobeActive && isStrobeColorRed ? 'bg-red-950/90' : 'bg-slate-950/95'
      }`}
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 text-center shadow-2xl shadow-rose-950/80 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-20 h-20 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center mb-4 animate-ping" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white mt-6 uppercase tracking-wider">
          Acoustic Emergency Alarm
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          High-decibel acoustic deterrent active to attract immediate public attention and deter threats.
        </p>

        {/* Strobe toggle */}
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
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
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
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Call Namma 112 (Karnataka Police)
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Dismiss and return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

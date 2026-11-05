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
        strobeActive && isStrobeColorRed ? 'bg-[#FF3434]/80' : 'bg-[#090909]/95'
      }`}
    >
      <div className="relative w-full max-w-sm bg-[#1C1C1C] border-2 border-[#FF3434] rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-white rounded-full bg-[#090909]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FF3434]/20 border border-[#FF3434]/50 flex items-center justify-center text-[#FF3434] mb-4">
          <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />
        </div>

        <h2 className="text-lg font-extrabold text-white uppercase tracking-wider">
          Acoustic Emergency Alarm
        </h2>
        <p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed">
          High-decibel acoustic deterrent active to attract immediate public attention and deter threats.
        </p>

        <div className="mt-5 space-y-2.5">
          <button
            onClick={() => {
              if (isPlaying) stopSiren();
              else startSiren();
            }}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-[#FF3434] text-white hover:bg-[#ff4d4d]'
                : 'bg-[#FFD400] text-[#090909] hover:bg-[#ffe033]'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Silence Alarm Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Resume Siren Sound</span>
              </>
            )}
          </button>

          <a
            href="tel:112"
            className="w-full py-3 rounded-2xl bg-[#090909] border border-[#2A2A2A] hover:border-[#FFD400] text-[#FFD400] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Dial Police 112 Speed-Dial</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs font-semibold text-[#A0A0A0] hover:text-white transition-colors"
          >
            Dismiss Siren
          </button>
        </div>
      </div>
    </div>
  );
};

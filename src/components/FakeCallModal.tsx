import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, UserCheck, ShieldCheck, X } from 'lucide-react';

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FakeCallModal: React.FC<FakeCallModalProps> = ({ isOpen, onClose }) => {
  const [callerName, setCallerName] = useState('Home / Appa (Mysuru)');
  const [callState, setCallState] = useState<'incoming' | 'connected'>('incoming');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: number;
    if (callState === 'connected') {
      timer = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    if (isOpen) {
      setCallState('incoming');
      setSeconds(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCallTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-[560px] bg-[#1C1C1C] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-white rounded-full bg-[#090909]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Caller Header */}
        <div className="mt-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#090909] border-2 border-[#FFD400] flex items-center justify-center shadow-lg shadow-[#FFD400]/10 mb-3">
            <UserCheck className="w-10 h-10 text-[#FFD400]" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-wide">{callerName}</h3>
          <p className="text-xs font-mono text-[#FFD400] mt-1">
            {callState === 'incoming' ? 'Incoming Escape Call...' : formatCallTime(seconds)}
          </p>

          {/* Caller Quick Selector */}
          <div className="flex gap-1.5 mt-3">
            {['Home / Appa', 'Police Control', 'Cab Driver'].map((opt) => (
              <button
                key={opt}
                onClick={() => setCallerName(opt)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  callerName.startsWith(opt.split(' ')[0])
                    ? 'bg-[#FFD400] text-[#090909] font-bold border-[#FFD400]'
                    : 'bg-[#090909] text-[#A0A0A0] border-[#2A2A2A] hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Simulation Wave */}
        <div className="flex items-center gap-1.5 py-6">
          {[4, 8, 14, 22, 18, 12, 6, 16, 24, 18, 8, 5].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-[#FFD400] transition-all duration-200 ${
                callState === 'connected' ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{ height: `${h * 1.5}px` }}
            />
          ))}
        </div>

        {/* Bottom Call Action Buttons */}
        <div className="w-full flex items-center justify-around pb-4">
          {callState === 'incoming' ? (
            <>
              {/* Decline Call */}
              <button
                onClick={onClose}
                className="w-16 h-16 rounded-full bg-[#FF3434] hover:bg-[#ff4d4d] flex items-center justify-center text-white shadow-xl shadow-[#FF3434]/30 transition-transform active:scale-95"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Accept Call */}
              <button
                onClick={() => setCallState('connected')}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 animate-bounce"
              >
                <Phone className="w-7 h-7" />
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-16 h-16 rounded-full bg-[#FF3434] hover:bg-[#ff4d4d] flex items-center justify-center text-white shadow-xl shadow-[#FF3434]/30 transition-transform active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

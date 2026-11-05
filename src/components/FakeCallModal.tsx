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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-[560px] bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Caller Header */}
        <div className="mt-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-lg mb-3">
            <UserCheck className="w-10 h-10 text-slate-300" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-wide">{callerName}</h3>
          <p className="text-xs font-mono text-emerald-400 mt-1">
            {callState === 'incoming' ? 'Incoming Escape Call...' : formatCallTime(seconds)}
          </p>

          {/* Caller Quick Selector */}
          {callState === 'incoming' && (
            <div className="mt-3 flex gap-1.5 flex-wrap justify-center">
              {['Home / Appa', 'Mysuru Inspector Rao', 'Brother (Kuvempunagar)'].map((name) => (
                <button
                  key={name}
                  onClick={() => setCallerName(name)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    callerName === name
                      ? 'bg-teal-600/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Escape Script Prompt */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-left w-full text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tactical Escape Script:</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            &quot;Hey, yes I am right outside near K.R. Circle. I see your car approaching now. Wait right there by the streetlight.&quot;
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="w-full flex items-center justify-around pb-4">
          {callState === 'incoming' ? (
            <>
              {/* Decline */}
              <button
                onClick={onClose}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-950 transition-all active:scale-95">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-400">Decline</span>
              </button>

              {/* Accept */}
              <button
                onClick={() => setCallState('connected')}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950 transition-all active:scale-95 animate-pulse">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Accept Call</span>
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-950 transition-all active:scale-95">
                <PhoneOff className="w-6 h-6" />
              </div>
              <span className="text-xs text-red-400 font-medium">End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className="w-full max-w-sm h-[580px] bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-full bg-slate-800/40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Caller Header */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 flex items-center justify-center shadow-lg mb-4">
            <UserCheck className="w-12 h-12 text-slate-300" />
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide">{callerName}</h3>
          <p className="text-sm font-mono text-emerald-400 mt-1">
            {callState === 'incoming' ? 'Incoming Emergency Call...' : formatCallTime(seconds)}
          </p>

          {/* Caller Quick Selector */}
          {callState === 'incoming' && (
            <div className="mt-4 flex gap-1.5 flex-wrap justify-center">
              {['Home / Appa', 'Mysuru Inspector Rao', 'Brother (Kuvempunagar)'].map((name) => (
                <button
                  key={name}
                  onClick={() => setCallerName(name)}
                  className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                    callerName === name
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Escape Script Hint */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left w-full text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escape Script Prompt:</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            &quot;Hey, yes I am right outside near the main road light. I can see your vehicle arriving now. Wait right there.&quot;
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="w-full flex items-center justify-around pb-6">
          {callState === 'incoming' ? (
            <>
              {/* Decline */}
              <button
                onClick={onClose}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-950 transition-all active:scale-95">
                  <PhoneOff className="w-7 h-7" />
                </div>
                <span className="text-xs text-slate-400">Decline</span>
              </button>

              {/* Accept */}
              <button
                onClick={() => setCallState('connected')}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950 transition-all active:scale-95 animate-pulse">
                  <Phone className="w-7 h-7" />
                </div>
                <span className="text-xs text-emerald-400 font-medium">Accept Call</span>
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-950 transition-all active:scale-95">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs text-rose-400 font-medium">End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, Volume2, PhoneIncoming, Radio, EyeOff } from 'lucide-react';
import { GeoState } from '../hooks/useGeolocation';

interface NavbarProps {
  geoState: GeoState;
  onOpenSiren: () => void;
  onOpenFakeCall: () => void;
  isDecoyMode: boolean;
  onToggleDecoy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  geoState,
  onOpenSiren,
  onOpenFakeCall,
  isDecoyMode,
  onToggleDecoy,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-lg shadow-rose-950/50">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                RAKSHA
              </h1>
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                CELESTIA
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Radio className={`w-3 h-3 ${geoState.isLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span>{geoState.isLive ? 'Mysuru GPS Active' : 'Mysuru Pilot Mode'}</span>
            </div>
          </div>
        </div>

        {/* Quick Tactical Escape & Siren Tools */}
        <div className="flex items-center gap-2">
          {/* Decoy Disguise Button */}
          <button
            onClick={onToggleDecoy}
            title={isDecoyMode ? 'Exit Decoy Disguise' : 'Decoy Disguise: Disguise app as Notes'}
            className="p-2 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 active:scale-95"
          >
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Decoy</span>
          </button>

          {/* Fake Call Trigger */}
          <button
            onClick={onOpenFakeCall}
            title="Simulated Incoming Call to escape awkward/threatening situations"
            className="p-2 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 active:scale-95"
          >
            <PhoneIncoming className="w-4 h-4 text-sky-400 animate-bounce" />
            <span className="hidden sm:inline">Fake Call</span>
          </button>

          {/* Alarm Siren Trigger */}
          <button
            onClick={onOpenSiren}
            title="Acoustic Emergency Alarm Siren"
            className="px-3 py-2 text-xs rounded-lg font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/60 active:scale-95 border border-rose-500/40"
          >
            <Volume2 className="w-4 h-4" />
            <span className="tracking-wide">SIREN</span>
          </button>
        </div>
      </div>
    </header>
  );
};

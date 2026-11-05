import React from 'react';
import { Shield, Volume2, PhoneIncoming, Radio, EyeOff, ShieldAlert } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Telemetry */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-teal-400 shadow-md">
            <ShieldAlert className="w-5 h-5 text-teal-400" />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                geoState.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-white">
                RAKSHA
              </h1>
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                CELESTIA
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Radio
                className={`w-3 h-3 ${
                  geoState.isLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                }`}
              />
              <span>{geoState.isLive ? 'Mysuru GPS Active' : 'Mysuru Grid Mode'}</span>
            </div>
          </div>
        </div>

        {/* Tactical Actions */}
        <div className="flex items-center gap-2">
          {/* Decoy Toggle */}
          <button
            onClick={onToggleDecoy}
            title={isDecoyMode ? 'Exit Decoy Disguise' : 'Decoy Mode: Disguise app as Study Notes'}
            className="p-2 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 active:scale-95"
          >
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Decoy</span>
          </button>

          {/* Fake Call Trigger */}
          <button
            onClick={onOpenFakeCall}
            title="Simulated Incoming Call to escape awkward/threatening situations"
            className="p-2 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 border border-slate-800 bg-slate-900 hover:bg-slate-850 text-sky-300 active:scale-95"
          >
            <PhoneIncoming className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Fake Call</span>
          </button>

          {/* Emergency Siren Trigger */}
          <button
            onClick={onOpenSiren}
            title="Acoustic Emergency Alarm Siren"
            className="px-3 py-2 text-xs rounded-xl font-bold transition-all flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/60 active:scale-95 border border-red-500/40 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span className="tracking-wide">SIREN</span>
          </button>
        </div>
      </div>
    </header>
  );
};

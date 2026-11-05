import React from 'react';
import { ShieldCheck, AlertTriangle, Info, X, CheckCircle2 } from 'lucide-react';

interface MapLegendProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-30 w-72 max-h-[calc(100%-80px)] overflow-y-auto bg-[#1C1C1C]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl p-4 shadow-2xl text-xs space-y-3.5 animate-in fade-in select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFD400]" />
          <h3 className="font-bold text-white text-xs tracking-tight">Tactical Map Legend</h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#A0A0A0] hover:text-white p-1 rounded-lg hover:bg-[#252525] transition-colors"
          title="Close Legend"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Categories */}
      <div className="space-y-2.5">
        {/* Selected Route */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-2 rounded-full bg-[#FFD400] shrink-0 mt-1 shadow-sm shadow-[#FFD400]/40" />
          <div>
            <div className="font-bold text-white text-[11px]">Selected Safe Corridor</div>
            <p className="text-[10px] text-[#A0A0A0]">
              Optimal arterial route calculated via OSRM / OpenStreetMap Foot Engine.
            </p>
          </div>
        </div>

        {/* Alternative Route */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-2 rounded-full bg-[#6B7280] shrink-0 mt-1" />
          <div>
            <div className="font-bold text-slate-300 text-[11px]">Alternative Route</div>
            <p className="text-[10px] text-[#A0A0A0]">
              Secondary route option available for traffic or personal preference.
            </p>
          </div>
        </div>

        {/* Police */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] shrink-0 border border-blue-400">
            🛡️
          </div>
          <div>
            <div className="font-bold text-white text-[11px]">Police Stations (10)</div>
            <p className="text-[10px] text-[#A0A0A0]">
              Verified Mysuru City Police stations with 24/7 ERSS patrol units.
            </p>
          </div>
        </div>

        {/* Hospitals */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] shrink-0 border border-red-400">
            ✚
          </div>
          <div>
            <div className="font-bold text-white text-[11px]">Hospitals &amp; Trauma (7)</div>
            <p className="text-[10px] text-[#A0A0A0]">
              Tertiary medical trauma centers (K.R. Hospital, Apollo, JSS, MMCRI).
            </p>
          </div>
        </div>

        {/* GPS */}
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#FFD400] flex items-center justify-center text-[10px] shrink-0 border-2 border-[#090909]">
            📍
          </div>
          <div>
            <div className="font-bold text-[#FFD400] text-[11px]">Your Live GPS Position</div>
            <p className="text-[10px] text-[#A0A0A0]">
              Browser geolocation coordinate beacon.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Score Transparent Explanation */}
      <div className="p-2.5 bg-[#090909] rounded-xl border border-[#2A2A2A] space-y-1 text-[10px] text-[#A0A0A0]">
        <div className="flex items-center gap-1 font-bold text-white">
          <Info className="w-3 h-3 text-[#FFD400]" />
          <span>Objective Methodology</span>
        </div>
        <p className="leading-tight">
          Scores are physical proximity weights to police/hospitals and 4-lane arterial street illumination.
        </p>
      </div>
    </div>
  );
};

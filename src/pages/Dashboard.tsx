import React from 'react';
import {
  MapPin,
  Sparkles,
  Shield,
  AlertCircle,
  Footprints,
  Phone,
  ArrowRight,
  ShieldAlert,
  Volume2,
  PhoneCall,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from '../types';
import { GeoState } from '../hooks/useGeolocation';

interface DashboardProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSOS: () => void;
  onOpenSiren: () => void;
  onTriggerFakeCall: () => void;
  geoState: GeoState;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTab,
  onOpenSOS,
  onOpenSiren,
  onTriggerFakeCall,
  geoState,
  userName = 'Kartik',
}) => {
  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      {/* Hero Banner: RAKSHA CELESTIA Showcase (Matches Mockup 2) */}
      <div
        onClick={() => onSelectTab('map')}
        className="relative overflow-hidden rounded-3xl bg-[#1C1C1C] border border-[#2A2A2A] p-5 shadow-2xl cursor-pointer group transition-all duration-300 hover:border-[#FFD400]/50"
      >
        {/* Background Visual Graphic with Mysuru Architecture Silhouette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/90 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600100397608-f010f443834a?auto=format&fit=crop&w=800&q=80")',
          }}
        />

        <div className="relative z-20 flex items-center justify-between">
          <div className="space-y-1 max-w-[75%]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD400] font-bold block">
              Mysuru City Defense System
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              RAKSHA CELESTIA
            </h2>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Personal Safety &amp; Digital Fraud Awareness
            </p>
          </div>

          {/* Yellow Arrow CTA Button */}
          <div className="w-11 h-11 rounded-full bg-[#FFD400] text-[#090909] flex items-center justify-center shrink-0 shadow-lg shadow-[#FFD400]/25 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Primary 6-Card Action Grid (Matches Mockup 2 Exactly) */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Tactical Map */}
        <div
          onClick={() => onSelectTab('map')}
          className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] mb-3 group-hover:bg-[#FFD400]/10 transition-colors">
            <MapPin className="w-5 h-5 text-[#FFD400]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors">
              Tactical Map
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Safe routes &amp; nearby help
            </p>
          </div>
        </div>

        {/* 2. Rakshak AI */}
        <div
          onClick={() => onSelectTab('rakshak')}
          className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] mb-3 group-hover:bg-[#FFD400]/10 transition-colors">
            <Sparkles className="w-5 h-5 text-[#FFD400]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors">
              Rakshak AI
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Safety guidance with Gemini
            </p>
          </div>
        </div>

        {/* 3. Fraud Shield */}
        <div
          onClick={() => onSelectTab('fraud')}
          className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] mb-3 group-hover:bg-[#FFD400]/10 transition-colors">
            <Shield className="w-5 h-5 text-[#FFD400]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors">
              Fraud Shield
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Check SMS, URLs &amp; suspicious content
            </p>
          </div>
        </div>

        {/* 4. Emergency SOS */}
        <div
          onClick={onOpenSOS}
          className="bg-[#1C1C1C] border border-[#FF3434]/40 hover:border-[#FF3434] rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group shadow-lg shadow-[#FF3434]/5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF3434]/15 border border-[#FF3434]/40 flex items-center justify-center text-[#FF3434] mb-3 group-hover:bg-[#FF3434]/25 transition-colors">
            <AlertCircle className="w-5 h-5 text-[#FF3434]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#FF3434] group-hover:text-white transition-colors">
              Emergency SOS
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Quick alert to your contacts
            </p>
          </div>
        </div>

        {/* 5. Walk With Me */}
        <div
          onClick={() => onSelectTab('walk')}
          className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] mb-3 group-hover:bg-[#FFD400]/10 transition-colors">
            <Footprints className="w-5 h-5 text-[#FFD400]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors">
              Walk With Me
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Share your live journey
            </p>
          </div>
        </div>

        {/* 6. Helplines */}
        <div
          onClick={() => onSelectTab('helplines')}
          className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/40 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-98 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#FFD400] mb-3 group-hover:bg-[#FFD400]/10 transition-colors">
            <Phone className="w-5 h-5 text-[#FFD400]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors">
              Helplines
            </h3>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">
              Police, Medical &amp; Cyber (1930)
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Quick Safety Utilities (Siren & Fake Call) */}
      <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Instant Deterrents</span>
          <span className="text-[10px] font-mono text-[#A0A0A0]">Discrete Actions</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenSiren}
            className="py-2.5 px-3 rounded-xl bg-[#090909] border border-[#2A2A2A] hover:border-[#FF3434]/60 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-[#FF3434]" />
            <span>Sound Siren</span>
          </button>

          <button
            onClick={onTriggerFakeCall}
            className="py-2.5 px-3 rounded-xl bg-[#090909] border border-[#2A2A2A] hover:border-[#FFD400]/60 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-[#FFD400]" />
            <span>Fake Call Escape</span>
          </button>
        </div>
      </div>

      {/* Live System Status Strip */}
      <div className="p-3 rounded-2xl bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium text-[11px]">ERSS 112 &amp; Cyber 1930 Active</span>
        </div>
        <span className="text-[10px] font-mono text-[#A0A0A0]">Mysuru Grid Online</span>
      </div>
    </div>
  );
};

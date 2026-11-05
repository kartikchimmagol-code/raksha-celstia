import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  PhoneCall,
  MapPin,
  Route,
  FileSearch,
  Users,
  Footprints,
  Volume2,
  Copy,
  Check,
  Radio,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { GeoState } from '../hooks/useGeolocation';
import { EmergencyContact } from '../types';
import { Badge } from '../components/Badge';
import { TabKey } from '../components/BottomNav';

interface DashboardProps {
  geoState: GeoState;
  contacts: EmergencyContact[];
  onNavigateTab: (tab: TabKey) => void;
  onOpenSiren: () => void;
  onOpenFakeCall: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  geoState,
  contacts,
  onNavigateTab,
  onOpenSiren,
  onOpenFakeCall,
}) => {
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: number;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = window.setInterval(() => {
        setSosCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (sosCountdown === 0) {
      setIsSosActive(true);
      setSosCountdown(null);
    }
    return () => window.clearInterval(timer);
  }, [sosCountdown]);

  const handleTriggerSos = () => {
    setSosCountdown(3);
  };

  const handleCancelSos = () => {
    setSosCountdown(null);
    setIsSosActive(false);
  };

  const googleMapsLink = `https://www.google.com/maps?q=${geoState.coords[0]},${geoState.coords[1]}`;
  const emergencyMessage = `[EMERGENCY SOS via RAKSHA] I need immediate help. My current Mysuru coordinates: ${googleMapsLink} (Lat: ${geoState.coords[0].toFixed(5)}, Lng: ${geoState.coords[1].toFixed(5)}). Please dispatch assistance.`;

  const copyEmergencyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Telemetry Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="success" icon={<Radio className="w-3 h-3 text-emerald-400" />}>
                TELEMETRY ACTIVE
              </Badge>
              <Badge variant="neutral">MYSURU SECTOR 01</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personal Safety Command
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              LAT: {geoState.coords[0].toFixed(4)}°N | LNG: {geoState.coords[1].toFixed(4)}°E
              {geoState.accuracy ? ` (±${geoState.accuracy}m accuracy)` : ' (Mysuru Grid Centered)'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Sector Safety Index
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">92/100</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main SOS Trigger Hub */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-4">
          <span className="inline-block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
            ONE-TOUCH EMERGENCY BROADCAST
          </span>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {sosCountdown !== null
              ? `Broadcasting in ${sosCountdown} seconds...`
              : isSosActive
              ? 'EMERGENCY SOS BROADCAST ACTIVE'
              : 'Press & Hold for Emergency Broadcast'}
          </h3>

          {/* Big Circular SOS Button */}
          <div className="py-2 flex justify-center">
            {sosCountdown !== null ? (
              <button
                onClick={handleCancelSos}
                className="w-36 h-36 rounded-full bg-slate-800 border-4 border-amber-500 text-amber-400 font-black text-2xl shadow-2xl flex flex-col items-center justify-center animate-pulse active:scale-95"
              >
                <span className="text-4xl">{sosCountdown}</span>
                <span className="text-[11px] uppercase tracking-wider mt-1 text-slate-300">
                  Cancel
                </span>
              </button>
            ) : isSosActive ? (
              <div className="space-y-3">
                <div className="w-36 h-36 mx-auto rounded-full bg-red-600 border-4 border-white text-white font-black text-lg shadow-2xl flex flex-col items-center justify-center animate-bounce">
                  <AlertOctagon className="w-10 h-10" />
                  <span className="text-xs uppercase mt-1 tracking-widest">SOS ACTIVE</span>
                </div>
                <button
                  onClick={handleCancelSos}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700"
                >
                  Reset SOS Alert
                </button>
              </div>
            ) : (
              <button
                onClick={handleTriggerSos}
                className="w-36 h-36 rounded-full bg-red-600 hover:bg-red-500 border-4 border-red-400/40 text-white font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <AlertOctagon className="w-10 h-10" />
                <span className="tracking-widest">SOS</span>
                <span className="text-[10px] font-mono font-normal opacity-80">EMERGENCY</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {isSosActive
              ? 'Location packaged for dispatch. Transmit to your trusted guardians or dial Namma 112 below.'
              : 'Immediately packages live GPS coordinates, Google Maps links, and distress metadata.'}
          </p>

          {/* SOS Dispatch Card when Active */}
          {isSosActive && (
            <div className="bg-slate-950/80 border border-red-500/40 rounded-2xl p-4 text-left space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  COMPOSED EMERGENCY PAYLOAD:
                </span>
                <button
                  onClick={copyEmergencyMessage}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3 bg-black/50 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 leading-relaxed select-all">
                {emergencyMessage}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`sms:?body=${encodeURIComponent(emergencyMessage)}`}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open SMS App
                </a>
                <a
                  href="tel:112"
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  Call Namma 112
                </a>
              </div>

              <p className="text-[10px] text-slate-500 font-mono text-center">
                *Advisory Notice: In prototype mode, click above to open device messaging. No simulated background delivery is fabricated.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Core Safety Modules Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Core Safety Capabilities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tactical Map */}
          <button
            onClick={() => onNavigateTab('map')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Tactical Map</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Search & OSRM Routes</p>
            </div>
          </button>

          {/* Safe Corridor Routes */}
          <button
            onClick={() => onNavigateTab('routes')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Safe Routes</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Lighting Corridor Scores</p>
            </div>
          </button>

          {/* Fraud Shield */}
          <button
            onClick={() => onNavigateTab('fraud')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fraud Shield</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">SMS & Screenshot Scan</p>
            </div>
          </button>

          {/* Walk With Me */}
          <button
            onClick={() => onNavigateTab('walk')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between group active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Walk With Me</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Virtual Escort & ETA</p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Tactical Escape & Siren Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpenSiren}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Emergency Siren</h4>
              <p className="text-xs text-slate-400">High-decibel acoustic alarm</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-red-400 uppercase">Trigger →</span>
        </button>

        <button
          onClick={onOpenFakeCall}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Simulated Call</h4>
              <p className="text-xs text-slate-400">Tactile escape tool</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400 uppercase">Trigger →</span>
        </button>
      </div>

      {/* Guardians Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {contacts.length} Trusted Emergency Guardians
            </h4>
            <p className="text-xs text-slate-400">
              {contacts.length > 0
                ? `Primary: ${contacts[0].name} (${contacts[0].phone})`
                : 'No contacts added. Configure family or emergency contacts.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('contacts')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
        >
          Manage Guardians
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Bell,
  ArrowLeft,
  Navigation,
  Layers,
  Shield,
} from 'lucide-react';
import { NavTab } from '../types';
import { GeoState } from '../hooks/useGeolocation';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  geoState: GeoState;
  userName?: string;
  onOpenSOS?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  geoState,
  userName = 'Kartik',
  onOpenSOS,
}) => {
  // If on home dashboard, show user greeting header matching Mockup 2
  if (currentTab === 'dashboard') {
    return (
      <header className="sticky top-0 z-30 bg-[#090909]/95 backdrop-blur-xl border-b border-[#1C1C1C] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border-2 border-[#FFD400] flex items-center justify-center text-[#FFD400] font-bold text-sm shadow-md shadow-[#FFD400]/10">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Hello, {userName}
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              </div>
              <p className="text-[11px] text-[#A0A0A0]">
                Stay Safe in Mysuru
              </p>
            </div>
          </div>

          {/* Quick Actions (GPS indicator & Notification Bell) */}
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 border ${
                geoState.isLive
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : 'bg-[#1C1C1C] text-[#A0A0A0] border-[#2A2A2A]'
              }`}
              title={geoState.isLive ? 'GPS Location Active' : 'Mysuru Default City Center'}
            >
              <Navigation className="w-3 h-3 text-[#FFD400]" />
              <span className="hidden sm:inline">{geoState.isLive ? 'GPS Live' : 'Mysuru'}</span>
            </div>

            <button
              onClick={() => onSelectTab('helplines')}
              className="w-9 h-9 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#FFD400] transition-colors relative"
              title="Notifications & Helplines"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FFD400] absolute top-2 right-2 ring-2 ring-[#090909]" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Child Screen Header with Back Button (Map, AI, Fraud, Routes, etc.)
  const getScreenTitle = (tab: NavTab) => {
    switch (tab) {
      case 'map':
        return { title: 'Tactical Map', subtitle: 'Mysuru Verified Safety Layer' };
      case 'rakshak':
        return { title: 'Rakshak AI', subtitle: 'Powered by Gemini 3.8 Flash' };
      case 'fraud':
        return { title: 'Fraud Shield', subtitle: 'AI-Powered Threat Analysis' };
      case 'routes':
        return { title: 'Safe Routes', subtitle: 'Corridor Exposure Analysis' };
      case 'walk':
        return { title: 'Walk With Me', subtitle: 'Live Journey Guardian' };
      case 'contacts':
        return { title: 'Emergency Contacts', subtitle: 'Trusted Circle' };
      case 'helplines':
        return { title: 'Helplines Directory', subtitle: 'Verified Emergency Response' };
      default:
        return { title: 'RAKSHA', subtitle: 'Personal Safety Platform' };
    }
  };

  const { title, subtitle } = getScreenTitle(currentTab);

  return (
    <header className="sticky top-0 z-30 bg-[#090909]/95 backdrop-blur-xl border-b border-[#1C1C1C] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="w-9 h-9 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#FFD400] transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">{title}</h1>
            <p className="text-[11px] text-[#A0A0A0]">{subtitle}</p>
          </div>
        </div>

        {/* Top Right Quick Action */}
        {onOpenSOS && (
          <button
            onClick={onOpenSOS}
            className="px-2.5 py-1 rounded-full bg-[#FF3434]/15 border border-[#FF3434]/40 text-[#FF3434] text-[10px] font-bold tracking-tight hover:bg-[#FF3434]/25 transition-colors"
          >
            SOS
          </button>
        )}
      </div>
    </header>
  );
};

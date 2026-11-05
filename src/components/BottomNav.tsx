import React from 'react';
import { Home, MapPin, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSOS: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOS,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: Home },
    { id: 'map' as NavTab, label: 'Map', icon: MapPin },
    { id: 'rakshak' as NavTab, label: 'AI', icon: Sparkles },
    { id: 'fraud' as NavTab, label: 'Fraud', icon: Shield },
    { id: 'sos' as NavTab, label: 'SOS', icon: AlertCircle, isEmergency: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909]/95 backdrop-blur-xl border-t border-[#1C1C1C] px-3 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isEmergency) {
            return (
              <button
                key={tab.id}
                onClick={onOpenSOS}
                className="flex flex-col items-center justify-center py-1 px-3 group transition-transform active:scale-95"
                aria-label="Emergency SOS"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#FF3434]/20 border border-[#FF3434]/50 flex items-center justify-center group-hover:bg-[#FF3434]/30 transition-colors shadow-lg shadow-[#FF3434]/20">
                    <Icon className="w-4 h-4 text-[#FF3434]" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#FF3434] mt-1 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center py-1 px-3 group transition-all active:scale-95"
              aria-label={tab.label}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? 'text-[#FFD400]'
                    : 'text-[#A0A0A0] group-hover:text-white'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-[#FFD400]' : 'text-[#A0A0A0] group-hover:text-white'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

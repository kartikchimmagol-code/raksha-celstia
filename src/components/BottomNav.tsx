import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Route,
  FileSearch,
  Bot,
  Users,
  PhoneCall,
  Footprints,
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'map'
  | 'routes'
  | 'fraud'
  | 'assistant'
  | 'walk'
  | 'contacts'
  | 'helplines';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Command', icon: <ShieldAlert className="w-5 h-5" /> },
    { key: 'map', label: 'Tactical Map', icon: <MapPin className="w-5 h-5" /> },
    { key: 'routes', label: 'Safe Routes', icon: <Route className="w-5 h-5" /> },
    { key: 'fraud', label: 'Fraud Shield', icon: <FileSearch className="w-5 h-5" /> },
    { key: 'assistant', label: 'Rakshak AI', icon: <Bot className="w-5 h-5" /> },
    { key: 'walk', label: 'Walk With Me', icon: <Footprints className="w-5 h-5" /> },
    { key: 'contacts', label: 'Guardians', icon: <Users className="w-5 h-5" /> },
    { key: 'helplines', label: 'Helplines', icon: <PhoneCall className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-1.5 px-1.5 rounded-xl transition-all select-none ${
                isActive
                  ? 'text-teal-400 font-bold bg-slate-900 border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-105' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

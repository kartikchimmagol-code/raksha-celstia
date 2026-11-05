import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabKey } from './components/BottomNav';
import { SirenModal } from './components/SirenModal';
import { FakeCallModal } from './components/FakeCallModal';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { EmergencyContact } from './types';

// Tab Pages
import { Dashboard } from './pages/Dashboard';
import { MapView } from './pages/MapView';
import { RoutesView } from './pages/RoutesView';
import { FraudShield } from './pages/FraudShield';
import { RakshakAI } from './pages/RakshakAI';
import { WalkWithMe } from './pages/WalkWithMe';
import { ContactsView } from './pages/ContactsView';
import { HelplinesView } from './pages/HelplinesView';

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-1',
    name: 'Home / Amma',
    phone: '9845012345',
    relationship: 'Family',
    isPrimary: true,
  },
  {
    id: 'c-2',
    name: 'Brother (Kuvempunagar)',
    phone: '9845067890',
    relationship: 'Family',
    isPrimary: false,
  },
];

export function App() {
  const geoState = useGeolocation();
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>(
    'raksha_contacts',
    DEFAULT_CONTACTS
  );

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isSirenOpen, setIsSirenOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isDecoyMode, setIsDecoyMode] = useState(false);

  // Decoy Notes App Screen
  if (isDecoyMode) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col justify-between font-sans">
        <div className="max-w-lg mx-auto w-full space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-300">Quick Study Notes</h2>
            <button
              onClick={() => setIsDecoyMode(false)}
              className="text-xs text-slate-500 hover:text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg"
              title="Double tap to unlock RAKSHA"
            >
              Exit Notes
            </button>
          </div>
          <div className="space-y-3 text-xs text-slate-400 font-mono">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-semibold block mb-1">
                Operating Systems - Memory Management:
              </span>
              <p>• Paging breaks virtual memory into fixed-size blocks (pages).</p>
              <p>• Translation Lookaside Buffer (TLB) speeds up virtual-to-physical address mapping.</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-semibold block mb-1">
                Computer Networks:
              </span>
              <p>• TCP provides reliable, ordered byte-stream delivery with congestion control.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => setIsDecoyMode(false)}
            className="text-[11px] font-mono text-slate-600 hover:text-slate-400"
          >
            [Tap here to return to RAKSHA Command]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Sticky Command Bar */}
      <Navbar
        geoState={geoState}
        onOpenSiren={() => setIsSirenOpen(true)}
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        isDecoyMode={isDecoyMode}
        onToggleDecoy={() => setIsDecoyMode(!isDecoyMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-4 pb-12">
        {activeTab === 'dashboard' && (
          <Dashboard
            geoState={geoState}
            contacts={contacts}
            onNavigateTab={setActiveTab}
            onOpenSiren={() => setIsSirenOpen(true)}
            onOpenFakeCall={() => setIsFakeCallOpen(true)}
          />
        )}
        {activeTab === 'map' && <MapView geoState={geoState} />}
        {activeTab === 'routes' && <RoutesView />}
        {activeTab === 'fraud' && <FraudShield />}
        {activeTab === 'assistant' && <RakshakAI />}
        {activeTab === 'walk' && (
          <WalkWithMe
            geoState={geoState}
            onOpenSiren={() => setIsSirenOpen(true)}
          />
        )}
        {activeTab === 'contacts' && (
          <ContactsView
            contacts={contacts}
            setContacts={setContacts}
            geoState={geoState}
          />
        )}
        {activeTab === 'helplines' && <HelplinesView />}
      </main>

      {/* Tactical Bottom Navigation Dock */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Acoustic Screamer & Strobe Modal */}
      <SirenModal isOpen={isSirenOpen} onClose={() => setIsSirenOpen(false)} />

      {/* Simulated Incoming Emergency Call */}
      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />
    </div>
  );
}

export default App;

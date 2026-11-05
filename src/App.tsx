import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SirenModal } from './components/SirenModal';
import { FakeCallModal } from './components/FakeCallModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { SplashScreen } from './components/SplashScreen';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { EmergencyContact, NavTab } from './types';

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
    name: 'Home / Appa (Mysuru)',
    phone: '9845012345',
    relationship: 'Family',
    isPrimary: true,
  },
  {
    id: 'c-2',
    name: 'Guardian / Sister (Gokulam)',
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

  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSirenOpen, setIsSirenOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isDecoyMode, setIsDecoyMode] = useState(false);

  // Escort hand-off state from Map to Walk With Me
  const [escortDestination, setEscortDestination] = useState<string | undefined>();
  const [escortEtaMins, setEscortEtaMins] = useState<number | undefined>();

  const handleStartWalkFromMap = (dest: string, etaMins: number) => {
    setEscortDestination(dest);
    setEscortEtaMins(etaMins);
    setCurrentTab('walk');
  };

  // Show Splash screen on initial load
  if (showSplash) {
    return <SplashScreen onDismiss={() => setShowSplash(false)} />;
  }

  // Decoy Notes App Screen (Discreet safety mode)
  if (isDecoyMode) {
    return (
      <div className="min-h-screen bg-[#090909] text-white p-6 flex flex-col justify-between font-sans">
        <div className="max-w-md mx-auto w-full space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
            <h2 className="text-base font-bold text-slate-300">Quick Study Notes</h2>
            <button
              onClick={() => setIsDecoyMode(false)}
              className="text-xs text-[#A0A0A0] hover:text-[#FFD400] border border-[#2A2A2A] px-2.5 py-1 rounded-xl"
            >
              Exit Notes
            </button>
          </div>
          <div className="space-y-3 text-xs text-[#A0A0A0] font-mono">
            <div className="p-3 bg-[#1C1C1C] rounded-2xl border border-[#2A2A2A]">
              <span className="text-white font-semibold block mb-1">
                Data Structures &amp; Algorithms:
              </span>
              <p>• Dijkstra&apos;s algorithm finds single-source shortest paths in weighted graphs.</p>
              <p>• A* heuristic enhances pathfinding toward destination coordinates.</p>
            </div>
            <div className="p-3 bg-[#1C1C1C] rounded-2xl border border-[#2A2A2A]">
              <span className="text-white font-semibold block mb-1">
                Network Security:
              </span>
              <p>• HTTPS provides TLS encryption and certificate authenticity verification.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => setIsDecoyMode(false)}
            className="text-[10px] font-mono text-[#6B7280] hover:text-[#A0A0A0]"
          >
            [Tap here to return to RAKSHA Command]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col items-center justify-center selection:bg-[#FFD400] selection:text-[#090909]">
      {/* Mobile-First Frame Container (Resembles high-end smartphone on desktop, native on mobile) */}
      <div className="w-full max-w-md min-h-screen bg-[#090909] sm:border-x border-[#1C1C1C] flex flex-col relative shadow-2xl">
        {/* Sticky Mobile Top Header */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          geoState={geoState}
          userName="Kartik"
          onOpenSOS={() => setIsSOSOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 pt-3 pb-16 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              onSelectTab={setCurrentTab}
              onOpenSOS={() => setIsSOSOpen(true)}
              onOpenSiren={() => setIsSirenOpen(true)}
              onTriggerFakeCall={() => setIsFakeCallOpen(true)}
              geoState={geoState}
              userName="Kartik"
            />
          )}

          {currentTab === 'map' && (
            <MapView
              geoState={geoState}
              onStartWalkEscort={handleStartWalkFromMap}
            />
          )}

          {currentTab === 'rakshak' && <RakshakAI />}

          {currentTab === 'fraud' && <FraudShield />}

          {currentTab === 'routes' && <RoutesView />}

          {currentTab === 'walk' && (
            <WalkWithMe
              geoState={geoState}
              onOpenSiren={() => setIsSirenOpen(true)}
              initialDestination={escortDestination}
              initialEtaMins={escortEtaMins}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsView
              contacts={contacts}
              setContacts={setContacts}
              geoState={geoState}
            />
          )}

          {currentTab === 'helplines' && <HelplinesView />}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar (Matches Mockup 2 & 3) */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSOS={() => setIsSOSOpen(true)}
        />

        {/* Emergency SOS Modal */}
        <EmergencySOSModal
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          onOpenSiren={() => setIsSirenOpen(true)}
          contacts={contacts}
          geoState={geoState}
        />

        {/* Acoustic Strobe Siren Modal */}
        <SirenModal isOpen={isSirenOpen} onClose={() => setIsSirenOpen(false)} />

        {/* Simulated Incoming Escape Call */}
        <FakeCallModal
          isOpen={isFakeCallOpen}
          onClose={() => setIsFakeCallOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;

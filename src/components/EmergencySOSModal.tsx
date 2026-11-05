import React from 'react';
import {
  AlertCircle,
  Phone,
  Volume2,
  Share2,
  X,
  ShieldCheck,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { EmergencyContact } from '../types';
import { GeoState } from '../hooks/useGeolocation';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSiren: () => void;
  contacts: EmergencyContact[];
  geoState: GeoState;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  onOpenSiren,
  contacts,
  geoState,
}) => {
  if (!isOpen) return null;

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handleBroadcastSOS = () => {
    const lat = geoState.coords[0].toFixed(5);
    const lng = geoState.coords[1].toFixed(5);
    const message = `[EMERGENCY SOS - RAKSHA] I need immediate assistance in Mysuru. My live location: https://www.google.com/maps?q=${lat},${lng}`;

    if (primaryContact) {
      const cleanPhone = primaryContact.phone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-[#1C1C1C] border-2 border-[#FF3434] rounded-3xl p-6 shadow-2xl text-center space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-white rounded-full bg-[#090909]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsing Emergency Beacon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FF3434]/25 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-[#FF3434]/20 border-2 border-[#FF3434] flex items-center justify-center text-[#FF3434] shadow-2xl shadow-[#FF3434]/40">
            <AlertCircle className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">
            Emergency SOS Active
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed">
            Quick response command for physical emergencies or harassment.
          </p>
        </div>

        {/* Current Location Badge */}
        <div className="p-2.5 rounded-xl bg-[#090909] border border-[#2A2A2A] text-left flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-[#FFD400] shrink-0" />
          <div className="truncate flex-1">
            <span className="text-[10px] text-[#A0A0A0] block font-mono">YOUR GPS COORDINATES</span>
            <span className="text-white font-mono font-bold">
              {geoState.coords[0].toFixed(4)}, {geoState.coords[1].toFixed(4)} (Mysuru)
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Direct Police 112 Speed-Dial */}
          <a
            href="tel:112"
            className="w-full py-3.5 rounded-2xl bg-[#FF3434] hover:bg-[#ff4d4d] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#FF3434]/30 active:scale-98 transition-all"
          >
            <Phone className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>Call Police ERSS 112</span>
          </a>

          {/* 2. Broadcast WhatsApp Distress with GPS */}
          <button
            onClick={handleBroadcastSOS}
            className="w-full py-3 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-[#090909] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/20 active:scale-98 transition-all"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>
              Alert Guardian {primaryContact ? `(${primaryContact.name})` : ''} via WhatsApp
            </span>
          </button>

          {/* 3. High-Decibel Siren */}
          <button
            onClick={() => {
              onClose();
              onOpenSiren();
            }}
            className="w-full py-2.5 rounded-2xl bg-[#090909] border border-[#2A2A2A] hover:border-[#FFD400] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#FFD400]" />
            <span>Sound Strobe Siren Alarm</span>
          </button>
        </div>

        <p className="text-[10px] text-[#6B7280] font-mono pt-1">
          Tapping call or alert launches verified device protocols directly.
        </p>
      </div>
    </div>
  );
};

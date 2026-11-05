import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Phone, Star, ShieldCheck, Share2 } from 'lucide-react';
import { EmergencyContact } from '../types';
import { GeoState } from '../hooks/useGeolocation';

interface ContactsViewProps {
  contacts: EmergencyContact[];
  setContacts: (contacts: EmergencyContact[] | ((prev: EmergencyContact[]) => EmergencyContact[])) => void;
  geoState: GeoState;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ contacts, setContacts, geoState }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: EmergencyContact = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      isPrimary: contacts.length === 0,
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setContacts(
      contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  const generateWhatsAppLink = (contact: EmergencyContact) => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const message = `[RAKSHA LIVE ESCORT ALERT] Hi ${contact.name}, I am sharing my live location in Mysuru: https://www.google.com/maps?q=${geoState.coords[0]},${geoState.coords[1]}`;
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto animate-in fade-in">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Trusted Guardians</h2>
          <p className="text-[11px] text-[#A0A0A0]">
            {contacts.length} guardian{contacts.length === 1 ? '' : 's'} linked to SOS alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-3.5 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-[#090909] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FFD400]/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add Guardian'}</span>
        </button>
      </div>

      {/* Add Guardian Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddContact}
          className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in"
        >
          <h3 className="text-xs font-bold text-white">Add New Trusted Guardian</h3>

          <div>
            <label className="text-[11px] text-[#A0A0A0] block mb-1">Guardian Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#FFD400]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-[#A0A0A0] block mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#FFD400]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-[#A0A0A0] block mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
            >
              <option value="Family">Family Member</option>
              <option value="Parent">Parent / Guardian</option>
              <option value="Friend">Friend / Roommate</option>
              <option value="Colleague">Colleague / Peer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#FFD400] text-[#090909] font-bold text-xs shadow-md shadow-[#FFD400]/20"
          >
            Save Guardian
          </button>
        </form>
      )}

      {/* Guardians List */}
      <div className="space-y-2.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white truncate">{contact.name}</h4>
                {contact.isPrimary && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/40 font-bold">
                    PRIMARY
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A0A0A0] mt-0.5">
                {contact.relationship} • {contact.phone}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={generateWhatsAppLink(contact)}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-emerald-400 hover:border-emerald-500/50"
                title="Send Live GPS via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="w-8 h-8 rounded-xl bg-[#FFD400] text-[#090909] flex items-center justify-center shadow-md shadow-[#FFD400]/20"
                title="Call Guardian"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
              </a>

              <button
                onClick={() => handleDelete(contact.id)}
                className="w-8 h-8 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-[#FF3434]"
                title="Delete Contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

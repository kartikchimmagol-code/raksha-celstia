import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Phone, Star, ShieldCheck, Share2 } from 'lucide-react';
import { EmergencyContact } from '../types';
import { Badge } from '../components/Badge';
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
    const message = `[TEST EMERGENCY BROADCAST - RAKSHA] Hi ${contact.name}, this is a test alert. My current location in Mysuru: https://www.google.com/maps?q=${geoState.coords[0]},${geoState.coords[1]}`;
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Emergency Guardians</h2>
            <Badge variant="success">{contacts.length} Configured</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Contacts who receive your live coordinates and distress broadcast when SOS is triggered.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Add Guardian'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddContact}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in"
        >
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">
            New Guardian Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh (Father)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Phone Number (with Country Code)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9845012345"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Family">Family / Parent</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Friend">Trusted Friend</option>
                <option value="Colleague">Colleague / Roommate</option>
                <option value="Hostel/Campus">Campus Security / Warden</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Save Guardian Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-medium">No emergency guardians added yet.</p>
            <p className="text-xs text-slate-500">
              Add at least 2 trusted individuals who can respond immediately to an SOS alert.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                contact.isPrimary
                  ? 'bg-slate-900/90 border-rose-500/50 shadow-md shadow-rose-950/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    contact.isPrimary
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                    {contact.isPrimary && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-rose-300" /> PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {contact.phone} • {contact.relationship}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>

                <a
                  href={generateWhatsAppLink(contact)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                  title="Send test location alert via WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" /> Test Alert
                </a>

                {!contact.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(contact.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    title="Set as primary guardian"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Delete contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2 font-mono text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>All emergency contact numbers are encrypted in local storage on this device.</span>
      </div>
    </div>
  );
};

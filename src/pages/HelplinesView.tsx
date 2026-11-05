import React, { useState } from 'react';
import { PhoneCall, Search, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import { VERIFIED_HELPLINES } from '../data/mysuruData';

export const HelplinesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = VERIFIED_HELPLINES.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.number.includes(search) ||
      h.category.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'police'
        ? h.category.toLowerCase().includes('police')
        : selectedCategory === 'women'
        ? h.category.toLowerCase().includes('women')
        : selectedCategory === 'cyber'
        ? h.category.toLowerCase().includes('cyber')
        : selectedCategory === 'medical'
        ? h.category.toLowerCase().includes('ambulance') || h.category.toLowerCase().includes('medical')
        : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto animate-in fade-in">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search number, service or department..."
          className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#FFD400]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { key: 'all', label: 'All Services' },
          { key: 'police', label: 'Police 112' },
          { key: 'cyber', label: 'Cyber 1930' },
          { key: 'women', label: 'Women 1091' },
          { key: 'medical', label: 'Medical 108' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat.key
                ? 'bg-[#FFD400] text-[#090909] shadow-md shadow-[#FFD400]/20'
                : 'bg-[#1C1C1C] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Helplines List (Black & Yellow Cards) */}
      <div className="space-y-2.5">
        {filtered.map((h) => {
          const isHighPriority = h.number === '112' || h.number === '1930';
          return (
            <div
              key={h.number}
              className={`bg-[#1C1C1C] border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md transition-all ${
                isHighPriority
                  ? 'border-[#FFD400]/50 hover:border-[#FFD400]'
                  : 'border-[#2A2A2A] hover:border-[#404040]'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#FFD400] font-bold">
                    {h.category}
                  </span>
                  {h.isPrimary && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#090909] text-[#FFD400] border border-[#FFD400]/40 font-bold">
                      24/7 ACTIVE
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">{h.name}</h4>
                <p className="text-[11px] text-[#A0A0A0] truncate mt-0.5">{h.description}</p>
              </div>

              {/* Dial Button */}
              <a
                href={`tel:${h.number}`}
                className="py-2.5 px-3.5 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-[#090909] font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-[#FFD400]/20 active:scale-95 transition-all"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>{h.number}</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

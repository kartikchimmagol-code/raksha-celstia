import React, { useState } from 'react';
import { PhoneCall, Search, Info } from 'lucide-react';
import { VERIFIED_HELPLINES } from '../data/mysuruData';
import { Badge } from '../components/Badge';

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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Karnataka Verified Emergency Helplines
          </h2>
          <Badge variant="success">GOVERNMENT DIRECTORY</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Official toll-free 24/7 Karnataka State and National emergency numbers with 1-click dial.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by number, department, or emergency type..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'police', label: 'Police' },
            { key: 'women', label: 'Women' },
            { key: 'cyber', label: 'Cyber 1930' },
            { key: 'medical', label: 'Medical' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-teal-600/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div
            key={item.number}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
              item.isPrimary
                ? 'bg-slate-900 border-slate-700 shadow-lg'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{item.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-teal-400 tracking-wider">
                    {item.number}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                24/7 Toll-Free
              </span>

              <a
                href={`tel:${item.number}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow transition-all active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                Dial {item.number}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Protocol Advisory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-xs text-slate-300 space-y-2 font-mono shadow-xl">
        <h4 className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
          <Info className="w-4 h-4 text-amber-400" />
          Karnataka Emergency Response Protocols:
        </h4>
        <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
          <li>State your nearest major landmark first (e.g. &quot;Near K.R. Circle, Sayyaji Rao Road, Mysuru&quot;).</li>
          <li>For financial fraud, call 1930 within 1-2 hours (&quot;Golden Hour&quot;) so bank nodal officers can freeze the recipient account.</li>
          <li>Namma 112 dispatches the closest ERSS patrol vehicle and provides SMS tracking links.</li>
        </ul>
      </div>
    </div>
  );
};

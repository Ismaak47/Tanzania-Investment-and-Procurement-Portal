import React, { useState } from 'react';
import { 
  Building2, Layers, Landmark, Sliders, ArrowRight, 
  Search, ShieldCheck, CheckSquare, Plus, CheckCircle,
  Clock, TrendingUp, HelpCircle
} from 'lucide-react';
import { CATEGORIES, DOCUMENTS } from '../data/documents';

interface DashboardOverviewProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectDoc: (id: string) => void;
}

export default function DashboardOverview({ 
  searchQuery, 
  onSearchQueryChange, 
  onSelectDoc 
}: DashboardOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter documents by Category AND Search Query
  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.categoryId === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Hero Banner Section */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs md:text-[10px] font-mono font-semibold tracking-wider text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse"></span>
            SOVEREIGN PLATFORM 2026 / 2027
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-950 tracking-tight leading-tight md:leading-none">
            Tanzania National Investment & Procurement Platform
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            Sovereign Portal mapping legal frameworks, infrastructure marketplace pipelines, and decision-support engines for multinational consortia.
          </p>
        </div>

        {/* Highlight Stats Pill */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex gap-4 text-xs font-mono w-full md:w-auto justify-around md:justify-start shrink-0">
          <div>
            <span className="text-zinc-400 block text-xs md:text-[10px] uppercase">Active Pipeline</span>
            <strong className="text-sm font-bold text-zinc-900 block">$74.1 Billion</strong>
          </div>
          <div className="w-px bg-zinc-200 h-8 self-center"></div>
          <div>
            <span className="text-zinc-400 block text-xs md:text-[10px] uppercase">Checkpoints</span>
            <strong className="text-sm font-bold text-emerald-700 block">33 Portals Clear</strong>
          </div>
        </div>
      </div>

      {/* Categories Filter Hub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 min-h-[44px] md:min-h-0 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center ${
              selectedCategory === 'all' 
                ? 'bg-zinc-950 text-white shadow-sm' 
                : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
            }`}
          >
            All Portals (33)
          </button>
          
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 min-h-[44px] md:min-h-0 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedCategory === category.id 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
              {category.title}
            </button>
          ))}
        </div>

        {/* Inner Search Box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search keywords or sectors..."
            className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 md:py-1.5 text-base md:text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white transition-all duration-150 shadow-sm min-h-[44px] md:min-h-0"
          />
        </div>
      </div>

      {/* Main 33-Documents Grid List */}
      {filteredDocs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, idx) => {
            const cat = CATEGORIES.find(c => c.id === doc.categoryId);
            return (
              <div 
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className="bg-white border border-zinc-200 hover:border-zinc-900/40 rounded-xl p-5 cursor-pointer flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 select-none group min-h-[140px]"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white rounded text-xs md:text-[10px] font-mono font-bold text-zinc-500 transition-colors">
                      {doc.number}
                    </span>
                    {cat && (
                      <span className={`px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-xs md:text-[9px] font-mono tracking-wider font-semibold uppercase rounded text-zinc-500`}>
                        {cat.title.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-display font-bold text-sm text-zinc-950 tracking-tight leading-snug group-hover:text-zinc-900">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    {doc.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs md:text-[11px] text-zinc-400 pt-3 border-t border-zinc-50 mt-4 font-semibold group-hover:text-zinc-900 transition-colors">
                  <span className="font-mono">PORTAL_Z_0{doc.number}</span>
                  <span className="flex items-center gap-0.5">
                    Launch workspace
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl max-w-xl mx-auto space-y-3 shadow-sm">
          <HelpCircle className="w-12 h-12 text-zinc-300 stroke-1 mx-auto" />
          <h3 className="font-display font-bold text-sm text-zinc-800">No matching investment portals</h3>
          <p className="text-xs text-zinc-500">We couldn't find matches for "{searchQuery}". Try searching general keywords like "LNG", "works", "SGR" or category names.</p>
          <button 
            onClick={() => { setSelectedCategory('all'); onSearchQueryChange(''); }}
            className="px-3 py-1.5 bg-zinc-950 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Strategic Platform Framework Checklist Abstract */}
      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <h4 className="font-display font-semibold text-zinc-900 text-sm">Sovereign Compliance Assurance</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            All 33 registered directory modules operate in strict conformity with CAP 410, the Public Procurement Act, and relevant SADC financial frameworks. We enforce localized encryption and direct BoT connectivity paths.
          </p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-900" />
            <h4 className="font-display font-semibold text-zinc-900 text-sm">Industrial Economic Targets</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Aiming to expand national GDP to 6.3% and lower logistical border overheads by utilizing regional East African transport links. Concessions favor grid-ready clean energy proposals.
          </p>
        </div>
      </div>

    </div>
  );
}

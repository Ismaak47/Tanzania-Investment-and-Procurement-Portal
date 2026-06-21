import React, { useState } from 'react';
import { 
  Menu, X, Search, FileText, ChevronRight, 
  HelpCircle, Home, FolderKanban, ShieldCheck, 
  ChevronDown, ArrowUpRight
} from 'lucide-react';
import { CATEGORIES, DOCUMENTS } from '../data/documents';

interface SidebarProps {
  currentDocId: string | null;
  onSelectDoc: (id: string | null) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  currentDocId,
  onSelectDoc,
  searchQuery,
  onSearchQueryChange,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  // Navigation categories expanded state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    regulatory: true,
    marketplace: true,
    finance: false,
    command: false
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Compute search hits for each document dynamically
  const getSearchHitsCount = (docId: string, title: string, desc: string): number => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    let hits = 0;
    if (title.toLowerCase().includes(q)) hits += 2;
    if (desc.toLowerCase().includes(q)) hits += 1;
    return hits;
  };

  return (
    <aside 
      className={`bg-white border-r border-zinc-200 flex flex-col justify-between transition-all duration-300 h-full overflow-hidden 
        fixed inset-y-0 left-0 z-50 md:relative 
        ${isCollapsed ? '-translate-x-full md:translate-x-0 w-72 md:w-16' : 'translate-x-0 w-72 md:w-[280px]'}`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Emblem & Top Brand Header */}
        <div className="h-16 border-b border-zinc-200 px-4 flex items-center justify-between gap-2 shrink-0 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Minimalist geometric SVG coat-of-arms symbol */}
              <div className="bg-zinc-950 text-white p-1.5 rounded flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" stroke="white" strokeWidth="8" fill="none" />
                  <path d="M50 20 L50 80" stroke="white" strokeWidth="8" />
                  <circle cx="50" cy="50" r="14" fill="white" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-display font-black text-zinc-950 block tracking-tight leading-none">
                  TANZANIA
                </span>
                <span className="text-[10px] font-mono font-medium text-zinc-400 block tracking-wider leading-none mt-1">
                  SOVEREIGN PORTAL
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto bg-zinc-950 text-white p-1.5 rounded flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" stroke="white" strokeWidth="8" fill="none" />
              </svg>
            </div>
          )}

          {/* Toggle Button */}
          <button 
            onClick={onToggleCollapse}
            className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded transition-colors hidden md:block cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>

          {/* Mobile Close Button with 44px tap target */}
          {!isCollapsed && (
            <button 
              onClick={onToggleCollapse}
              className="h-11 w-11 flex items-center justify-center text-zinc-400 hover:text-zinc-850 hover:bg-zinc-100 rounded transition-colors md:hidden cursor-pointer"
              title="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Global Directory Search Bar - Visible when expanded */}
        {!isCollapsed && (
          <div className="p-3 border-b border-zinc-100 shrink-0 bg-zinc-50/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search index (33 portals)..."
                className="w-full bg-white border border-zinc-200 rounded-lg pl-8 pr-2 py-1 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white placeholder-zinc-400 font-normal transition-all"
              />
            </div>
          </div>
        )}

        {/* Scrollable Document Directory Tree */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          
          {/* Main Directory Portal Link */}
          <button
            onClick={() => onSelectDoc(null)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${
              currentDocId === null 
                ? 'bg-zinc-950 text-white shadow-sm' 
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Home className="w-4 h-4 shrink-0 stroke-[2]" />
            {!isCollapsed && <span className="flex-1 text-left">Sovereign Directory</span>}
          </button>

          {/* Collapsible Section Groups (only show list when expanded) */}
          {CATEGORIES.map(category => {
            const catDocs = DOCUMENTS.filter(d => d.categoryId === category.id);
            const isExpanded = expandedCategories[category.id];

            // Filter by search query inside sidebar list
            const matchedDocsList = catDocs.filter(d => {
              if (!searchQuery.trim()) return true;
              return d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     d.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (matchedDocsList.length === 0) return null;

            return (
              <div key={category.id} className="space-y-1">
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase hover:text-zinc-700 transition-colors"
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-3 h-3 transform transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                  </button>
                ) : (
                  <div className="h-px bg-zinc-100 my-2"></div>
                )}

                {/* Document Sub-item Buttons */}
                {isExpanded && (
                  <div className="space-y-0.5">
                    {matchedDocsList.map(item => {
                      const isActive = currentDocId === item.id;
                      const hits = getSearchHitsCount(item.id, item.title, item.shortDesc);

                      return (
                        <button
                          key={item.id}
                          onClick={() => onSelectDoc(item.id)}
                          className={`w-full flex ${isCollapsed ? 'justify-center py-2' : 'items-center gap-2 px-3 py-1.5'} rounded-lg text-xs transition-all duration-150 relative group ${
                            isActive 
                              ? 'bg-zinc-100 text-zinc-950 font-semibold' 
                              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-normal'
                          }`}
                          title={item.title}
                        >
                          <span className={`inline-flex items-center justify-center shrink-0 w-4 h-4 rounded text-[9px] font-mono font-bold ${
                            isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'
                          }`}>
                            {item.number}
                          </span>
                          
                          {!isCollapsed && (
                            <span className="flex-1 text-left truncate tracking-tight pr-1">
                              {item.title}
                            </span>
                          )}

                          {/* Search Match Badge */}
                          {hits > 0 && !isCollapsed && (
                            <span className="shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 bg-zinc-900 text-white rounded-full text-[8px] font-mono font-bold scale-90">
                              {hits}
                            </span>
                          )}

                          {/* Collapse simple visual indicator dot */}
                          {isActive && isCollapsed && (
                            <div className="absolute right-1 w-1.5 h-1.5 bg-zinc-950 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Info Panel representation */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/50 text-[10px] font-mono text-zinc-400 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Security Level:</span>
              <strong className="text-zinc-900 font-bold uppercase">MDB-SOV</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>National ID:</span>
              <strong>ZOB_TZ_27</strong>
            </div>
          </div>
        ) : (
          <div className="text-center font-bold text-zinc-900">MDB</div>
        )}
      </div>

    </aside>
  );
}

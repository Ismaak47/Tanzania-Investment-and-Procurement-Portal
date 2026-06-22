import React, { useState, useEffect } from 'react';
import { 
  Building2, Layers, Landmark, Sliders, Menu, X, 
  Search, ShieldCheck, ChevronRight, HelpCircle,
  FileCheck2, Compass, ArrowUpRight, CheckSquare,
  Sparkles, Database, ExternalLink, RefreshCw,
  Settings
} from 'lucide-react';
import { DOCUMENTS, CATEGORIES } from './data/documents';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import DocumentViewer from './components/DocumentViewer';

export default function App() {
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [clearanceLevel, setClearanceLevel] = useState<string>('MDB-SOV');
  const [advisorMode, setAdvisorMode] = useState<string>('Strict Regulatory');

  // Auto scroll to top on document navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentDocId]);

  // Handle responsive sidebar defaults isSidebarCollapsed
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize dynamic sitemap searches
  const handleDocSelection = (id: string | null) => {
    setCurrentDocId(id);
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans select-none antialiased text-zinc-800">
      
      {/* Top Professional Header Bar */}
      <header className="h-16 bg-white border-b border-zinc-200 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Trigger with 44px Tap Target */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-11 w-11 flex items-center justify-center hover:bg-zinc-100 rounded text-zinc-500 transition-colors md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div onClick={() => handleDocSelection(null)} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-950"></div>
            <span className="font-display font-medium text-[13px] md:text-sm text-zinc-950 tracking-tight uppercase group-hover:text-zinc-600 transition-colors">
              Sovereign Intelligence
            </span>
          </div>
        </div>

        {/* Dynamic header navigation quicklinks / stats index */}
        <div className="flex items-center gap-2 md:gap-4">
        </div>
      </header>

      {/* Primary Workspace Panel Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay - closes sidebar when clicked */}
        {!isSidebarCollapsed && (
          <div 
            onClick={() => setIsSidebarCollapsed(true)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          />
        )}

        {/* Left Sidebar */}
        <Sidebar 
          currentDocId={currentDocId}
          onSelectDoc={handleDocSelection}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Left Side Floating Helper when Sidebar is collapsed */}
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
          <div className="max-w-4xl mx-auto">
            {currentDocId === null ? (
              <DashboardOverview 
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSelectDoc={handleDocSelection}
              />
            ) : (
                <DocumentViewer 
                  docId={currentDocId}
                  onNavigateToDoc={handleDocSelection}
                />
            )}
          </div>
        </main>

      </div>

      {/* Subtle Micro-Telemetry Margin Lines Disclaimer */}
      <footer className="h-10 bg-white border-t border-zinc-200 px-4 md:px-6 flex items-center justify-between text-[11px] text-zinc-400 font-mono select-none shrink-0">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 hover:text-zinc-800 text-zinc-500 transition-colors cursor-pointer select-none"
          title="Open Portal Settings"
        >
          <Settings className="w-3.5 h-3.5 animate-pulse" />
          <span>PORTAL CONFIG ({clearanceLevel})</span>
        </button>
        <span className="text-zinc-500 font-sans tracking-tight">© 2026 written by Ismail Hakim</span>
      </footer>

      {/* Settings Modal Dialog Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-800" />
                <span className="font-display font-semibold text-xs text-zinc-900 tracking-tight uppercase">Portal System Configuration</span>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              
              {/* Security clearance option */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Security Clearance Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button 
                    onClick={() => setClearanceLevel('MDB-SOV')}
                    type="button"
                    className={`p-2 rounded border text-center font-mono font-bold tracking-tight cursor-pointer transition-colors ${
                      clearanceLevel === 'MDB-SOV' 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-[10px]'
                    }`}
                  >
                    MDB-SOV
                  </button>
                  <button 
                    onClick={() => setClearanceLevel('TZ-CENTRAL')}
                    type="button"
                    className={`p-2 rounded border text-center font-mono font-bold tracking-tight cursor-pointer transition-colors ${
                      clearanceLevel === 'TZ-CENTRAL' 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-[10px]'
                    }`}
                  >
                    TZ-CENTRAL
                  </button>
                  <button 
                    onClick={() => setClearanceLevel('PUBLIC')}
                    type="button"
                    className={`p-2 rounded border text-center font-mono font-bold tracking-tight cursor-pointer transition-colors ${
                      clearanceLevel === 'PUBLIC' 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-[10px]'
                    }`}
                  >
                    PUBLIC
                  </button>
                </div>
              </div>

              {/* Advisor Mode setting */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Advisor Processing Mode</label>
                <select 
                  value={advisorMode} 
                  onChange={(e) => setAdvisorMode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-zinc-700 outline-none focus:border-zinc-900 focus:bg-white"
                >
                  <option value="Strict Regulatory">Strict Regulatory (CAP 410 / PURA)</option>
                  <option value="High-Speed Commercial">High-Speed Commercial Advice</option>
                  <option value="Economic Incentives">Economic Incentives Specialist</option>
                </select>
              </div>

              {/* API and server status details */}
              <div className="bg-zinc-50 border border-zinc-150 rounded-lg p-3 space-y-1.5 font-mono text-[9px] text-zinc-500">
                <div className="flex items-center justify-between">
                  <span>Gemini API Engine:</span>
                  <span className="text-emerald-700 font-bold uppercase">Online (gemini-3.5-flash)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Local Server Node:</span>
                  <span className="text-zinc-800">Port 3000 (Express Router)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Export Engine:</span>
                  <span className="text-zinc-800">HTML2PDF.js (Dynamic Resolution)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>System Build:</span>
                  <span className="text-zinc-800">Vite Production Compiled</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-3.5 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                type="button"
                className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-mono font-bold rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                APPLY CHANGES
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

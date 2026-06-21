import React, { useState, useEffect } from 'react';
import { 
  Building2, Layers, Landmark, Sliders, Menu, X, 
  Search, ShieldCheck, ChevronRight, HelpCircle,
  FileCheck2, Compass, ArrowUpRight, CheckSquare,
  Sparkles, Database, ExternalLink, RefreshCw
} from 'lucide-react';
import { DOCUMENTS, CATEGORIES } from './data/documents';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import DocumentViewer from './components/DocumentViewer';

export default function App() {
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

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
          
          <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
          <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50/70 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-flex items-center gap-1 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            NE&ST V4 Validated
          </span>
        </div>

        {/* Dynamic header navigation quicklinks / stats index */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => handleDocSelection(null)}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 px-2.5 min-h-[44px] md:min-h-0 py-1.5 rounded transition-all cursor-pointer flex items-center justify-center"
          >
            Sitemap Index
          </button>
          <a
            href="https://ais-dev-ehwej26ahes2a55uz6rzsk-221392660885.europe-west1.run.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-950 cursor-pointer min-h-[44px] md:min-h-0 px-2 flex items-center justify-center"
          >
            Environment
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
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
      <footer className="h-8 bg-white border-t border-zinc-200 px-4 md:px-6 flex items-center justify-between text-[10px] text-zinc-400 font-mono select-none">
        <span>UNITED REPUBLIC OF TANZANIA</span>
        <span>© 2026 MINISTRY OF INVESTMENT, INDUSTRY & TRADE</span>
      </footer>

    </div>
  );
}

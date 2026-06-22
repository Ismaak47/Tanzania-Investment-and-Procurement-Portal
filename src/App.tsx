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
      <footer className="h-10 bg-white border-t border-zinc-200 px-4 md:px-6 flex items-center justify-center text-[11px] text-zinc-400 font-mono select-none shrink-0 text-center">
        <span className="text-zinc-500 font-sans tracking-tight">© 2026 written by Ismail Hakim</span>
      </footer>

    </div>
  );
}

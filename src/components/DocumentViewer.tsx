import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { 
  FileText, CheckCircle, ExternalLink, ShieldCheck, 
  TrendingUp, MapPin, Brain, BarChart3, ArrowRight, 
  HelpCircle, ChevronRight, Info, Check, ShieldAlert,
  Sliders, MessageSquare, Landmark, Layers, Sparkles
} from 'lucide-react';
import { DOCUMENTS, CHECKLIST_ITEMS, PIPELINE_PROJECTS } from '../data/documents';

interface DocumentViewerProps {
  docId: string;
  onNavigateToDoc: (id: string) => void;
}

export default function DocumentViewer({ docId, onNavigateToDoc }: DocumentViewerProps) {
  // Find current doc info
  const doc = DOCUMENTS.find(d => d.id === docId);

  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleExportPdf = async () => {
    if (!pdfContentRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const element = pdfContentRef.current;

      const inputs = element.querySelectorAll('input[type="text"], input[type="number"]');
      inputs.forEach((input: any) => {
        input.setAttribute('value', input.value);
      });

      const textareas = element.querySelectorAll('textarea');
      textareas.forEach((textarea: any) => {
        textarea.textContent = textarea.value;
      });

      const selects = element.querySelectorAll('select');
      selects.forEach((select: any) => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
          Array.from(select.options).forEach((opt: any) => opt.removeAttribute('selected'));
          selectedOption.setAttribute('selected', 'selected');
        }
      });

      const docTitle = doc?.title || 'Document';
      const cleanTitle = docTitle.replace(/[^a-zA-Z0-9 -]/g, '');
      const filename = `Tanzania-Sovereign-${cleanTitle}.pdf`;

      const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      } as any;

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // States for interactive widgets
  // Document 5 & 6 & 8 & 10: Checklists state
  const [checklistStates, setChecklistStates] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('tz_investment_checklist_state_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save checklist state
  const handleCheckToggle = (id: string) => {
    const nextState = { ...checklistStates, [id]: !checklistStates[id] };
    setChecklistStates(nextState);
    localStorage.setItem('tz_investment_checklist_state_v1', JSON.stringify(nextState));
  };

  // Document 7 & 9: Incentives Eligibility Advisor
  const [invSize, setInvSize] = useState<number>(65);
  const [invJobs, setInvJobs] = useState<number>(180);
  const [invSector, setInvSector] = useState<string>('energy');

  // Document 16: National Opportunity Intel Registry Target
  const [oppSector, setOppSector] = useState<string>('lng');

  // Document 17: Supply chain project selection
  const [scProject, setScProject] = useState<string>('lng');

  // Document 18: Geospatial Map highlight subregion
  const [selectedRegion, setSelectedRegion] = useState<string>('coast');

  // Document 20: Stakeholders selection
  const [activeStakeholder, setActiveStakeholder] = useState<string>('tpdc');

  // Document 21: Strategic partner matching
  const [investorOrigin, setInvestorOrigin] = useState<string>('gulf');
  const [partnerProject, setPartnerProject] = useState<string>('lng');

  // Document 26: Development Finance selector
  const [activeDfi, setActiveDfi] = useState<string>('ifc');

  // Document 29: AI Advisor custom Chat simulator
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'advisor' | 'user', text: string }>>([
    {
      sender: 'advisor',
      text: "Habari! I am your AI Sovereign Compliance Advisor for Tanzania. Let me know which strategic sector, tax incentive category, or NeST legal guideline you wish to evaluate."
    }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Document 30: Executive Decision Support parameter ranges
  const [dsCapex, setDsCapex] = useState<number>(280);
  const [dsLocalJobs, setDsLocalJobs] = useState<number>(350);
  const [dsLocalShare, setDsLocalShare] = useState<number>(51);

  // Document 31: Strategic scenario planning active pathway
  const [selectedScenario, setSelectedScenario] = useState<string>('A');

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-zinc-100 rounded-2xl">
        <FileText className="w-12 h-12 text-zinc-300 stroke-1 mb-4" />
        <p className="text-zinc-500 text-sm">Select an active sovereign document to launch the workspace.</p>
      </div>
    );
  }

  const getAdvisorResponse = async (updatedMessages: Array<{ sender: 'advisor' | 'user', text: string }>) => {
    setIsChatLoading(true);
    setChatError(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: updatedMessages })
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChatMessages(prev => [...prev, { sender: 'advisor', text: data.reply || data.text || "No response generated." }]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Error occurred');
      setChatMessages(prev => [...prev, { sender: 'advisor', text: 'An error occurred while fetching strategic advice. Please check your connection and try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const triggerAdvisorSample = async (topic: string, queryText: string) => {
    if (isChatLoading) return;
    const userMsg = { sender: 'user' as const, text: queryText };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    await getAdvisorResponse(nextMessages);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatLoading) return;

    const userMsg = { sender: 'user' as const, text: userInput };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setUserInput('');
    await getAdvisorResponse(nextMessages);
  };

  // Helper: Count checked items per section
  const getSectionStats = (sectionName: string) => {
    const items = CHECKLIST_ITEMS.filter(item => item.section === sectionName);
    const checked = items.filter(item => checklistStates[item.id]);
    const percentage = items.length ? Math.round((checked.length / items.length) * 100) : 0;
    return { count: checked.length, total: items.length, percentage };
  };

  // Scores calculator for DSE (Document 30)
  const calcDSEScores = () => {
    const attractiveness = Math.min(100, Math.round((dsCapex / 1000) * 45 + (dsLocalJobs / 1000) * 55));
    const readiness = Math.min(100, Math.round((dsLocalShare >= 51 ? 95 : 45) + (dsCapex >= 300 ? 5 : 0)));
    const risk = Math.round(100 - (dsLocalShare >= 51 ? 40 : 15) - (dsLocalJobs >= 400 ? 15 : 5));
    
    let recommendation = "";
    if (readiness >= 80 && risk <= 50) {
      recommendation = "RECOMMEND CONSORTIUM BID: Outstanding project parameters. Excellent regulatory alignment with 51%+ domestic share and high labor creation indicators.";
    } else if (readiness < 80) {
      recommendation = "RESTRUCTURE JOINT VENTURE: High risk of immediate NeST portal disqualification. Inadequate local shareholding fraction. Secure dynamic 51% local partnership.";
    } else {
      recommendation = "EVALUATE RISKS: Small scale capital doesn't qualify for top Tier TIC tax holidays. Recommended to transition structural allocation to EPZ hubs.";
    }

    return { attractiveness, readiness, risk, recommendation };
  };

  const dseResult = calcDSEScores();

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      
      {/* Document Breadcrumb & Header */}
      <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">
            <span>Sovereign Platform</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-zinc-600 font-medium">{doc.categoryId}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-semibold text-zinc-950 tracking-tight flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-zinc-900 text-white rounded text-xs font-mono font-bold">
              {doc.number}
            </span>
            {doc.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2" data-html2pdf-ignore="true">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-zinc-200 text-xs font-mono text-zinc-600 min-h-[44px] md:min-h-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE DEPLOYMENT
          </span>
          <button 
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="px-3 py-2 md:py-1 bg-zinc-900 text-white hover:bg-zinc-800 rounded font-mono text-xs font-medium cursor-pointer transition-colors min-h-[44px] md:min-h-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div ref={pdfContentRef} className="p-6 md:p-8">
        
        {/* Short Executive Abstract */}
        <p className="text-sm md:text-base text-zinc-500 font-normal leading-relaxed mb-6 italic max-w-3xl">
          "{doc.shortDesc} Specially formatted for large corporate contractors, foreign Direct Investment (FDI) pools, and international technical developers matching Tanzanian Treasury guidelines."
        </p>

        {/* Dynamic Inner Document Content Pages */}
        
        {/* DOCUMENT 1: LEGAL FRAMEWORK & NeST */}
        {docId === 'doc-legal' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">Primary Law</span>
                <h4 className="font-display font-semibold text-zinc-900 text-sm">Public Procurement Act</h4>
                <p className="text-xs text-zinc-500">Governs all central, parastatal, and regional infrastructural development acquisitions within Tanzania.</p>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">National Standard</span>
                <h4 className="font-display font-semibold text-zinc-900 text-sm">Sovereign Audit Trail</h4>
                <p className="text-xs text-zinc-500">Value for money, non-discrimination, and public audit checks directly linked to Treasury dashboards.</p>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">Current Portal</span>
                <h4 className="font-display font-semibold text-zinc-900 text-sm">NeST Architecture</h4>
                <p className="text-xs text-zinc-500">Unified digital network replacing legacy TANePS. Bids are compiled, structured, and dispatched automatically.</p>
              </div>
            </div>

            <div className="prose prose-zinc max-w-none text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base border-b border-zinc-100 pb-2">Governing Code and Transition Timeline</h3>
              <p>
                All acquisitions by government agencies (MDAs) are legally guided under the <strong>Public Procurement Act, CAP 410</strong>. Section 48 compels all Procuring Entities to compile and publish clear Annual Procurement Plans (APP) at the start of every transition season. 
              </p>
              <div className="p-4 border-l-2 border-zinc-900 bg-zinc-50/50 rounded-r-lg">
                <p className="font-sans text-xs text-zinc-600 font-medium m-0">
                  <strong>Geopolitical Intelligence Checkpoint:</strong> This transition to NeST minimizes human intervention, creating a standardized audit stream. This positions Tanzania as a highly stable, low-friction gateway for sovereign wealth co-investments compared to volatile border regions.
                </p>
              </div>
              <p>
                Bidding contractors must be fully pre-registered on NeST to participate in upcoming infrastructure pipeline bids. Late encrypted submittals are handled by timestamp protocols without human overrides.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 2: STEP-BY-STEP UZABUNI TIMELINE */}
        {docId === 'doc-steps' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <h3 className="font-display font-semibold text-zinc-950 text-sm mb-3 flex items-center gap-1">
                <Info className="w-4 h-4 text-zinc-700" />
                Key Swahili Terminology Quick-Index
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white border border-zinc-100 rounded-lg">
                  <span className="font-mono font-bold text-zinc-900 block mb-0.5">Uzabuni</span>
                  <p className="text-zinc-500">The entire formal <strong>Tendering and Bidding</strong> process flow governed by PPRA rules.</p>
                </div>
                <div className="p-3 bg-white border border-zinc-100 rounded-lg">
                  <span className="font-mono font-bold text-zinc-900 block mb-0.5">Mzabuni (pl. Wazabuni)</span>
                  <p className="text-zinc-500">The registered <strong>Bidder or Tenderer</strong> submitting qualifications inside NeST.</p>
                </div>
                <div className="p-3 bg-white border border-zinc-100 rounded-lg">
                  <span className="font-mono font-bold text-zinc-900 block mb-0.5">Zabuni</span>
                  <p className="text-zinc-500">The actual compiled technical/financial <strong>Tender Bid Proposal</strong> file.</p>
                </div>
              </div>
            </div>

            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">The Bidding Lifecycle Walkthrough</h3>
              <p>
                1. <strong>Sourcing & Review:</strong> Filter published APPs via NeST to source target pipeline projects.
              </p>
              <p>
                2. <strong>Consortium Formulation:</strong> Formulate target Joint Ventures mapping to local content percentages (e.g. reserving 51% domestic share where required).
              </p>
              <p>
                3. <strong>Bank Assurances:</strong> Obtain bid securities and performance bonds. Note that securities MUST be issued from active local banking entities licensed directly by the Bank of Tanzania.
              </p>
              <p>
                4. <strong>Technical Compilation & Upload:</strong> Upload localized credentials, qualified engineer portfolios, audited receipts, and encryption keys to the NeST system.
              </p>
            </div>

            <div className="overflow-x-auto text-xs bg-white border border-zinc-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="p-3 font-mono font-bold text-zinc-700 uppercase">Process Metric</th>
                    <th className="p-3 font-mono font-bold text-zinc-700 uppercase">Tanzania (NeST)</th>
                    <th className="p-3 font-mono font-bold text-zinc-700 uppercase">EAC Regional Average</th>
                    <th className="p-3 font-mono font-bold text-zinc-700 uppercase">Global Benchmark Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Bid Sourcing Period</td>
                    <td className="p-3 text-zinc-600">30 - 45 Days</td>
                    <td className="p-3 text-zinc-500">30 Days</td>
                    <td className="p-3 text-zinc-500">21 - 30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Assurance Turnaround</td>
                    <td className="p-3 text-zinc-600">3 - 5 Days</td>
                    <td className="p-3 text-zinc-500">7 Days</td>
                    <td className="p-3 text-zinc-500">1 - 2 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">Local Content Audits</td>
                    <td className="p-3 text-zinc-600">Automated Matcher State</td>
                    <td className="p-3 text-zinc-500">Manual review</td>
                    <td className="p-3 text-zinc-500">Fully digital verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENT 3: WORKS AND HEAVY CIVIL SECTORS */}
        {docId === 'doc-works' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Contractor Registration Board (CRB) Classifications</h3>
              <p className="text-sm text-zinc-600">
                To participate in heavy transport, municipal bridge links, deep mineral facilities, or port expansions, foreign entities must understand CRB grading. Foreigners are restricted to <strong>Class I status (Unlimited Value Tenders)</strong>, which mandates technical transfers and domestic engineer subcontracts to verify domestic growth.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Grade Level</span>
                <span className="text-sm font-semibold text-zinc-900 block">Class I (Unlimited)</span>
                <p className="text-xs text-zinc-500 mt-1">Minimum local equity alignment of 51% in JVs. Unlimited single contract value thresholds.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Grade Level</span>
                <span className="text-sm font-semibold text-zinc-900 block">Class II - IV</span>
                <p className="text-xs text-zinc-500 mt-1">Reserved mostly for regional domestic entities. SGR tenders mandate 15%-20% subcontracting to these tiers.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Audit Body</span>
                <span className="text-sm font-semibold text-zinc-900 block">CRB / ERB</span>
                <p className="text-xs text-zinc-500 mt-1">Contractor and Engineering boards verifying mechanical, structural and electrical systems safety.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Funding Sync</span>
                <span className="text-sm font-semibold text-zinc-900 block">MDB Syndication</span>
                <p className="text-xs text-zinc-500 mt-1">Class I works are pre-registered to integrate directly into World Bank/AfDB regional grids capital paths.</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 4: CONSULTANCY & UBUNIFU SECTOR */}
        {docId === 'doc-consultancy' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Design and Consulting (Ubunifu)</h3>
              <p>
                Tanzania public agencies score consultancy bids primarily on the <strong>Quality and Cost-Based Selection (QCBS)</strong> method. For study and design activities (Ubunifu), technical credentials of personal consultants (e.g. active Engineers Registration Board membership) average 75% to 80% weight, with the remaining fraction assigned to cost targets.
              </p>
              <p>
                Architectural configurations, environmental impact tracking models, and economic design blueprints must demonstrate strict integration with local development matrices. 
              </p>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl font-mono text-xs text-zinc-700 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-zinc-900 mb-1">Ubunifu Quality Checkpoint:</span>
                  All technological frameworks must provide localized software usage agreements and guarantee clean intellectual transfer rules.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 5: COMPLIANCE CHECKLIST */}
        {docId === 'doc-checklist' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-zinc-900 text-sm">Mandatory Investor Document Tracker</h3>
                  <p className="text-xs text-zinc-500">Verify your regulatory registrations before uploading to the NeST system.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">Progress Completed</span>
                  <span className="text-lg font-mono font-bold text-zinc-900">
                    {getSectionStats('checklist').percentage}% ({getSectionStats('checklist').count}/{getSectionStats('checklist').total})
                  </span>
                </div>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-500"
                  style={{ width: `${getSectionStats('checklist').percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.filter(item => item.section === 'checklist').map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckToggle(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    checklistStates[item.id] 
                      ? 'bg-zinc-50 border-zinc-900' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    checklistStates[item.id] ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-300'
                  }`}>
                    {checklistStates[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold tracking-tight transition-colors ${
                      checklistStates[item.id] ? 'text-zinc-950 line-through decoration-zinc-300' : 'text-zinc-900'
                    }`}>
                      {item.label}
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT 6: VIRTUAL DATA ROOM */}
        {docId === 'doc-dataroom' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div>
                <h3 className="font-display font-semibold text-zinc-950 text-sm">MDB-Grade Verification Stream</h3>
                <p className="text-xs text-zinc-500">Track clearance indices required to unlock strategic co-investments from AfDB, TDB, or IMF pools.</p>
              </div>
              <div className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-center font-mono">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Room Status Rating</span>
                <span className="text-sm font-bold text-emerald-700 uppercase">
                  {getSectionStats('dataroom').percentage === 100 ? 'MDB Grade Secured' : 'Diligence Check'}
                </span>
                <div className="text-xs text-zinc-500 mt-0.5">({getSectionStats('dataroom').percentage}% verified)</div>
              </div>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.filter(item => item.section === 'dataroom').map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckToggle(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    checklistStates[item.id] 
                      ? 'bg-emerald-50/40 border-emerald-300' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    checklistStates[item.id] ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-zinc-300'
                  }`}>
                    {checklistStates[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold tracking-tight transition-colors ${
                      checklistStates[item.id] ? 'text-zinc-900 font-medium' : 'text-zinc-800'
                    }`}>
                      {item.label}
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT 7: INVESTMENT INCENTIVES */}
        {docId === 'doc-incentives' && (
          <div className="space-y-6">
            {/* Eligibility Configurator */}
            <div className="p-5 border border-zinc-200 bg-zinc-50 rounded-xl space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Strategic SEZ / EPZ Benefit Configurator</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Capital Size (USD Millions)</label>
                  <input 
                    type="range" 
                    min="5" 
                    max="150" 
                    value={invSize}
                    onChange={(e) => setInvSize(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-zinc-800 font-bold font-mono">{invSize} Million USD</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Employment Target (Jobs)</label>
                  <input 
                    type="range" 
                    min="20" 
                    max="500" 
                    value={invJobs}
                    onChange={(e) => setInvJobs(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-zinc-800 font-bold font-mono">{invJobs} Positions</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Project Active Sector</label>
                  <select 
                    value={invSector} 
                    onChange={(e) => setInvSector(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-2.5 md:py-1 text-base md:text-xs text-zinc-800 outline-none focus:border-zinc-900 min-h-[44px] md:min-h-0"
                  >
                    <option value="energy">Hydrocarbons & Midstream LNG</option>
                    <option value="nuclear">Uranium / Nuclear Fuel Cycle</option>
                    <option value="infra">Heaving Civil & Railway (SGR)</option>
                    <option value="solar">Renewable Energy Grid Works</option>
                  </select>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold font-mono text-zinc-800 uppercase tracking-widest">Eligibility:</span>
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    {invSize >= 50 && invJobs >= 100 ? 'QUALIFIED (SEZ Class A Developer Status)' : invSize >= 15 ? 'QUALIFIED (TIC Standard Benefits)' : 'ELIGIBLE FOR GENERAL TAX INFILLS'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {invSize >= 50 && invJobs >= 100 
                    ? `Eligible for a direct 10-year Corporate Income Tax holiday, complete import duty exemptions on capital machinery, zero withholdings on dividends, and up to 100% foreign shareholder status under epza framework.`
                    : `Your capital structure qualifies for standard TIC benefits (duty-free import of specialized parts and full capital repatriation guarantees) but fails to hit the SEZ priority developer baseline.`}
                </p>
                <div className="text-[10px] text-zinc-400 font-mono">*Tanzanian Treasury parameters require minimum US$ 50 Million for Class A developers.</div>
              </div>
            </div>

            {/* General Incentives Details */}
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Sovereign Concessions Matrix</h3>
              <p>
                The Investment Acts authorize the Tanzania Investment Centre to grant specific corporate privileges supporting private sector financing in logistics zones, ports, and grid energy generation.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 8: COMPLIANCE AND CERTIFICATION */}
        {docId === 'doc-compliance' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-zinc-900 text-sm">International standards alignment</h3>
                  <p className="text-xs text-zinc-500">Compliance trackers mandated by global investment banks and environmental agencies.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">ISO & ESG Score</span>
                  <span className="text-lg font-mono font-bold text-zinc-900">
                    {getSectionStats('compliance').percentage}% Checked
                  </span>
                </div>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-500"
                  style={{ width: `${getSectionStats('compliance').percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.filter(item => item.section === 'compliance').map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckToggle(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    checklistStates[item.id] 
                      ? 'bg-zinc-50 border-zinc-900' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    checklistStates[item.id] ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-300'
                  }`}>
                    {checklistStates[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold tracking-tight transition-colors ${
                      checklistStates[item.id] ? 'text-zinc-950 line-through decoration-zinc-300' : 'text-zinc-900'
                    }`}>
                      {item.label}
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT 9: INTERNATIONAL MARKET ENTRY */}
        {docId === 'doc-marketentry' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Corporate origin pathway planner</h3>
              <p className="text-xs text-zinc-500">Select your country representation to load the optimal regulatory registration sequence.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 w-full">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Country Origin of Firm</label>
                  <select 
                    value={investorOrigin} 
                    onChange={(e) => setInvestorOrigin(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs text-zinc-800 focus:border-zinc-900 outline-none min-h-[44px] md:min-h-0"
                  >
                    <option value="gulf">Middle East (Gulf Co-operation Councils)</option>
                    <option value="ru">Russian Federation (Bilateral Corridors)</option>
                    <option value="cn">Mainland China State-Owned Enterprises</option>
                    <option value="eu">European Union / Western Technical Pool</option>
                  </select>
                </div>
              </div>

              {/* Evaluated Plan details */}
              <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-3">
                {investorOrigin === 'gulf' && (
                  <>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Landmark className="w-4 h-4" /> GULF REVENUE CORRIDOR
                    </div>
                    <p className="text-xs text-zinc-600">
                      Primary pathway is configured for <strong>BOT (Build-Operate-Transfer) or BOOT concession SPVs</strong>. Recommended to synchronize equity co-financing directly with the Ministry of Finance and Middle East sovereign wealth funds, while partnering with Tier-1 Tanzanian civil contractors.
                    </p>
                  </>
                )}
                {investorOrigin === 'ru' && (
                  <>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Layers className="w-4 h-4" /> BILATERAL CORRIDOR STRUCTURE
                    </div>
                    <p className="text-xs text-zinc-600">
                      Focus is directed towards <strong>civil nuclear research pilot points (Mantra Mantra Mantra) or chemical refinery concessions in Kilwa</strong>. Bidders require specialized clearance credentials verified by the Atomic Energy Commission (TAEC) alongside Mining Commission audits.
                    </p>
                  </>
                )}
                {investorOrigin === 'cn' && (
                  <>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Sliders className="w-4 h-4" /> SOE MAJOR CONTRACTS
                    </div>
                    <p className="text-xs text-zinc-600">
                      Configured for <strong>EPC+Finance packages funded via EXIM Bank of China</strong>. Contractor registration board (CRB) unlimited Class I certifications are required. Requires contracting out a fixed 15% section value to Class II-IV registered domestic engineering units.
                    </p>
                  </>
                )}
                {investorOrigin === 'eu' && (
                  <>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> ESG COMPLIANT PATHWAY
                    </div>
                    <p className="text-xs text-zinc-600">
                      Standardized for **Quality and Cost-Based evaluation (QCBS)**. Demands full pre-alignment with IFC Performance Rules and Equator standards. Projects mostly cover municipal wind systems, eco-grids, or consultancy studies.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 10: LOCAL CONTENT COMMAND CENTER */}
        {docId === 'doc-localcontent' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-zinc-950 text-sm">PURA Local Content (2017) Guidelines</h3>
                  <p className="text-xs text-zinc-500">Track structural metrics regarding employment ratios, engineering courses, and local supply chain prioritization.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">Localization Score</span>
                  <span className="text-lg font-mono font-bold text-zinc-900">
                    {getSectionStats('localcontent').percentage}% Compliant
                  </span>
                </div>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-500"
                  style={{ width: `${getSectionStats('localcontent').percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.filter(item => item.section === 'localcontent').map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckToggle(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    checklistStates[item.id] 
                      ? 'bg-zinc-50 border-zinc-900' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    checklistStates[item.id] ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-300'
                  }`}>
                    {checklistStates[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold tracking-tight transition-colors ${
                      checklistStates[item.id] ? 'text-zinc-950 line-through decoration-zinc-300' : 'text-zinc-900'
                    }`}>
                      {item.label}
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT 11: NATIONAL PROJECT MARKETPLACE */}
        {docId === 'doc-marketplace' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Government Priority Infrastructure Projects (2026/2027)</h3>
              <p className="text-sm text-zinc-600">
                These mega-projects represent the active capital pipeline tracked on the state planner dashboard. Private sponsors, sovereign investment funds, and heavy EPC construction JVs can access these details to align corporate underwriting schedules.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {PIPELINE_PROJECTS.map(proj => (
                <div key={proj.id} className="p-4 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl space-y-3 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-mono font-semibold tracking-wider text-zinc-600 rounded">
                      {proj.sector}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">{proj.irr} Projected IRR</span>
                  </div>
                  <h4 className="font-display font-bold text-zinc-950 text-sm leading-tight">{proj.name}</h4>
                  <div className="flex justify-between items-center text-xs text-zinc-500 pt-1 border-t border-zinc-50 font-mono">
                    <span>Est: <strong className="text-zinc-800">{proj.cap}</strong></span>
                    <span>Status: <strong className="text-zinc-800">{proj.progress}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT 12: NUCLEAR & URANIUM */}
        {docId === 'doc-nuclear' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Clean Grid Diversification & Uranium Resources</h3>
              <p>
                In accordance with <strong>Tanzania Fourth Five-Year National Plan (FYDP IV)</strong>, strategic atomic mineral exploration works are prioritize for baseline power grids. Mkuju River Uranium Project contains large reserves of processing ore managed under corporate joint permits.
              </p>
              <div className="p-4 border border-violet-200 bg-violet-50/40 rounded-xl space-y-1.5">
                <h4 className="font-display font-bold text-violet-950 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ATOMIC ENERGY COUNCIL (TAEC) CHECKS
                </h4>
                <p className="text-xs text-violet-900 leading-relaxed m-0">
                  All contractors bidding for processing facilities, excavation, storage, or transit routes must hold active safety licenses verified directly by national radiologist frameworks.
                </p>
              </div>
              <p>
                The medium-term objective is to introduce Small Modular Reactor (SMR) arrays in specified SEZ heavy manufacturing corridor zones by 2035 to ensure clean grid baseloads.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 13: NATURAL GAS & LNG */}
        {docId === 'doc-gas' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h2 className="font-display font-bold text-zinc-950 text-base border-b border-zinc-100 pb-2">The $42 Billion Lindi Onshore LNG Project</h2>
              <p>
                Tanzania holds over 57 Trillion Cubic Feet (TCF) of offshore deepwater natural gas deposits. The designated Likong’o terminal onshore project represents a major co-investment between international explorers (including shell and equinor) and state operator TPDC.
              </p>
              <p>
                Auxiliary pipelaying tenders, city distributing hubs, and industrial gas-to-power plant generation are regularly dispatched through NeST procurement windows, demanding structured Class I works certificates.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 14: UPSTREAM BIDDING ROUNDS */}
        {docId === 'doc-upstream' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">The Fifth Oil and Gas Licensing Round Protocols</h3>
              <p>
                The Petroleum Upstream Regulatory Authority (PURA) administers deepwater offshore exploration blocks and rift basin sectors (primarily surrounding Lake Tanganyika). Bidding rounds demand strict technical capabilities, minimum seismic survey investments, and solid capital proofs synchronized with the Bank of Tanzania.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 15: FORECASTING ENGINE */}
        {docId === 'doc-forecasting' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Regulatory Tender Release Pipeline (2026-2027)</h3>
              <p>
                This strategic compiler projects release schedules for major transportation, liquid pipelines, municipal grids, and environmental feasibility campaigns. Project periods can shift depending on Treasury allocations, therefore close alignment is recommended.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 16: NATIONAL OPPORTUNITY INTEL */}
        {docId === 'doc-oppintel' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Sovereign Investment Priority Selector</h3>
              <p className="text-xs text-zinc-500">Select an opportunity category to view governmental backing metrics and expected IRR levels.</p>
              
              <div className="w-full md:max-w-xs">
                <select 
                  value={oppSector} 
                  onChange={(e) => setOppSector(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-950 min-h-[44px] md:min-h-0"
                >
                  <option value="lng">LNG Liquid Extraction & Export Line</option>
                  <option value="uranium">Uranium Heavy Extraction Projects</option>
                  <option value="sgr">Standard Gauge Railway works</option>
                  <option value="grid">Renewable Power Plants</option>
                </select>
              </div>

              {/* Responsive Output */}
              <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-2 text-xs">
                {oppSector === 'lng' && (
                  <>
                    <div className="font-bold text-zinc-900">Opportunity: Lindi onshore LNG Infrastructure</div>
                    <div>Est. CAPEX: <strong className="text-zinc-950">USD 42.0 Billion</strong> | Target Return (IRR): <strong className="text-emerald-700">17.8%</strong></div>
                    <p className="text-zinc-500 leading-relaxed mt-1">Sovereign backing is fully validated. Requires heavy joint bidding with local content Class I units. Focuses on deepwater maritime structures and inland gas transmission loops.</p>
                  </>
                )}
                {oppSector === 'uranium' && (
                  <>
                    <div className="font-bold text-zinc-900">Opportunity: Mkuju River Atomic Exploitation</div>
                    <div>Est. CAPEX: <strong className="text-zinc-950">USD 1.0 Billion</strong> | Target Return (IRR): <strong className="text-emerald-700">19.4%</strong></div>
                    <p className="text-zinc-500 leading-relaxed mt-1">Joint Russian Rosatom pilot support. Demands special mining license approvals, TAEC environmental clearances, and security fencing infrastructure.</p>
                  </>
                )}
                {oppSector === 'sgr' && (
                  <>
                    <div className="font-bold text-zinc-900">Opportunity: SGR Railway segments (3 - 5)</div>
                    <div>Est. CAPEX: <strong className="text-zinc-950">USD 7.6 Billion</strong> | Target Return (IRR): <strong className="text-emerald-700">11.5%</strong></div>
                    <p className="text-zinc-500 leading-relaxed mt-1">Direct state funding in JVs with international engineering developers. Mandatory 15% section value subcontracting to domestic Class II-IV registered contractors.</p>
                  </>
                )}
                {oppSector === 'grid' && (
                  <>
                    <div className="font-bold text-zinc-900">Opportunity: Regional connected solar grids</div>
                    <div>Est. CAPEX: <strong className="text-zinc-950">USD 350 Million</strong> | Target Return (IRR): <strong className="text-emerald-700">14.2%</strong></div>
                    <p className="text-zinc-500 leading-relaxed mt-1">Concession co-financing supported by IFC/AfDB green panels. Guarantees long-term Power Purchase Agreements (PPAs) with TANESCO.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 17: MEGA PROJECT SUPPLY CHAIN */}
        {docId === 'doc-supplychain' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Auxiliary Plant and Equipment specs matcher</h3>
              
              <div className="w-full md:max-w-xs">
                <select 
                  value={scProject} 
                  onChange={(e) => setScProject(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-950 min-h-[44px] md:min-h-0"
                >
                  <option value="lng">Lindi LNG processing terminals</option>
                  <option value="sgr">SGR Electrified Heavy transport rails</option>
                  <option value="hydro">Julius Nyerere 2115MW dam</option>
                </select>
              </div>

              <div className="p-4 bg-white border border-zinc-200 rounded-lg text-xs space-y-2">
                {scProject === 'lng' && (
                  <>
                    <div className="font-bold text-zinc-900">Supply Map: Cryogenic Gas Storage & Pipelaying</div>
                    <p className="text-zinc-500">Requires offshore pipeline sections, heavy compressors, heat exchangers, carbon capturing nodes, and aggregate concrete piles.</p>
                    <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Local Constraint: Cement products must be locally secured first.</div>
                  </>
                )}
                {scProject === 'sgr' && (
                  <>
                    <div className="font-bold text-zinc-900">Supply Map: Rail Infrastructure & Signaling Telemetry</div>
                    <p className="text-zinc-500">Sleepers, heavy copper traction cables, digital grid control signals, rolling locomotives, and steel reinforcing beams.</p>
                  </>
                )}
                {scProject === 'hydro' && (
                  <>
                    <div className="font-bold text-zinc-900">Supply Map: Sub-station Transformers & Grid switchgears</div>
                    <p className="text-zinc-500">235MW Kaplan turbines, high-voltage copper conductors, switchgears, generator assemblies, and river deflection gates.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 18: GEOSPATIAL INVESTMENT MAP */}
        {docId === 'doc-geomap' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <div>
                  <h3 className="font-display font-semibold text-zinc-950 text-sm">Sovereign regional zoning directory</h3>
                  <p className="text-xs text-zinc-500">Click a regional subregion block to load mapped corridor projects, active EPZs, and pipeline zones.</p>
                </div>
                <div className="text-xs font-mono font-bold text-zinc-400">TANZANIA SPATIAL DIRECTOR</div>
              </div>

              {/* Vector SVG Map of Tanzania Economic Regions */}
              <div className="flex justify-center py-4 bg-white border border-zinc-200 rounded-lg">
                <svg width="420" height="240" viewBox="0 0 420 240" className="w-full max-w-sm">
                  <rect x="0" y="0" width="420" height="240" rx="6" fill="#fcfcfc" />
                  
                  {/* North */}
                  <path 
                    d="M40 30 L160 20 L195 70 L80 80 Z" 
                    onClick={() => setSelectedRegion('north')}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedRegion === 'north' 
                        ? 'fill-zinc-900 stroke-zinc-950 stroke-[1.5]' 
                        : 'fill-zinc-100 stroke-zinc-350 hover:fill-zinc-200'
                    }`}
                  />
                  
                  {/* Center (Dodoma) */}
                  <path 
                    d="M195 70 L300 60 L320 120 L210 130 Z" 
                    onClick={() => setSelectedRegion('center')}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedRegion === 'center' 
                        ? 'fill-zinc-900 stroke-zinc-950 stroke-[1.5]' 
                        : 'fill-zinc-100 stroke-zinc-350 hover:fill-zinc-200'
                    }`}
                  />

                  {/* Coast (Dar / Bagamoyo) */}
                  <path 
                    d="M320 120 L400 110 L410 190 L300 200 Z" 
                    onClick={() => setSelectedRegion('coast')}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedRegion === 'coast' 
                        ? 'fill-zinc-900 stroke-zinc-950 stroke-[1.5]' 
                        : 'fill-zinc-100 stroke-zinc-350 hover:fill-zinc-200'
                    }`}
                  />

                  {/* South */}
                  <path 
                    d="M80 80 L210 130 L160 210 L50 180 Z" 
                    onClick={() => setSelectedRegion('south')}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedRegion === 'south' 
                        ? 'fill-zinc-900 stroke-zinc-950 stroke-[1.5]' 
                        : 'fill-zinc-100 stroke-zinc-350 hover:fill-zinc-200'
                    }`}
                  />

                  {/* Labels on SVG */}
                  <text x="60" y="50" fill={selectedRegion === 'north' ? '#fff' : '#4b5563'} className="text-[10px] font-mono pointer-events-none font-bold">NORTH</text>
                  <text x="215" y="90" fill={selectedRegion === 'center' ? '#fff' : '#4b5563'} className="text-[10px] font-mono pointer-events-none font-bold">DOM / CTR</text>
                  <text x="330" y="150" fill={selectedRegion === 'coast' ? '#fff' : '#4b5563'} className="text-[10px] font-mono pointer-events-none font-bold">COASTAL</text>
                  <text x="90" y="150" fill={selectedRegion === 'south' ? '#fff' : '#4b5563'} className="text-[10px] font-mono pointer-events-none font-bold">SOUTH</text>
                </svg>
              </div>

              {/* Selected Region Info Panel */}
              <div className="p-4 bg-white border border-zinc-200 rounded-lg text-xs space-y-2">
                {selectedRegion === 'north' && (
                  <>
                    <div className="font-bold text-zinc-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> NORTHERN ZONE (Mining, Agriculture Hubs)
                    </div>
                    <p className="text-zinc-500 leading-relaxed">Focuses on grid connected solar systems (Arusha expansion), mineral storage centers, and regional water pumping pipes. Primary SEZs: Kilimanjaro Airport EPZ, Himo Industrial Park.</p>
                  </>
                )}
                {selectedRegion === 'center' && (
                  <>
                    <div className="font-bold text-zinc-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> CENTRAL CORRIDOR (Dodoma, Tanzanian HQ)
                    </div>
                    <p className="text-zinc-500 leading-relaxed">Focuses on national headquarters municipal grid upgrades, smart administrative telecom setups, SGR Railway Phase 3 logistics, and Nala Industrial SEZ projects.</p>
                  </>
                )}
                {selectedRegion === 'coast' && (
                  <>
                    <div className="font-bold text-zinc-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> COASTAL HUB (Dar es Salaam, Bagamoyo Port)
                    </div>
                    <p className="text-zinc-500 leading-relaxed">The prime FDI corridor. Mega Bagamoyo Deepwater Port, Kinyerezi III natural gas generation turbine facilities, and primary Benjamin William Mkapa Special Economic Zones (SEZ).</p>
                  </>
                )}
                {selectedRegion === 'south' && (
                  <>
                    <div className="font-bold text-zinc-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> SOUTHERN RESOURCES (Lindi natural gas, Mkuju Uranium)
                    </div>
                    <p className="text-zinc-500 leading-relaxed">Prime heavy extractive resources corridor. Highly prioritized for deepwater offshore gas platforms, inland gas compression loops, Lindi Petrochemical Zone, and Mtwara Port transport terminals.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 19: COUNTRY INTEL */}
        {docId === 'doc-countryintel' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 border border-zinc-200 bg-white shadow-sm rounded-xl text-center space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase block">GDP Growth Rate (2026/27)</span>
                <span className="text-3xl font-display font-bold text-zinc-900 block tracking-tight">6.3%</span>
                <span className="text-xs font-semibold text-emerald-700 block">+0.8% Target Increment</span>
              </div>
              <div className="p-5 border border-zinc-200 bg-white shadow-sm rounded-xl text-center space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase block">Projected Annual Inflation</span>
                <span className="text-3xl font-display font-bold text-zinc-900 block tracking-tight">3.5%</span>
                <span className="text-xs font-semibold text-zinc-600 block">Stable price controls</span>
              </div>
              <div className="p-5 border border-zinc-200 bg-white shadow-sm rounded-xl text-center space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase block">Macro Sovereign rating</span>
                <span className="text-3xl font-display font-bold text-zinc-900 block tracking-tight">B2 Stable</span>
                <span className="text-xs font-semibold text-emerald-700 block">Moody's outlook: Stable</span>
              </div>
            </div>

            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Tanzania Sovereign Macroeconomic Outlook</h3>
              <p>
                The national financial projections remain solid, backed by steady natural resource exports (gold, cashews, minerals) and the gradual onset of offshore natural gas monetization. Clean regulatory audits from PPRA and Treasury ensure low inflation variances and stable capital repatriation routes.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 20: STAKEHOLDER ECOSYSTEM */}
        {docId === 'doc-stakeholders' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-950 text-sm">Regulatory inter-agency directory</h3>
              <p className="text-xs text-zinc-500">Select any state organ node to check its primary mandate and interlinking compliance routes.</p>
              
              <div className="w-full md:max-w-xs">
                <select 
                  value={activeStakeholder}
                  onChange={(e) => setActiveStakeholder(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs font-semibold text-zinc-900 focus:border-zinc-950 outline-none min-h-[44px] md:min-h-0"
                >
                  <option value="ewura">EWURA (Energy & Water Regulatory Authority)</option>
                  <option value="tpdc">TPDC (Tanzania Petroleum Develop Corp)</option>
                  <option value="tanesco">TANESCO (Tanzania Electric Supply Company)</option>
                  <option value="pura">PURA (Petroleum Upstream Regulatory Authority)</option>
                  <option value="tic">TIC (Tanzania Investment Centre)</option>
                </select>
              </div>

              <div className="p-4 bg-white border border-zinc-200 rounded-lg text-xs space-y-2">
                {activeStakeholder === 'ewura' && (
                  <>
                    <div className="font-bold text-zinc-950">EWURA Mandate: Power purchase licenses & Tariffs</div>
                    <p className="text-zinc-550 leading-relaxed">Approves Power Purchase Agreements (PPAs) signed with TANESCO, regulates safety conditions for midstream natural gas pipelines, and reviews city-wide water works permits.</p>
                  </>
                )}
                {activeStakeholder === 'tpdc' && (
                  <>
                    <div className="font-bold text-zinc-950">TPDC Mandate: Sovereign equity representation</div>
                    <p className="text-zinc-550 leading-relaxed">Represents government equity share (ranging up to 15-20%) in major natural gas blocks or processing terminals. Coordinates pipeline access with international explorers.</p>
                  </>
                )}
                {activeStakeholder === 'tanesco' && (
                  <>
                    <div className="font-bold text-zinc-950">TANESCO Mandate: National grid transmission & buyouts</div>
                    <p className="text-zinc-550 leading-relaxed">The single-buyer electric utility managing transmission and distribution corridors. Signs off on long-term power grid connections and solar array tenders.</p>
                  </>
                )}
                {activeStakeholder === 'pura' && (
                  <>
                    <div className="font-bold text-zinc-950">PURA Mandate: Upstream oil and gas blocks</div>
                    <p className="text-zinc-550 leading-relaxed">Issues exploration licenses, supervises seismic collection, audits oil/gas production shares, and inspects localization compliance under Local Content regulations.</p>
                  </>
                )}
                {activeStakeholder === 'tic' && (
                  <>
                    <div className="font-bold text-zinc-950">TIC Mandate: Investment incentives & Corporate visas</div>
                    <p className="text-zinc-550 leading-relaxed">Issues active Certificates of Incentives to foreign developers, fast-tracks land use permits, and coordinates structured taxation relief channels with the Treasury.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 21: STRATEGIC PARTNER MATCHER */}
        {docId === 'doc-matcher' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Consortium Formulation Engine</h3>
              <p className="text-xs text-zinc-500">Configure your parameters to generate the optimal Joint Venture structure satisfying PPRA and PURA content mandates.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Investor Region</label>
                  <select 
                    value={investorOrigin} 
                    onChange={(e) => setInvestorOrigin(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs text-zinc-900 focus:border-zinc-950 outline-none min-h-[44px] md:min-h-0"
                  >
                    <option value="gulf">Middle East/Gulf Sovereign Groups</option>
                    <option value="ru">Russian heavy extractive SOEs</option>
                    <option value="cn">Chinese State-Owned EPC corporations</option>
                    <option value="eu">European Technology / ECA backed units</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Target Project Category</label>
                  <select 
                    value={partnerProject} 
                    onChange={(e) => setPartnerProject(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs text-zinc-900 focus:border-zinc-950 outline-none min-h-[44px] md:min-h-0"
                  >
                    <option value="lng">LNG Maritime Terminals & Pipelaying</option>
                    <option value="nuclear">Uranium extraction operations</option>
                    <option value="rail">Heavy Civil Works (SGR Railway)</option>
                    <option value="grid">Grid connected solar/renewables</option>
                  </select>
                </div>
              </div>

              {/* Calculated Recommendation Output */}
              <div className="p-4 bg-white border border-zinc-200 rounded-lg text-xs space-y-2">
                <div className="font-bold text-zinc-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                  Consortium Match Formula: {investorOrigin === 'ru' && partnerProject === 'nuclear' ? '98% Excellent' : investorOrigin === 'cn' && partnerProject === 'rail' ? '96% Excellent' : investorOrigin === 'gulf' ? '92% Strong' : '85% Solid'}
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {investorOrigin === 'ru' && partnerProject === 'nuclear' && "Direct Joint Venture package with Mantra Tanzania (Rosatom segment). Foreign entity covers safety management systems, while domestic Class I partner manages heavy civil transport and security perimeters."}
                  {investorOrigin === 'cn' && partnerProject === 'rail' && "Consortium model backed by SINOSURE credits. Chinese heavy builders handle civil design, with mandatory transfer of 15% contract volume to Class II-IV local railway track contractors."}
                  {investorOrigin === 'gulf' && "BOOT (Build-Own-Operate-Transfer) structure financed through GCC regional development funds. Capitalizes a local delivery SPV, reserving Tier-1 cement and steel procurement for domestic Tanzanian suppliers."}
                  {investorOrigin !== 'ru' && investorOrigin !== 'cn' && investorOrigin !== 'gulf' && "JV targeting multilateral credit windows (IFC/AfDB). Technical engineering parameters managed by international design firm, with local CRB Class I contractor acting as head of operations."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 22: INFRASTRUCTURE FINANCE HUB */}
        {docId === 'doc-finance' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">MDB Debt Syndication and ECA Guarantees</h3>
              <p>
                To raise finance for Class I infrastructure pipelines, sponsors must configure robust multi-tiered debt allocations. Multilateral banks (like AfDB and TDB) co-finance up to 70% of capital debt under preferential sovereign or parastatal terms.
              </p>
              <p>
                Export Credit Agencies provide essential trade-risk assurances, reducing capital margin fees for commercial banks co-funding the project.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 23: NATIONAL DEVELOPMENT ALIGNMENT */}
        {docId === 'doc-alignment' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Consistency with Five-Year Development Plans (FYDP IV)</h3>
              <p>
                Bidding consortia receive higher rating points when demonstrating that their proposals align with FYDP IV focus areas: regional trade corridor connections, industrialization in specified SEZs, and regional employment creation.
              </p>
              <p>
                Sovereign guarantees are reserved exclusive to projects confirming compliance with these targets.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 24: INVESTOR EXIT STRATEGY */}
        {docId === 'doc-exit' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">BOOT Concession Transfer rules and Secondary listings</h3>
              <p>
                A clear capital repatriation exit must be declared back to Treasury at contract formation. Under standard **BOOT / BOT** concession models, the infrastructure asset is transferred back to government delivery units at Year-25 or Year-30.
              </p>
              <p>
                Monetization options can also incorporate secondary listings on the Dar es Salaam Stock Exchange (DSE), offering local investors equity fractions.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 25: SOVEREIGN WEALTH FUND HUB */}
        {docId === 'doc-swf' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-zinc-200 bg-white rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">National Commitments</span>
                <h4 className="font-display font-semibold text-zinc-900 text-sm">SWF Co-finance Priority</h4>
                <p className="text-xs text-zinc-500">Government allocates capital directly alongside regional Middle East sovereign development pools to support SGR railway extensions and LNG terminal preparation.</p>
              </div>
              <div className="p-4 border border-zinc-200 bg-white rounded-xl space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase">Average SWF Return</span>
                <h4 className="font-display font-semibold text-emerald-700 text-sm">17.2% Net Utility Gain</h4>
                <p className="text-xs text-zinc-500">Investment return margins backed by direct revenue royalties of deep offshore cashed resources.</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 26: DEVELOPMENT FINANCE HUB */}
        {docId === 'doc-dfi' && (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Multilateral path precondition checker</h3>
              <p className="text-xs text-zinc-500">Select any DFI entity to review compliance preconditions regarding project loans.</p>

              <div className="w-full md:max-w-xs">
                <select 
                  value={activeDfi} 
                  onChange={(e) => setActiveDfi(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded p-2.5 md:p-2 text-base md:text-xs font-semibold text-zinc-900 focus:border-zinc-950 outline-none min-h-[44px] md:min-h-0"
                >
                  <option value="ifc">IFC (International Finance Corporation)</option>
                  <option value="afdb">AfDB (African Development Bank)</option>
                  <option value="isdb">IsDB (Islamic Development Bank)</option>
                </select>
              </div>

              <div className="p-4 bg-white border border-zinc-200 rounded-lg text-xs space-y-2">
                {activeDfi === 'ifc' && (
                  <>
                    <div className="font-bold text-zinc-950">IFC Performance Standards Compliance</div>
                    <p className="text-zinc-500">Demands complete environmental license approvals (NEMC), audit check of local employment (80% minimum on site), and pre-aligned land leasing metrics cleared of local community claims.</p>
                  </>
                )}
                {activeDfi === 'afdb' && (
                  <>
                    <div className="font-bold text-zinc-950">AfDB regional integration priority</div>
                    <p className="text-zinc-500">Demands focus on cross-border transport (SGR connections to Rwanda / DRC) or power grids sharing electricity outputs within the EAC networks.</p>
                  </>
                )}
                {activeDfi === 'isdb' && (
                  <>
                    <div className="font-bold text-zinc-950">IsDB Sukuk infrastructure bonds syndication</div>
                    <p className="text-zinc-500">Demands Shari\'ah compliant leasing models (Istisna\'a) co-funded directly with sovereign Middle East investment funds.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 27: RUSSIA-TANZANIA CORRIDOR */}
        {docId === 'doc-corridor' && (
          <div className="space-y-6">
            <div className="prose prose-zinc text-zinc-600 text-sm space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-base">Sovereign Industrial and extrative bilateral agreements</h3>
              <p>
                Bilateral projects include joint agricultural fertilizer processing plants in Kilwa (utilizing natural gas chemical inputs) and uranium mine development at Mkuju River. Projects are backed directly by state credits to ensure efficient heavy-duty drilling imports.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENT 28: EXECUTIVE COMMAND WAR ROOM */}
        {docId === 'doc-command' && (
          <div className="space-y-6">
            <div className="p-5 border border-zinc-200 bg-zinc-50 rounded-xl space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Sovereign Pipeline Readiness Scores</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-xs font-mono text-zinc-400 uppercase block">Active Pipelines Value</span>
                  <span className="text-2xl font-mono font-bold text-zinc-900 block">$74.1 Billion</span>
                </div>
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-xs font-mono text-zinc-400 uppercase block">Treasury Bonded</span>
                  <span className="text-2xl font-mono font-bold text-emerald-700 block">94.8% Active</span>
                </div>
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-xs font-mono text-zinc-400 uppercase block">National compliance level</span>
                  <span className="text-2xl font-mono font-bold text-amber-700 block">Z-Rating Clear</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 29: AI STRATEGIC ADVISOR (CHAT) */}
        {docId === 'doc-advisor' && (
          <div className="space-y-6">
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-zinc-900 text-white px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-display text-xs font-bold tracking-wider uppercase">Strategic Compliance Engine (v2.6)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </span>
              </div>

              {/* Chat Thread */}
              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-zinc-50 font-sans text-xs">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 rounded-lg max-w-[85%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-zinc-900 text-white rounded-br-none shadow' 
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={line.startsWith('-') ? 'ml-2 pl-1 mb-0.5' : 'mb-1'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-zinc-200 text-zinc-400 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-1.5 italic">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></span>
                      Advisor is analyzing Tanzanian regulations...
                    </div>
                  </div>
                )}
                {chatError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-[11px] leading-normal font-mono">
                    ERROR: {chatError}
                  </div>
                )}
              </div>

              {/* Presets and entry quick queries */}
              <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 flex flex-wrap gap-2">
                <button 
                  onClick={() => triggerAdvisorSample('entry', 'How do I center target registrations to enter the market?')}
                  disabled={isChatLoading}
                  className="px-2.5 py-2 md:py-1 bg-white hover:bg-zinc-100 text-xs text-zinc-700 border border-zinc-200 rounded cursor-pointer transition-colors min-h-[44px] md:min-h-0 flex items-center justify-center font-medium disabled:opacity-50"
                >
                  TIC Licenses
                </button>
                <button 
                  onClick={() => triggerAdvisorSample('jv', 'What are the rules regarding PURA Joint Ventures?')}
                  disabled={isChatLoading}
                  className="px-2.5 py-2 md:py-1 bg-white hover:bg-zinc-100 text-xs text-zinc-700 border border-zinc-200 rounded cursor-pointer transition-colors min-h-[44px] md:min-h-0 flex items-center justify-center font-medium disabled:opacity-50"
                >
                  PURA Joint Ventures
                </button>
                <button 
                  onClick={() => triggerAdvisorSample('bid', 'How are bid security bonds validated?')}
                  disabled={isChatLoading}
                  className="px-2.5 py-2 md:py-1 bg-white hover:bg-zinc-100 text-xs text-zinc-700 border border-zinc-200 rounded cursor-pointer transition-colors min-h-[44px] md:min-h-0 flex items-center justify-center font-medium disabled:opacity-50"
                >
                  NeST Bid Securities
                </button>
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-zinc-200 flex gap-2">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isChatLoading}
                  placeholder="Ask advisor (e.g., minimum capital, tax reliefs)..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 md:py-1.5 text-base md:text-xs text-zinc-800 outline-none focus:bg-white focus:border-zinc-900 min-h-[44px] md:min-h-0 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isChatLoading}
                  className="px-4 py-2 md:py-1.5 bg-zinc-900 text-white text-base md:text-xs font-mono font-bold rounded hover:bg-zinc-800 transition-colors cursor-pointer min-h-[44px] md:min-h-0 flex items-center justify-center disabled:opacity-50"
                >
                  {isChatLoading ? "LOADING" : "SEND"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENT 30: EXECUTIVE DECISION SUPPORT ENGINE */}
        {docId === 'doc-decisionsupport' && (
          <div className="space-y-6">
            <div className="p-5 border border-zinc-200 bg-zinc-50 rounded-xl space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Consortium Pre-Qualification Indexing Simulator</h3>
              <p className="text-xs text-zinc-500">Input proposed parameters to compute readiness criteria and sovereign clearance ratings.</p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 uppercase">
                    <span>Project CAPEX Range</span>
                    <span className="text-zinc-900">{dsCapex} Million USD</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="1200" 
                    value={dsCapex}
                    onChange={(e) => setDsCapex(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 uppercase">
                    <span>Direct Job Creation</span>
                    <span className="text-zinc-900">{dsLocalJobs} Local positions</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    value={dsLocalJobs}
                    onChange={(e) => setDsLocalJobs(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 uppercase">
                    <span>Local shareholding fraction</span>
                    <span className="text-zinc-900">{dsLocalShare}% Shares</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={dsLocalShare}
                    onChange={(e) => setDsLocalShare(parseInt(e.target.value))}
                    className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-t border-b border-zinc-200">
                <div className="text-center p-2">
                  <span className="text-xs md:text-[10px] font-mono font-bold text-zinc-400 block uppercase">Attractiveness</span>
                  <span className="text-xl font-mono font-bold text-zinc-950 block">{dseResult.attractiveness}%</span>
                </div>
                <div className="text-center p-2 border-y sm:border-y-0 sm:border-l sm:border-r border-zinc-200">
                  <span className="text-xs md:text-[10px] font-mono font-bold text-zinc-400 block uppercase">NeST Readiness</span>
                  <span className={`text-xl font-mono font-bold block ${dseResult.readiness >= 80 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {dseResult.readiness}%
                  </span>
                </div>
                <div className="text-center p-2">
                  <span className="text-xs md:text-[10px] font-mono font-bold text-zinc-400 block uppercase">Sovereign Risk</span>
                  <span className={`text-xl font-mono font-bold block ${dseResult.risk <= 50 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {dseResult.risk}%
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-900 text-zinc-50 rounded-lg text-xs flex gap-2 items-start">
                {dseResult.readiness < 80 ? <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> : <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                <div>
                  <span className="font-mono font-bold block uppercase text-zinc-300">Auditor Advisory:</span>
                  <p className="text-zinc-400 leading-relaxed mt-0.5 m-0">{dseResult.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 31: STRATEGIC SCENARIO PLANNING */}
        {docId === 'doc-scenario' && (
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-zinc-900 text-base">Select scenario pathway</h3>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div 
                onClick={() => setSelectedScenario('A')}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedScenario === 'A' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="font-display font-bold text-xs uppercase tracking-wider">Pathway A</div>
                <h4 className="font-display font-bold text-sm leading-tight mt-1">Accelerated Gas Exploration</h4>
                <p className={`text-xs mt-2 leading-relaxed ${selectedScenario === 'A' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  FID achieved early. Offshore pipelines scale rapidly. Demands sudden local logistics setup.
                </p>
              </div>

              <div 
                onClick={() => setSelectedScenario('B')}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedScenario === 'B' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="font-display font-bold text-xs uppercase tracking-wider">Pathway B</div>
                <h4 className="font-display font-bold text-sm leading-tight mt-1">Energy Transition focus</h4>
                <p className={`text-xs mt-2 leading-relaxed ${selectedScenario === 'B' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  DFI pools restrict pipeline funds. Focus shifts immediately to municipal solar, hydro, and wind networks.
                </p>
              </div>
            </div>

            {/* Strategic Scenario Details Output */}
            <div className="p-4 border border-zinc-200 bg-zinc-50 rounded-xl text-xs space-y-2">
              {selectedScenario === 'A' ? (
                <>
                  <div className="font-bold text-zinc-900">Analysis: Accelerated Hydrocarbon Extraction (Roadmap A)</div>
                  <div>Urgency Level: <strong className="text-zinc-900">CRITICAL</strong> | Inflation Risk: <strong className="text-amber-700">MEDIUM</strong></div>
                  <p className="text-zinc-500 leading-relaxed mt-1">
                    Strong demand for welding specialists and pipeline inspection services. Foreign bidders should reserve local suppliers and concrete raw materials in Lindi / Mtwara zones early to safeguard project timelines.
                  </p>
                </>
              ) : (
                <>
                  <div className="font-bold text-zinc-900">Analysis: Greengrid Accruals (Roadmap B)</div>
                  <div>Urgency Level: <strong className="text-zinc-900">HIGH</strong> | Financing Available: <strong className="text-emerald-700">UP TO 80% DEBT</strong></div>
                  <p className="text-zinc-500 leading-relaxed mt-1">
                    ECA and Green Bond co-financing options become extremely favorable. Demands certified environmental impact studies approved strictly by NEMC (National Environment Management Council) before launch.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* DOCUMENT 32: ECONOMIC TRANSFORMATION INDEX */}
        {docId === 'doc-econtransformation' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-zinc-900 text-base">National Economic Transformation Goals</h3>
              <p className="text-sm text-zinc-600">
                Tanzania actively benchmarks industrialization vectors and tech transfer parameters to optimize structural wealth. High compliance rates with technology transfer schedules maximize technical scores inside the NeST system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-zinc-200 rounded-xl text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Industrial growth</span>
                <span className="text-2xl font-mono font-bold text-zinc-950 block">7.2% YoY</span>
                <p className="text-xs text-zinc-500 mt-1">Heavy manufacturing and refinery driven.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Export Expansion</span>
                <span className="text-2xl font-mono font-bold text-zinc-950 block">+14.5%</span>
                <p className="text-xs text-zinc-500 mt-1">Mining and LNG products driven.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Knowledge Transfer Index</span>
                <span className="text-2xl font-mono font-bold text-emerald-700 block">84.2% Passed</span>
                <p className="text-xs text-zinc-500 mt-1">Consortium JVs local training checked.</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 33: STRATEGIC WAR ROOM SCENE */}
        {docId === 'doc-warroom' && (
          <div className="space-y-6">
            <div className="p-5 border border-zinc-200 bg-zinc-50 rounded-xl space-y-4">
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Cabinet and Treasury Strategic Scorboard</h3>
              <p className="text-xs text-zinc-500">Unified overview of critical indicators across the entire national procurement of works, consulting, and hydrocarbons.</p>
              
              <div className="grid md:grid-cols-3 gap-4 text-center text-xs">
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-[10px] font-mono font-bold text-zinc-452 block mb-1 uppercase text-zinc-400">Target pipelines</span>
                  <span className="text-lg font-mono font-bold text-zinc-900 block">18 Mega-projects</span>
                </div>
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-[10px] font-mono font-bold text-zinc-452 block mb-1 uppercase text-zinc-400">Total commit funds</span>
                  <span className="text-lg font-mono font-bold text-emerald-700 block">$18.2 Billion</span>
                </div>
                <div className="p-4 bg-white border border-zinc-100 rounded-lg">
                  <span className="text-[10px] font-mono font-bold text-zinc-452 block mb-1 uppercase text-zinc-400">NeST user activity</span>
                  <span className="text-lg font-mono font-bold text-zinc-900 block">94.8% Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Universal Section: Multi-Document Next Navigation */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-html2pdf-ignore="true">
          <button 
            onClick={() => {
              const currentIdx = DOCUMENTS.findIndex(d => d.id === docId);
              if (currentIdx > 0) {
                onNavigateToDoc(DOCUMENTS[currentIdx - 1].id);
              }
            }}
            disabled={doc.number === 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            ← Previous Section
          </button>
          
          <div className="text-center font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            Section {doc.number} of 33
          </div>

          <button 
            onClick={() => {
              const currentIdx = DOCUMENTS.findIndex(d => d.id === docId);
              if (currentIdx < DOCUMENTS.length - 1) {
                onNavigateToDoc(DOCUMENTS[currentIdx + 1].id);
              }
            }}
            disabled={doc.number === DOCUMENTS.length}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Next Section →
          </button>
        </div>

      </div>
    </div>
  );
}

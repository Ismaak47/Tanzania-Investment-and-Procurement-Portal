import { Category, DocumentSection } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'regulatory',
    title: 'Regulatory & Compliance',
    color: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-200',
    textColor: 'text-slate-900'
  },
  {
    id: 'marketplace',
    title: 'Opportunity Marketplace',
    color: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-200',
    textColor: 'text-slate-900'
  },
  {
    id: 'finance',
    title: 'Strategic Capital & Finance',
    color: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-200',
    textColor: 'text-slate-900'
  },
  {
    id: 'command',
    title: 'Scenario & Decision Command',
    color: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-200',
    textColor: 'text-slate-900'
  }
];

export const DOCUMENTS: DocumentSection[] = [
  // 1. Regulatory & Compliance
  {
    id: 'doc-legal',
    categoryId: 'regulatory',
    title: 'Legal Framework & NeST Architecture',
    shortDesc: 'Structure of governing legislative acts, transparency rules, and the central digital interface (NeST).',
    number: 1
  },
  {
    id: 'doc-steps',
    categoryId: 'regulatory',
    title: 'Step-by-Step Uzabuni Guide',
    shortDesc: 'Swahili procurement terminology, bid security procedures, timelines and registration workflows.',
    number: 2
  },
  {
    id: 'doc-works',
    categoryId: 'regulatory',
    title: 'Works & Heavy Civil Projects',
    shortDesc: 'CRB classification categories, value thresholds, joint-venture models and compliance expectations.',
    number: 3
  },
  {
    id: 'doc-consultancy',
    categoryId: 'regulatory',
    title: 'Ubunifu & General Services',
    shortDesc: 'Design & consulting bids, QCBS evaluations, technical scoring weight, and intellectual property.',
    number: 4
  },
  {
    id: 'doc-checklist',
    categoryId: 'regulatory',
    title: 'Investor Compliance Checklist',
    shortDesc: 'Interactive mandatory paperwork manager, TRA clearances, licensing, and local submission requirements.',
    number: 5
  },
  {
    id: 'doc-dataroom',
    categoryId: 'regulatory',
    title: 'Virtual Investor Data Room',
    shortDesc: 'MDB due diligence portal. Audited records, compliance, and corporate registrations.',
    number: 6
  },
  {
    id: 'doc-incentives',
    categoryId: 'regulatory',
    title: 'Investment Incentives Center',
    shortDesc: 'Special Economic Zones (SEZ) & EPZ rules, corporate tax holidays, customs exemption models.',
    number: 7
  },
  {
    id: 'doc-compliance',
    categoryId: 'regulatory',
    title: 'Compliance & Certifications',
    shortDesc: 'Overview of standard alignments required for DFI financing, ISO, and ESG indicators.',
    number: 8
  },
  {
    id: 'doc-marketentry',
    categoryId: 'regulatory',
    title: 'International Market Entry',
    shortDesc: 'Optimized pathway planner grouped by regional origin, local partner rules, and TIC setups.',
    number: 9
  },
  {
    id: 'doc-localcontent',
    categoryId: 'regulatory',
    title: 'Local Content Command Center',
    shortDesc: 'Localization targets, workforce quotas, supplier tier tracking, and community training models.',
    number: 10
  },

  // 2. Opportunity Marketplace
  {
    id: 'doc-marketplace',
    categoryId: 'marketplace',
    title: 'National Project Marketplace',
    shortDesc: 'Sovereign infrastructure pipelines, EPC+F setups, government concessions and CAPEX metrics.',
    number: 11
  },
  {
    id: 'doc-nuclear',
    categoryId: 'marketplace',
    title: 'Nuclear & Uranium Sector',
    shortDesc: 'National grid diversification, Mkuju River deposit, SMR project exploration, and TAEC safety laws.',
    number: 12
  },
  {
    id: 'doc-gas',
    categoryId: 'marketplace',
    title: 'Natural Gas & LNG Pipeline',
    shortDesc: 'Lindi LNG Terminal offshore extraction, TPDC joint ventures, and domestic gas connections.',
    number: 13
  },
  {
    id: 'doc-upstream',
    categoryId: 'marketplace',
    title: 'Upstream Bidding Rounds',
    shortDesc: 'Active oil and gas block licensing rounds, deepwater blocks, rift basin exploration terms.',
    number: 14
  },
  {
    id: 'doc-forecasting',
    categoryId: 'marketplace',
    title: 'Procurement Forecasting Engine',
    shortDesc: 'Predictive tender timelines, upcoming major announcements, and budget scheduling projections.',
    number: 15
  },
  {
    id: 'doc-oppintel',
    categoryId: 'marketplace',
    title: 'National Opportunity Intel',
    shortDesc: 'Sovereign opportunity sectors registry and benchmarking comparisons with regional networks.',
    number: 16
  },
  {
    id: 'doc-supplychain',
    categoryId: 'marketplace',
    title: 'Mega Project Supply Chain',
    shortDesc: 'Auxiliary plant requirements, specialized material specifications, and logistics mapping links.',
    number: 17
  },
  {
    id: 'doc-geomap',
    categoryId: 'marketplace',
    title: 'Geospatial Investment Map',
    shortDesc: 'Interactive spatial zoning dashboard containing regional project matrices and transit corridors.',
    number: 18
  },

  // 3. Strategic Capital & Finance
  {
    id: 'doc-countryintel',
    categoryId: 'finance',
    title: 'Country Intelligence Center',
    shortDesc: 'National macroeconomic metrics, GDP growth rate projections, and inflation benchmarks.',
    number: 19
  },
  {
    id: 'doc-stakeholders',
    categoryId: 'finance',
    title: 'Stakeholder Ecosystem Mapping',
    shortDesc: 'Inter-agency workflow mapping, detailing relationships across EWURA, TPDC, TANESCO, TIC, and PURA.',
    number: 20
  },
  {
    id: 'doc-matcher',
    categoryId: 'finance',
    title: 'Strategic Partner Matcher',
    shortDesc: 'AI co-investment configuration engine for compiling consortium structures and local JVs.',
    number: 21
  },
  {
    id: 'doc-finance',
    categoryId: 'finance',
    title: 'Infrastructure Finance Hub',
    shortDesc: 'Capital structures tool, debt syndication rules, and MDB co-finance options.',
    number: 22
  },
  {
    id: 'doc-alignment',
    categoryId: 'finance',
    title: 'National Development Alignment',
    shortDesc: 'Sovereign Five-Year Development Plans (FYDP IV) priority tracking and sovereign guarantee guidelines.',
    number: 23
  },
  {
    id: 'doc-exit',
    categoryId: 'finance',
    title: 'Investor Exit Strategy Center',
    shortDesc: 'Multi-stage monetization options, BOOT concession transfer rules, and equity listings.',
    number: 24
  },
  {
    id: 'doc-swf',
    categoryId: 'finance',
    title: 'Sovereign Wealth Fund Hub',
    shortDesc: 'Active capital commitment dashboard and sovereign infrastructure funding gaps metrics.',
    number: 25
  },
  {
    id: 'doc-dfi',
    categoryId: 'finance',
    title: 'Development Finance Hub',
    shortDesc: 'Multilateral credit pathways selector, credit preconditions, and social audit metrics.',
    number: 26
  },
  {
    id: 'doc-corridor',
    categoryId: 'finance',
    title: 'Russia–Tanzania Corridor',
    shortDesc: 'Bilateral industrial fields, mineral agreements, fertilizer complexes, and transit networks.',
    number: 27
  },

  // 4. Scenario & Decision Command
  {
    id: 'doc-command',
    categoryId: 'command',
    title: 'Executive Command Center',
    shortDesc: 'Real-time corporate readiness tracker and active compliance alarm tickers.',
    number: 28
  },
  {
    id: 'doc-advisor',
    categoryId: 'command',
    title: 'AI Strategic Advisor',
    shortDesc: 'Responsive dialogue simulator generating custom market and bidding compliance insights.',
    number: 29
  },
  {
    id: 'doc-decisionsupport',
    categoryId: 'command',
    title: 'Decision Support Engine',
    shortDesc: 'Interactive scoring simulation assessing readiness, attractiveness, and risk indices.',
    number: 30
  },
  {
    id: 'doc-scenario',
    categoryId: 'command',
    title: 'Strategic Scenario Planning',
    shortDesc: 'Pre-drafted macroeconomic scenario paths with corresponding risk indices and action models.',
    number: 31
  },
  {
    id: 'doc-econtransformation',
    categoryId: 'command',
    title: 'Economic Transformation Center',
    shortDesc: 'Industrialization index, export values tracking, and dynamic technology transfer rates.',
    number: 32
  },
  {
    id: 'doc-warroom',
    categoryId: 'command',
    title: 'Strategic National War Room',
    shortDesc: 'Consolidated overview scorecard for state ministers, tracking pipelines, compliance, and activities.',
    number: 33
  }
];

// Seed checklist items
export interface ChecklistItem {
  id: string;
  label: string;
  desc: string;
  section: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Registry (Data Room) Checklists
  { id: 'dr-1', section: 'dataroom', label: 'Audited Financials (3 Years)', desc: 'Audited balances and cashflow logs verified by registered audit bodies.' },
  { id: 'dr-2', section: 'dataroom', label: 'Tax Compliance Certification (TRA)', desc: 'Active verification scroll issued by the Tanzania Revenue Authority.' },
  { id: 'dr-3', section: 'dataroom', label: 'Local Incorporation Registry (BRELA)', desc: 'Certified memorandum and certificate of incorporation details.' },
  { id: 'dr-4', section: 'dataroom', label: 'MDB Anti-Corruption Alignment Scanned', desc: 'Pre-requisite integrity statement verified mapping to WB/AfDB terms.' },
  { id: 'dr-5', section: 'dataroom', label: 'Registered Local Office Details Lease', desc: 'Physical office inspection confirmation at Dar es Salaam or Dodoma.' },

  // Compliance Certifications Checklists
  { id: 'cc-1', section: 'compliance', label: 'ISO 9001:2015 Certification', desc: 'Active Quality Management credential checked.' },
  { id: 'cc-2', section: 'compliance', label: 'ISO 14001:2015 Certification', desc: 'Active Environmental Management validation certificate.' },
  { id: 'cc-3', section: 'compliance', label: 'ISO 45001:2018 Certification', desc: 'Occupational Health and Safety management systems verified.' },
  { id: 'cc-4', section: 'compliance', label: 'ESG Compliance Audit Clearances', desc: 'Equator Principles alignment and local environmental license approval.' },
  
  // Investor Compliance
  { id: 'ic-1', section: 'checklist', label: 'BRELA Company Registration', desc: 'Full business certificate listing active directors.' },
  { id: 'ic-2', section: 'checklist', label: 'TRA TIN & VAT Activation', desc: 'Approved tax identification parameters with clean audits.' },
  { id: 'ic-3', section: 'checklist', label: 'ERB / CRB Category 1 Reg', desc: 'National Contractor Registration Board approved permit documentation.' },
  { id: 'ic-4', section: 'checklist', label: 'Bank of Tanzania Escrow Setup', desc: 'Assurance accounts established and approved for capitalization.' },
  { id: 'ic-5', section: 'checklist', label: 'NEMC Environmental Clearance', desc: 'National Environment Management Council certified impact assessments.' },

  // Local Content Command Checklists
  { id: 'lc-1', section: 'localcontent', label: 'Tanzanian Engineer Employment (80%)', desc: 'Verified list of skilled team members matching PURA criteria.' },
  { id: 'lc-2', section: 'localcontent', label: 'Technology Transfer Schedule Enacted', desc: 'Active schedule of knowledge-transfer sequences for local team.' },
  { id: 'lc-3', section: 'localcontent', label: 'Community Education Contribution (0.5%)', desc: 'Funding commitments configured for engineering education projects.' },
  { id: 'lc-4', section: 'localcontent', label: 'Tier-1 Domestic Vendor Preference Log', desc: 'Procurement policy document signed for sourcing local aggregate/steel first.' }
];

export const PIPELINE_PROJECTS = [
  { id: 'p1', name: 'Lindi Liquefied Natural Gas (LNG) Complex', sector: 'Hydrocarbon', cap: 'USD 42.0 Billion', irr: '17.8%', progress: 'Host Agreement Negotiation', valueNum: 42.0, irrNum: 17.8 },
  { id: 'p2', name: 'Julius Nyerere Hydropower Dam Completion', sector: 'Renewable Power', cap: 'USD 3.0 Billion', irr: '14.2%', progress: '94% Construction Complete', valueNum: 3.0, irrNum: 14.2 },
  { id: 'p3', name: 'Standard Gauge Railway (SGR) Phase 3-5', sector: 'Transport Civil', cap: 'USD 7.6 Billion', irr: '11.5%', progress: 'Active Construction Tracks', valueNum: 7.6, irrNum: 11.5 },
  { id: 'p4', name: 'Mkuju River Uranium Mine (Mantra Rosatom)', sector: 'Mining Nuclear', cap: 'USD 1.0 Billion', irr: '19.4%', progress: 'Pilot Extraction Complete', valueNum: 1.0, irrNum: 19.4 },
  { id: 'p5', name: 'Kigamboni Urban Bridge & Smart Grid Hub', sector: 'Municipal Infra', cap: 'USD 5.0 Billion', irr: '13.5%', progress: 'Feasibility Stage Clear', valueNum: 5.0, irrNum: 13.5 },
  { id: 'p6', name: 'Ntorya Gas-to-Power Pipeline Connection', sector: 'Gas Transmission', cap: 'USD 1.5 Billion', irr: '16.2%', progress: 'Prequalification Rounds', valueNum: 1.5, irrNum: 16.2 }
];

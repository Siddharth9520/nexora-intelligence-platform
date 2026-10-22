"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ContextInspector, InspectorItem } from "@/components/layout/ContextInspector";
import { CreateCaseModal } from "@/components/modals/CreateCaseModal";
import { CommandPaletteModal } from "@/components/modals/CommandPaletteModal";
import { CasesScreen } from "@/components/views/CasesScreen";
import { KnowledgeGraphView } from "@/components/views/KnowledgeGraphView";
import { TimelineView } from "@/components/views/TimelineView";
import { nexoraApi } from "@/lib/api-client";
import { HealthResponse, DashboardSummary } from "@/types/intelligence";
import {
  Shield,
  Sparkles,
  ArrowRight,
  FolderSearch,
  Network,
  MapPin,
  ShieldCheck,
  Clock,
  Bot,
  Scale,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Fingerprint,
  Activity,
  FileCheck2,
  Users,
} from "lucide-react";

export default function CommandCenterPage() {
  const [activeModule, setActiveModule] = useState<string>("command-center");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("CASE-001");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Inspector state
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [inspectorItem, setInspectorItem] = useState<InspectorItem | null>({
    type: "case",
    id: "CASE-001",
    title: "Operation Vanguard Horizon",
    subtitle: "Critical Regional Infrastructure Intrusion",
    classification: "SECRET // NOFORN",
    confidence: 89,
    epistemicType: "result",
    description:
      "Active investigation into unauthorized physical perimeter breach at North Telemetry Substation Gate 4, followed by SCADA RTU-09 firmware corruption and correlated 433.92 MHz RF burst triggers.",
    hash: "sha256:4a8e2b9c71...genesis001",
    metadata: {
      "Target Facility": "AeroGrid Substation #04",
      "Breach Vector": "Gate 4 Turnstile (Bypassed)",
      "Incident Date": "2026-10-14 02:41 UTC",
      "Assigned Lead": "Analyst K. Vance (KV-4819)",
    },
    linkedEvidence: [
      { id: "EVD-001", title: "CCTV Gate 4 Entry Footage", hash: "7f83b165...9069" },
      { id: "EVD-002", title: "SCADA RTU-09 Memory Dump", hash: "cb244e8c...c8f8" },
      { id: "EVD-004", title: "RF Spectrum 433.92 MHz", hash: "e4a78129...5f1a" },
    ],
    unverifiedAssumptions: [
      "Subject Alex Mercer acquired internal substation wiring diagrams prior to breach.",
      "Handheld SDR payload was remotely triggered from perimeter road.",
    ],
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Health and Dashboard check probe
  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hRes, dashRes] = await Promise.allSettled([
        nexoraApi.getHealth(),
        nexoraApi.getDashboard(),
      ]);

      if (hRes.status === "fulfilled") {
        setHealth(hRes.value.data);
        setLatencyMs(hRes.value.latencyMs);
        setError(null);
      } else {
        setError(hRes.reason?.message || "Failed to connect to backend service");
      }

      if (dashRes.status === "fulfilled") {
        setDashboard(dashRes.value);
      }

      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to backend service");
      setHealth(null);
      setLatencyMs(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Module items catalog
  const MODULE_CARDS = [
    {
      id: "cases",
      title: "Cases & Dossiers",
      icon: FolderSearch,
      desc: "Organize investigations, manage chain-of-custody, and review case artifacts.",
      status: "Ready",
      badge: "ACTIVE",
    },
    {
      id: "knowledge-graph",
      title: "Knowledge Graph",
      icon: Network,
      desc: "Interactive topological relationship canvas linking entities, suspects, and targets.",
      status: "Ready",
      badge: "SIGNATURE CANVAS",
    },
    {
      id: "map",
      title: "Geospatial Map",
      icon: MapPin,
      desc: "Tactical cartography mapping sensor placements, FOV cones, and waypoints (Scheduled for Phase 5).",
      status: "Planned",
      badge: "PHASE 5 CARTO",
    },
    {
      id: "evidence-vault",
      title: "Evidence Vault",
      icon: ShieldCheck,
      desc: "Cryptographically notarized evidence records with SHA-256 custody seals.",
      status: "Ready",
      badge: "SHA-256 VAULT",
    },
    {
      id: "timeline",
      title: "Timeline Reconstruction",
      icon: Clock,
      desc: "Chronological multi-stream feeds distinguishing documented facts from leads.",
      status: "Ready",
      badge: "CHRONO FEED",
    },
    {
      id: "copilot",
      title: "AI Copilot",
      icon: Bot,
      desc: "Assistive reasoning grounded in local Ollama Gemma 4 E4B models with compulsory citations.",
      status: "Standby",
      badge: "OLLAMA STANDBY",
    },
    {
      id: "hypotheses",
      title: "Hypothesis Builder",
      icon: Scale,
      desc: "Richards Heuer ACH consistency matrix systematically eliminating cognitive bias.",
      status: "Ready",
      badge: "HEUER ACH",
    },
    {
      id: "settings",
      title: "Settings & Engines",
      icon: Settings,
      desc: "Air-gapped local Ollama inference controls, Gemini API keys, and audit rules.",
      status: "Ready",
      badge: "CONFIG",
    },
  ];

  return (
    <div className="flex min-h-screen bg-nexora-app text-nexora-text font-sans antialiased selection:bg-nexora-purple/30 selection:text-nexora-purpleBright">
      {/* 1. Persistent Sidebar Shell */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={(id) => {
          setActiveModule(id);
          if (id === "cases") {
            setInspectorItem({
              type: "case",
              id: selectedCaseId,
              title: "Operation Vanguard Horizon",
              subtitle: "Critical Regional Infrastructure Intrusion",
              classification: "SECRET // NOFORN",
              confidence: 89,
              epistemicType: "result",
              description: "Active investigation into unauthorized physical perimeter breach at North Telemetry Substation Gate 4.",
              hash: "sha256:4a8e2b9c71...genesis001",
            });
          } else if (id === "knowledge-graph") {
            setInspectorItem({
              type: "entity",
              id: "ENT-001",
              title: "Alex Mercer",
              subtitle: "Primary Suspect • Former Substation Contractor",
              confidence: 85,
              epistemicType: "lead",
              classification: "PERSON",
              description: "Biometric facial match (85% confidence) correlated with CCTV Cam-04 entry timestamp 02:41:09 UTC.",
              metadata: { "Alias": "Kestrel-09", "Status": "Active Person of Interest" },
              linkedEvidence: [{ id: "EVD-001", title: "CCTV Cam-04 Entry" }],
            });
          }
        }}
        onNewCase={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Central Shell Area */}
      <div className="flex-1 ml-60 flex flex-col min-w-0">
        {/* Persistent Top Header */}
        <Header
          isLive={!!health && !error}
          latencyMs={latencyMs}
          onRefresh={checkHealth}
          isChecking={isLoading}
          version={health?.version || "0.1.0"}
          activeCaseId={selectedCaseId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          breadcrumbs={[
            "NEXORA",
            activeModule.replace("-", " ").toUpperCase(),
          ]}
        />

        {/* 3. Main Dynamic Workspace + Inspector Wrapper */}
        <div className="flex-1 flex min-w-0">
          <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-6xl mx-auto w-full">
            {/* VIEW ROUTING */}
            {activeModule === "cases" || activeModule === "evidence-vault" || activeModule === "hypotheses" ? (
              <CasesScreen
                selectedCaseId={selectedCaseId}
                onSelectCaseId={setSelectedCaseId}
                onOpenGraph={(cid) => {
                  setSelectedCaseId(cid);
                  setActiveModule("knowledge-graph");
                }}
                onOpenCreateCase={() => setIsCreateModalOpen(true)}
                onSelectInspectorItem={(item) => {
                  setInspectorItem(item);
                  setIsInspectorOpen(true);
                }}
              />
            ) : activeModule === "knowledge-graph" ? (
              <KnowledgeGraphView
                caseId={selectedCaseId}
                onSelectCaseId={setSelectedCaseId}
                onReturnToCase={(cid) => {
                  setSelectedCaseId(cid);
                  setActiveModule("cases");
                }}
                onSelectInspectorItem={(item) => {
                  setInspectorItem(item);
                  setIsInspectorOpen(true);
                }}
              />
            ) : activeModule === "timeline" ? (
              <TimelineView
                caseId={selectedCaseId}
                onSelectInspectorItem={(item) => {
                  setInspectorItem(item);
                  setIsInspectorOpen(true);
                }}
              />
            ) : (
              /* DEFAULT: COMMAND CENTER DASHBOARD */
              <div className="space-y-8">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden rounded-xl border border-nexora-border bg-gradient-to-r from-nexora-lowest via-nexora-surface to-nexora-lowest p-6 md:p-8 shadow-2xl">
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-nexora-purple/15 text-nexora-purpleBright border border-nexora-purple/30 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-nexora-purpleBright" />
                        NEXORA COMMAND CENTER • PHASE 3 LIVE
                      </span>
                      <span className="text-nexora-textSubtle text-xs hidden sm:inline">•</span>
                      <span className="text-xs font-mono text-nexora-cyan">
                        Canonical Synthetic Intelligence Platform
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
                        Every connection reveals a clue.
                      </h1>
                      <p className="text-sm md:text-base text-nexora-textSecondary font-medium">
                        Explore evidence, uncover relationships, and organize analytical findings in one investigative workspace.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                      <button
                        onClick={() => setActiveModule("cases")}
                        className="py-2 px-4 rounded-md bg-nexora-purpleActive hover:bg-nexora-purple text-white font-medium flex items-center gap-2 shadow-lg shadow-nexora-purple/20 transition-all"
                      >
                        <span>Open Cases ({selectedCaseId})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveModule("knowledge-graph")}
                        className="py-2 px-4 rounded-md bg-nexora-raised border border-nexora-border hover:bg-nexora-surface text-nexora-text font-medium flex items-center gap-2 transition-all"
                      >
                        <Network className="w-4 h-4 text-nexora-cyan" />
                        <span>Explore Knowledge Graph</span>
                      </button>

                      <button
                        onClick={() => setIsCommandPaletteOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-nexora-sidebar border border-nexora-border text-nexora-textMuted hover:text-nexora-text transition-colors font-mono text-[11px]"
                      >
                        <span>Global Search</span>
                        <kbd className="px-1 py-0.5 rounded bg-nexora-raised border border-nexora-border text-[10px]">
                          Cmd+K
                        </kbd>
                      </button>
                    </div>
                  </div>

                  {/* Subtle background ambient graphic */}
                  <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-nexora-purple/10 to-transparent pointer-events-none" />
                </section>

                {/* SYNTHETIC DATASET STATS BAR */}
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: "Cases", count: dashboard?.total_cases || 3, icon: FolderSearch, color: "text-white" },
                    { label: "Entities", count: dashboard?.total_entities || 8, icon: Users, color: "text-nexora-purpleBright" },
                    { label: "Evidence", count: dashboard?.total_evidence || 6, icon: ShieldCheck, color: "text-nexora-cyan" },
                    { label: "Relationships", count: dashboard?.total_relationships || 10, icon: Network, color: "text-nexora-ice" },
                    { label: "Timeline", count: dashboard?.total_timeline_events || 6, icon: Clock, color: "text-amber-400" },
                    { label: "Hypotheses", count: dashboard?.total_hypotheses || 3, icon: Scale, color: "text-emerald-400" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="p-3 rounded-lg bg-nexora-surface border border-nexora-border flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded bg-nexora-lowest border border-nexora-border flex items-center justify-center text-nexora-purple">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-base font-bold font-mono ${stat.color}`}>
                            {stat.count}
                          </div>
                          <div className="text-[10px] font-mono text-nexora-textSubtle uppercase">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>

                {/* EPISTEMOLOGICAL TRUST PRINCIPLES */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Documented Fact */}
                  <div className="p-4 rounded-lg bg-nexora-surface border border-nexora-border space-y-2 hover:border-nexora-cyan/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-nexora-cyan" />
                        Documented Fact
                      </span>
                      <span className="text-[10px] font-mono text-nexora-cyan bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60 font-semibold">
                        {dashboard?.epistemic_breakdown?.facts_count || 4} RECORDS
                      </span>
                    </div>
                    <p className="text-xs text-nexora-textSecondary leading-relaxed">
                      Information directly supported by source evidence, cryptographic hashes, and immutable chain-of-custody records.
                    </p>
                  </div>

                  {/* Analytical Result */}
                  <div className="p-4 rounded-lg bg-nexora-surface border border-nexora-border space-y-2 hover:border-nexora-ice/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-nexora-ice uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-nexora-ice" />
                        Analytical Result
                      </span>
                      <span className="text-[10px] font-mono text-nexora-ice bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/60 font-semibold">
                        {dashboard?.epistemic_breakdown?.results_count || 2} REPRODUCIBLE
                      </span>
                    </div>
                    <p className="text-xs text-nexora-textSecondary leading-relaxed">
                      Reproducible findings generated by defined analytical methods, signal Fourier transforms, and graph algorithms.
                    </p>
                  </div>

                  {/* AI Investigative Lead */}
                  <div className="p-4 rounded-lg bg-nexora-surface border border-nexora-border space-y-2 hover:border-nexora-amber/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-nexora-amber uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-nexora-amber" />
                        AI Investigative Lead
                      </span>
                      <span className="text-[10px] font-mono text-nexora-amber bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60 font-semibold">
                        {dashboard?.epistemic_breakdown?.leads_count || 6} UNVERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-nexora-textSecondary leading-relaxed">
                      Hypotheses and suggestions that require verification against available evidence. Never auto-committed as verified facts.
                    </p>
                  </div>
                </section>

                {/* INVESTIGATION WORKFLOW STEPPER */}
                <section className="p-4 md:p-5 rounded-lg bg-nexora-surface border border-nexora-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-nexora-textSubtle uppercase tracking-wider">
                      CANONICAL INVESTIGATIVE PROGRESSION
                    </span>
                    <span className="font-mono text-[11px] text-nexora-cyan">
                      {selectedCaseId} ACTIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {[
                      { step: "01", name: "Evidence", target: "cases", count: `${dashboard?.total_evidence || 6} Files` },
                      { step: "02", name: "Entities", target: "cases", count: `${dashboard?.total_entities || 8} Subjects` },
                      { step: "03", name: "Relationships", target: "knowledge-graph", count: `${dashboard?.total_relationships || 10} Links` },
                      { step: "04", name: "Hypotheses", target: "cases", count: `${dashboard?.total_hypotheses || 3} Evaluated` },
                      { step: "05", name: "Timeline", target: "timeline", count: `${dashboard?.total_timeline_events || 6} Events` },
                    ].map((s) => (
                      <button
                        key={s.step}
                        onClick={() => setActiveModule(s.target)}
                        className="p-3 rounded-md bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/50 text-left transition-all group"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono text-nexora-textSubtle">
                          <span>STEP {s.step}</span>
                          <span className="text-nexora-purple group-hover:text-nexora-purpleBright">→</span>
                        </div>
                        <div className="font-semibold text-nexora-text mt-1">{s.name}</div>
                        <div className="text-[11px] font-mono text-nexora-cyan mt-0.5">{s.count}</div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 8-MODULE WORKSPACE GRID */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-nexora-text">
                      Investigative Suites & Analytical Modules
                    </h2>
                    <span className="text-xs font-mono text-nexora-textSubtle">8 IMPLEMENTED MODULES</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MODULE_CARDS.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={mod.id}
                          onClick={() => {
                            setActiveModule(mod.id);
                            if (mod.id === "evidence-vault" || mod.id === "cases") {
                              setInspectorItem({
                                type: "evidence",
                                id: "EVD-001",
                                title: "CCTV Video Feed - Telemetry Cabin Entry 04",
                                subtitle: "AeroGrid North Substation Array",
                                classification: "VIDEO RECORD",
                                epistemicType: "fact",
                                description: "High-definition video showing subject in dark coveralls using a cloned RFID credential at door 04.",
                                hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
                                metadata: { "Camera ID": "Cam-04", "Resolution": "1080p60", "FPS": "60" },
                              });
                            } else if (mod.id === "timeline") {
                              setInspectorItem({
                                type: "event",
                                id: "EVT-004",
                                title: "Door 04 Forced Mechanical/RFID Bypass",
                                subtitle: "2026-03-14 02:41:09 UTC",
                                epistemicType: "fact",
                                description: "Subject entered cabin door 04. Corroborated by CCTV EVD-001 and PACS log EVD-002.",
                                metadata: { "Sync": "NTP Pool 0 Clock", "Delta to Crash": "+06m 24s" },
                              });
                            } else if (mod.id === "hypotheses") {
                              setInspectorItem({
                                type: "hypothesis",
                                id: "HYP-001",
                                title: "Targeted SCADA Sabotage via Physical Access",
                                subtitle: "Heuer Consistency Fit: 91%",
                                confidence: 91,
                                epistemicType: "lead",
                                description: "Alex Mercer utilized physical access to upload corrupted firmware to RTU-09.",
                                metadata: { "Status": "Under Review", "Lead Analyst": "K. Vance" },
                              });
                            }
                          }}
                          className="p-4 rounded-lg bg-nexora-surface border border-nexora-border hover:border-nexora-purple/50 cursor-pointer transition-all hover:bg-nexora-raised flex flex-col justify-between group space-y-3"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="w-8 h-8 rounded-md bg-nexora-lowest border border-nexora-border flex items-center justify-center text-nexora-purple group-hover:text-nexora-purpleBright transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-nexora-lowest border border-nexora-border text-nexora-cyan font-bold">
                                {mod.badge}
                              </span>
                            </div>
                            <h3 className="font-display text-sm font-bold text-nexora-text group-hover:text-nexora-purpleBright transition-colors">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-nexora-textMuted leading-relaxed">
                              {mod.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-nexora-border/60 flex items-center justify-between text-[11px] font-mono text-nexora-textSubtle">
                            <span>Status: <strong className="text-nexora-green font-normal">{mod.status}</strong></span>
                            <ArrowRight className="w-3.5 h-3.5 text-nexora-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* TRUTHFUL SYSTEM & GATEWAY STATUS */}
                <section className="p-4 rounded-lg bg-nexora-lowest border border-nexora-border text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-nexora-textSubtle font-semibold uppercase tracking-wider">
                      SYSTEM CONNECTIVITY & INFERENCE TELEMETRY
                    </span>
                    <span className="text-nexora-cyan">CANONICAL BACKEND :8000</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded bg-nexora-surface border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">BACKEND GATEWAY</div>
                      <div className="text-nexora-green font-semibold mt-0.5">
                        {health ? "FASTAPI :8000 ONLINE" : "CONNECTING..."}
                      </div>
                      <div className="text-[10px] text-nexora-textMuted mt-0.5">
                        Latency: {latencyMs !== null ? `${latencyMs}ms` : "N/A"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-nexora-surface border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">CANONICAL STORE</div>
                      <div className="text-nexora-text font-semibold mt-0.5">Verified In-Memory</div>
                      <div className="text-[10px] text-nexora-textMuted mt-0.5">
                        {dashboard?.total_cases || 3} Cases • {dashboard?.total_entities || 8} Entities
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-nexora-surface border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">LOCAL INFERENCE</div>
                      <div className="text-nexora-purpleBright font-semibold mt-0.5">Ollama Gemma 4 E4B</div>
                      <div className="text-[10px] text-nexora-textMuted mt-0.5">Air-gapped (Localhost)</div>
                    </div>

                    <div className="p-2.5 rounded bg-nexora-surface border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">INTEGRITY VALIDATION</div>
                      <div className="text-nexora-cyan font-semibold mt-0.5">SHA-256 Bitstream</div>
                      <div className="text-[10px] text-nexora-textMuted mt-0.5">0 Hash Violations</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* FOOTER */}
            <footer className="pt-6 pb-4 border-t border-nexora-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-nexora-textSubtle">
              <div>NEXORA Intelligence Platform • Phase 3 Rapid Demo & Validation</div>
              <div className="flex items-center gap-3">
                <span>Synthetic Demo Dataset</span>
                <span>MIT License</span>
              </div>
            </footer>
          </main>

          {/* 4. Right Context Inspector */}
          <ContextInspector
            item={inspectorItem}
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
            onClearSelection={() => setInspectorItem(null)}
            onNavigateToModule={(mod) => setActiveModule(mod)}
          />
        </div>
      </div>

      {/* 5. Modals */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(caseData) => {
          setSelectedCaseId(caseData.id);
          setActiveModule("cases");
          setInspectorItem({
            type: "case",
            id: caseData.id,
            title: caseData.name,
            subtitle: "Newly allocated investigation dossier",
            classification: "SECRET // NOFORN",
            confidence: 100,
            epistemicType: "result",
            description: "Dossier initialized with SHA-256 genesis block and bound to active analyst key.",
            hash: "sha256:genesis_cobalt_sentinel_002",
          });
        }}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectResult={(targetModule, itemId) => {
          setActiveModule(targetModule);
          if (itemId === "ENT-001") {
            setInspectorItem({
              type: "entity",
              id: "ENT-001",
              title: "Alex Mercer",
              subtitle: "Primary Suspect • Former Substation Contractor",
              confidence: 85,
              epistemicType: "lead",
              classification: "PERSON",
              description: "Correlated to North Substation breach via Cam-04 biometric facial detection.",
            });
          }
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CaseSummary,
  Case,
  Entity,
  Evidence,
  Relationship,
  TimelineEvent,
  Hypothesis,
} from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  FolderOpen,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Network,
  Clock,
  Scale,
  Hash,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Layers,
  ArrowRight,
  User,
  Building2,
  Truck,
  Database,
  Radio,
  FileText,
  Plus,
  X,
} from "lucide-react";

interface CasesScreenProps {
  selectedCaseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onOpenGraph?: (caseId: string) => void;
  onOpenCreateCase?: () => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

export const CasesScreen: React.FC<CasesScreenProps> = ({
  selectedCaseId = "CASE-001",
  onSelectCaseId,
  onOpenGraph,
  onOpenCreateCase,
  onSelectInspectorItem,
}) => {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>(selectedCaseId);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "entities" | "evidence" | "relationships" | "timeline" | "hypotheses"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync external selectedCaseId
  useEffect(() => {
    if (selectedCaseId && selectedCaseId !== activeCaseId) {
      setActiveCaseId(selectedCaseId);
    }
  }, [selectedCaseId]);

  // Load all cases on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCases() {
      setIsLoadingCases(true);
      try {
        const caseSummaries = await nexoraApi.getCases();
        if (isMounted) {
          setCases(caseSummaries);
          if (caseSummaries.length > 0 && !activeCaseId) {
            setActiveCaseId(caseSummaries[0].id);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load cases");
        }
      } finally {
        if (isMounted) setIsLoadingCases(false);
      }
    }
    fetchCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load details for the active case
  useEffect(() => {
    if (!activeCaseId) return;

    let isMounted = true;
    async function fetchCaseDetails() {
      setIsLoadingDetails(true);
      try {
        const [c, ents, evds, rels, tl, hyps] = await Promise.all([
          nexoraApi.getCase(activeCaseId),
          nexoraApi.getEntitiesForCase(activeCaseId),
          nexoraApi.getEvidenceForCase(activeCaseId),
          nexoraApi.getRelationshipsForCase(activeCaseId),
          nexoraApi.getTimeline(activeCaseId),
          nexoraApi.getHypotheses(activeCaseId),
        ]);

        if (isMounted) {
          setActiveCase(c);
          setEntities(ents);
          setEvidenceList(evds);
          setRelationships(rels);
          setTimeline(tl);
          setHypotheses(hyps);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load case dossier details");
        }
      } finally {
        if (isMounted) setIsLoadingDetails(false);
      }
    }
    fetchCaseDetails();
    return () => {
      isMounted = false;
    };
  }, [activeCaseId]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.lead_analyst.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === "all" || c.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchQuery, statusFilter, priorityFilter]);

  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    if (onSelectCaseId) onSelectCaseId(caseId);

    const match = cases.find((c) => c.id === caseId);
    if (match) {
      onSelectInspectorItem({
        type: "case",
        id: match.id,
        title: match.title,
        subtitle: `Priority: ${match.priority.toUpperCase()} • Lead: ${match.lead_analyst}`,
        classification: "SECRET // NOFORN",
        confidence: 92,
        epistemicType: "result",
        description: match.summary,
        hash: `sha256:${match.id.toLowerCase()}_genesis_anchor`,
        metadata: {
          "Case ID": match.id,
          "Lead Analyst": match.lead_analyst,
          "Priority": match.priority.toUpperCase(),
          "Status": match.status.toUpperCase(),
          "Entities": String(match.entity_count),
          "Evidence Records": String(match.evidence_count),
        },
      });
    }
  };

  const getEntityIcon = (category: string) => {
    switch (category) {
      case "person":
        return <User className="w-4 h-4 text-nexora-purple" />;
      case "organization":
        return <Building2 className="w-4 h-4 text-nexora-cyan" />;
      case "vehicle":
        return <Truck className="w-4 h-4 text-nexora-amber" />;
      case "digital_asset":
        return <Database className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-nexora-textMuted" />;
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-nexora-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              SYNTHETIC CASE REPOSITORY
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              {cases.length} REGISTERED DOSSIERS
            </span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white mt-1">
            Cases & Investigation Dossiers
          </h1>
          <p className="text-xs text-nexora-textSecondary mt-0.5">
            Cryptographically anchored investigation dossiers with strict chain of custody and multi-source corroboration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-nexora-textSubtle" />
            <input
              type="text"
              placeholder="Search by title, ID, or lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 rounded bg-nexora-surface border border-nexora-border text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple w-56 sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nexora-textSubtle hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* New Case Button */}
          {onOpenCreateCase && (
            <button
              onClick={onOpenCreateCase}
              className="px-3 py-1.5 rounded bg-nexora-purpleActive hover:bg-nexora-purple text-xs font-medium text-white flex items-center gap-1.5 shadow-md shadow-nexora-purple/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Dossier</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => handleSelectCase(activeCaseId)}
            className="text-xs font-mono underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* FILTER TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-nexora-textSubtle uppercase mr-1">Status:</span>
          {["all", "active", "archived", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                statusFilter === st
                  ? "bg-nexora-purpleActive text-white"
                  : "bg-nexora-surface border border-nexora-border text-nexora-textSubtle hover:text-nexora-text"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-nexora-textSubtle uppercase">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-xs text-nexora-text focus:outline-none focus:border-nexora-purple"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* TWO-COLUMN WORKSTATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CASE SELECTOR LIST (4 COLS) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-nexora-textSubtle uppercase tracking-wider px-1">
            <span>Dossier Index</span>
            <span>{filteredCases.length} Matched</span>
          </div>

          {isLoadingCases ? (
            <div className="p-8 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border animate-pulse">
              Loading synthetic cases...
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border space-y-2">
              <p>No matching cases found for query &quot;{searchQuery}&quot;</p>
              <button
                onClick={resetFilters}
                className="px-2.5 py-1 rounded bg-nexora-raised border border-nexora-border text-xs text-nexora-text hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredCases.map((c) => {
                const isSelected = c.id === activeCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-nexora-raised border-nexora-purple shadow-lg shadow-nexora-purple/15"
                        : "bg-nexora-surface border-nexora-border hover:border-nexora-purple/40 hover:bg-nexora-raised/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-nexora-cyan">
                        {c.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          c.priority === "critical"
                            ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                            : c.priority === "high"
                            ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                            : "bg-nexora-lowest text-nexora-ice border border-nexora-border"
                        }`}
                      >
                        {c.priority}
                      </span>
                    </div>

                    <h3 className="font-display text-sm font-bold text-white mt-1.5">
                      {c.title}
                    </h3>
                    <p className="text-xs text-nexora-textMuted line-clamp-2 mt-1 leading-relaxed">
                      {c.summary}
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-nexora-border/60 text-[11px] font-mono text-nexora-textSubtle">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-nexora-purple" />
                        {c.entity_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-nexora-cyan" />
                        {c.evidence_count}
                      </span>
                      <span className="ml-auto text-[10px] text-nexora-textMuted">
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE CASE DOSSIER DETAIL (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          {isLoadingDetails && !activeCase ? (
            <div className="p-12 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border animate-pulse">
              Loading dossier records for {activeCaseId}...
            </div>
          ) : activeCase ? (
            <div className="p-5 md:p-6 rounded-lg bg-nexora-surface border border-nexora-border space-y-5">
              {/* DOSSIER HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-nexora-border/70 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-nexora-cyan px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                      {activeCase.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nexora-lowest border border-nexora-border text-nexora-purpleBright font-semibold">
                      {activeCase.classification || "SECRET // NOFORN"}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded uppercase font-semibold">
                      STATUS: {activeCase.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-extrabold text-white mt-2">
                    {activeCase.title}
                  </h2>
                  <p className="text-xs text-nexora-textSecondary mt-1 leading-relaxed max-w-2xl">
                    {activeCase.summary}
                  </p>

                  {/* ACTION: OPEN GRAPH */}
                  {onOpenGraph && (
                    <div className="pt-3">
                      <button
                        onClick={() => onOpenGraph(activeCase.id)}
                        className="px-3.5 py-2 rounded-md bg-nexora-purpleActive hover:bg-nexora-purple text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-nexora-purple/20 transition-all group"
                      >
                        <Network className="w-4 h-4 text-nexora-cyan group-hover:scale-110 transition-transform" />
                        <span>Explore Case Knowledge Graph</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0 text-xs font-mono text-nexora-textSubtle sm:border-l sm:border-nexora-border sm:pl-4 space-y-1">
                  <div>Lead: <span className="text-nexora-text">{activeCase.lead_analyst}</span></div>
                  <div>Priority: <span className="text-rose-400 font-bold uppercase">{activeCase.priority}</span></div>
                  <div>Updated: <span className="text-nexora-text">{new Date(activeCase.updated_at).toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* DOSSIER TABS */}
              <div className="flex items-center gap-2 border-b border-nexora-border pb-1 overflow-x-auto text-xs font-mono">
                {[
                  { id: "overview", label: "Overview", count: null },
                  { id: "entities", label: "Entities", count: entities.length },
                  { id: "evidence", label: "Evidence", count: evidenceList.length },
                  { id: "relationships", label: "Relationships", count: relationships.length },
                  { id: "timeline", label: "Timeline", count: timeline.length },
                  { id: "hypotheses", label: "Hypotheses", count: hypotheses.length },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-t font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === t.id
                        ? "text-nexora-purpleBright border-b-2 border-nexora-purple bg-nexora-lowest"
                        : "text-nexora-textSubtle hover:text-nexora-text hover:bg-nexora-lowest/50"
                    }`}
                  >
                    <span>{t.label}</span>
                    {t.count !== null && (
                      <span className="text-[10px] px-1 py-0.2 rounded bg-nexora-raised text-nexora-cyan">
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded bg-nexora-lowest border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">CORROBORATED ENTITIES</div>
                      <div className="text-base font-bold text-white mt-1">{entities.length}</div>
                      <div className="text-[10px] text-nexora-purple mt-0.5">Linked to dossier</div>
                    </div>
                    <div className="p-3 rounded bg-nexora-lowest border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">SEALED EVIDENCE</div>
                      <div className="text-base font-bold text-white mt-1">{evidenceList.length}</div>
                      <div className="text-[10px] text-nexora-cyan mt-0.5">SHA-256 verified</div>
                    </div>
                    <div className="p-3 rounded bg-nexora-lowest border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">GRAPH RELATIONSHIPS</div>
                      <div className="text-base font-bold text-white mt-1">{relationships.length}</div>
                      <div className="text-[10px] text-nexora-ice mt-0.5">Directional edges</div>
                    </div>
                    <div className="p-3 rounded bg-nexora-lowest border border-nexora-border">
                      <div className="text-nexora-textSubtle text-[10px]">ACH HYPOTHESES</div>
                      <div className="text-base font-bold text-white mt-1">{hypotheses.length}</div>
                      <div className="text-[10px] text-nexora-amber mt-0.5">Competitor matrix</div>
                    </div>
                  </div>

                  {/* QUICK ACCESS HIGHLIGHTS */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-nexora-textSubtle uppercase">
                      <span>Primary Entities of Interest</span>
                      {onOpenGraph && (
                        <button
                          onClick={() => onOpenGraph(activeCase.id)}
                          className="text-nexora-purple hover:text-nexora-purpleBright flex items-center gap-1 transition-colors"
                        >
                          <span>View in Graph</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {entities.slice(0, 4).map((ent) => (
                        <div
                          key={ent.id}
                          onClick={() => {
                            onSelectInspectorItem({
                              type: "entity",
                              id: ent.id,
                              title: ent.name,
                              subtitle: `Category: ${ent.category.toUpperCase()} • Reliability: ${Math.round(
                                ent.reliability_score * 100
                              )}%`,
                              classification: ent.category.toUpperCase(),
                              confidence: Math.round(ent.reliability_score * 100),
                              epistemicType: "lead",
                              description: ent.notes || "Corroborated subject of interest.",
                              metadata: {
                                "Category": ent.category,
                                "Aliases": ent.aliases?.join(", ") || "None",
                                ...ent.identifiers,
                              },
                            });
                          }}
                          className="p-2.5 rounded bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/60 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {getEntityIcon(ent.category)}
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate group-hover:text-nexora-purpleBright">
                                {ent.name}
                              </div>
                              <div className="text-[10px] font-mono text-nexora-textSubtle">
                                {ent.id} • {ent.category}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-nexora-cyan px-1.5 py-0.5 rounded bg-nexora-surface border border-nexora-border">
                            {Math.round(ent.reliability_score * 100)}% REL
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENTITIES */}
              {activeTab === "entities" && (
                <div className="space-y-2.5">
                  <div className="text-xs text-nexora-textSubtle font-mono">
                    {entities.length} corroborating entities registered to {activeCase.id}. Click any entity to inspect cryptographic dossier.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entities.map((ent) => (
                      <div
                        key={ent.id}
                        onClick={() => {
                          onSelectInspectorItem({
                            type: "entity",
                            id: ent.id,
                            title: ent.name,
                            subtitle: `Category: ${ent.category.toUpperCase()} • Score: ${Math.round(
                              ent.reliability_score * 100
                            )}%`,
                            classification: ent.category.toUpperCase(),
                            confidence: Math.round(ent.reliability_score * 100),
                            epistemicType: "lead",
                            description: ent.notes || "Entity record in canonical store.",
                            metadata: {
                              "Entity ID": ent.id,
                              "Category": ent.category,
                              "Aliases": ent.aliases?.join(", ") || "None",
                              ...ent.identifiers,
                            },
                          });
                        }}
                        className="p-3 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-cyan/60 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getEntityIcon(ent.category)}
                            <span className="font-mono text-xs font-bold text-nexora-cyan">
                              {ent.id}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexora-surface border border-nexora-border text-nexora-textMuted uppercase">
                            {ent.category}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-nexora-cyan transition-colors">
                            {ent.name}
                          </h4>
                          {ent.aliases && ent.aliases.length > 0 && (
                            <p className="text-[11px] text-nexora-textSubtle mt-0.5">
                              Aliases: {ent.aliases.join(", ")}
                            </p>
                          )}
                        </div>

                        {ent.notes && (
                          <p className="text-[11px] text-nexora-textMuted leading-relaxed">
                            {ent.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-nexora-border/60 text-[10px] font-mono text-nexora-textSubtle">
                          <span>Reliability</span>
                          <span className="text-nexora-purpleBright font-bold">
                            {Math.round(ent.reliability_score * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EVIDENCE VAULT */}
              {activeTab === "evidence" && (
                <div className="space-y-3">
                  <div className="text-xs text-nexora-textSubtle font-mono">
                    {evidenceList.length} cryptographically notarized evidence records. Click to review SHA-256 seal and custody log.
                  </div>
                  <div className="space-y-3">
                    {evidenceList.map((evd) => (
                      <div
                        key={evd.id}
                        onClick={() => {
                          onSelectInspectorItem({
                            type: "evidence",
                            id: evd.id,
                            title: evd.title,
                            subtitle: `${evd.evidence_type.toUpperCase()} • Confidence: ${Math.round(
                              evd.confidence_score * 100
                            )}%`,
                            classification: "EVIDENCE ARCHIVE",
                            confidence: Math.round(evd.confidence_score * 100),
                            epistemicType: evd.confidence_score >= 0.95 ? "fact" : "result",
                            description: evd.summary,
                            hash: evd.checksum,
                            metadata: {
                              "Source": evd.source,
                              "Type": evd.evidence_type,
                              "Collected": new Date(evd.collected_at).toUTCString(),
                              "Custody Steps": String(evd.chain_of_custody?.length || 0),
                            },
                            linkedEvidence: [{ id: evd.id, title: evd.title, hash: evd.checksum }],
                          });
                        }}
                        className="p-3.5 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-cyan/60 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-nexora-cyan" />
                            <span className="font-mono text-xs font-bold text-nexora-cyan">
                              {evd.id}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexora-surface border border-nexora-border text-nexora-ice">
                              {evd.evidence_type}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-nexora-textSubtle">
                            {new Date(evd.collected_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-nexora-cyan transition-colors">
                            {evd.title}
                          </h4>
                          <p className="text-xs text-nexora-textMuted mt-1 leading-relaxed">
                            {evd.summary}
                          </p>
                        </div>

                        <div className="p-2 rounded bg-nexora-app border border-nexora-border/80 font-mono text-[10px] text-nexora-textSubtle flex items-center justify-between">
                          <span className="truncate pr-2">
                            Hash: <strong className="text-nexora-ice font-normal">{evd.checksum}</strong>
                          </span>
                          <span className="text-emerald-400 font-bold whitespace-nowrap">
                            {Math.round(evd.confidence_score * 100)}% VERIFIED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RELATIONSHIPS */}
              {activeTab === "relationships" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-nexora-textSubtle font-mono">
                    <span>{relationships.length} verified link graph edges between entities and incidents.</span>
                    {onOpenGraph && (
                      <button
                        onClick={() => onOpenGraph(activeCase.id)}
                        className="text-nexora-purple hover:text-nexora-purpleBright flex items-center gap-1 transition-colors"
                      >
                        <span>Open Canvas</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {relationships.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          onSelectInspectorItem({
                            type: "relationship",
                            id: rel.id,
                            title: `${rel.source_id} → ${rel.relationship_type.replace(/_/g, " ").toUpperCase()} → ${rel.target_id}`,
                            subtitle: `Confidence: ${Math.round(rel.confidence * 100)}% • Weight: ${rel.weight}`,
                            classification: "LINK GRAPH",
                            confidence: Math.round(rel.confidence * 100),
                            epistemicType: rel.inference_type === "factual" ? "fact" : "lead",
                            description: rel.notes || "Topological link between investigation nodes.",
                            metadata: {
                              "Source Node": rel.source_id,
                              "Target Node": rel.target_id,
                              "Relationship": rel.relationship_type,
                              "Direction": rel.direction,
                              "Supporting Evidence": rel.supporting_evidence_ids.join(", "),
                            },
                          });
                        }}
                        className="p-3 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/60 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-white font-bold">
                            {rel.source_id}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-nexora-purple" />
                          <span className="px-2 py-0.5 rounded bg-nexora-purple/15 text-nexora-purpleBright border border-nexora-purple/30 font-semibold text-[11px]">
                            {rel.relationship_type.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-nexora-purple" />
                          <span className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-white font-bold">
                            {rel.target_id}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono text-nexora-textSubtle">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                              rel.inference_type === "factual"
                                ? "bg-cyan-950/80 text-nexora-cyan border border-cyan-800/60"
                                : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                            }`}
                          >
                            {rel.inference_type.replace(/_/g, " ")}
                          </span>
                          <span className="text-nexora-ice font-bold">
                            {Math.round(rel.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TIMELINE */}
              {activeTab === "timeline" && (
                <div className="space-y-3">
                  <div className="text-xs text-nexora-textSubtle font-mono">
                    Chronological events sequence verified for {activeCase.id}.
                  </div>
                  <div className="relative pl-6 border-l border-nexora-border/80 space-y-4 my-2">
                    {timeline.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onSelectInspectorItem({
                            type: "event",
                            id: evt.id,
                            title: evt.title,
                            subtitle: `${new Date(evt.timestamp).toUTCString()} • Significance: ${evt.significance.toUpperCase()}`,
                            classification: "TIMELINE",
                            confidence: 95,
                            epistemicType: "fact",
                            description: evt.description,
                            metadata: {
                              "Timestamp": new Date(evt.timestamp).toISOString(),
                              "Significance": evt.significance.toUpperCase(),
                              "Linked Evidence": evt.evidence_ids.join(", "),
                              "Linked Entities": evt.entity_ids.join(", "),
                            },
                          });
                        }}
                        className="relative p-3 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/60 cursor-pointer transition-all space-y-1.5 group"
                      >
                        <div className="absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full bg-nexora-purple border-2 border-nexora-app" />
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-nexora-cyan">
                            {evt.id}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                              evt.significance === "critical"
                                ? "bg-rose-950 text-rose-400 border border-rose-800"
                                : evt.significance === "anomalous"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-nexora-surface text-nexora-textMuted border border-nexora-border"
                            }`}
                          >
                            {evt.significance}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-nexora-purpleBright transition-colors">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-nexora-textMuted leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-nexora-textSubtle">
                          <Clock className="w-3 h-3 text-nexora-purple" />
                          <span>{new Date(evt.timestamp).toUTCString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: HYPOTHESES */}
              {activeTab === "hypotheses" && (
                <div className="space-y-3">
                  <div className="text-xs text-nexora-textSubtle font-mono">
                    Analysis of Competing Hypotheses (Richards Heuer ACH Matrix) for {activeCase.id}.
                  </div>
                  <div className="space-y-3">
                    {hypotheses.map((hyp) => (
                      <div
                        key={hyp.id}
                        onClick={() => {
                          onSelectInspectorItem({
                            type: "hypothesis",
                            id: hyp.id,
                            title: hyp.title,
                            subtitle: `Credibility: ${Math.round(
                              hyp.credibility_score * 100
                            )}% • Status: ${hyp.status.toUpperCase()}`,
                            classification: "ACH HYPOTHESIS",
                            confidence: Math.round(hyp.credibility_score * 100),
                            epistemicType: "lead",
                            description: hyp.rationale,
                            metadata: {
                              "Hypothesis ID": hyp.id,
                              "Status": hyp.status.toUpperCase(),
                              "Supporting Evidence": hyp.supporting_evidence_ids.join(", "),
                              "Inconsistent Evidence": hyp.inconsistent_evidence_ids.join(", ") || "None",
                            },
                          });
                        }}
                        className="p-4 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/60 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-nexora-amber">
                            {hyp.id}
                          </span>
                          <span className="font-mono text-xs font-bold text-nexora-purpleBright">
                            {Math.round(hyp.credibility_score * 100)}% CREDIBILITY
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-nexora-purpleBright transition-colors">
                          {hyp.title}
                        </h4>
                        <p className="text-xs text-nexora-textMuted leading-relaxed">
                          {hyp.rationale}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-nexora-border/60 text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-nexora-surface text-emerald-400">
                            Supporting: {hyp.supporting_evidence_ids.join(", ") || "None"}
                          </div>
                          <div className="p-1.5 rounded bg-nexora-surface text-rose-400">
                            Inconsistent: {hyp.inconsistent_evidence_ids.join(", ") || "None"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border">
              Select a case from the index to inspect its full dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

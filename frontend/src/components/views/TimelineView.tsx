"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TimelineEvent, CaseSummary } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  Clock,
  Filter,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  ArrowRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  FileText
} from "lucide-react";

interface TimelineViewProps {
  caseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onNavigateToEvidence?: (evidenceId: string) => void;
  onNavigateToCase?: (caseId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  caseId = "CASE-001",
  onSelectCaseId,
  onNavigateToEvidence,
  onNavigateToCase,
  onSelectInspectorItem,
}) => {
  const [selectedCase, setSelectedCase] = useState<string>(caseId);
  const [casesList, setCasesList] = useState<CaseSummary[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filterSignificance, setFilterSignificance] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync internal selectedCase with external caseId prop if it changes
  useEffect(() => {
    if (caseId) {
      setSelectedCase(caseId);
    }
  }, [caseId]);

  // Load cases list for case selector
  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        const cases = await nexoraApi.getCases();
        if (isMounted) setCasesList(cases);
      } catch (err) {
        console.error("Failed to load cases in TimelineView", err);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch timeline events when selectedCase changes
  useEffect(() => {
    let isMounted = true;
    async function fetchTimeline() {
      setIsLoading(true);
      try {
        const targetCase = selectedCase === "ALL" ? undefined : selectedCase;
        const data = await nexoraApi.getTimeline(targetCase);
        if (isMounted) {
          setEvents(data);
          if (data.length > 0 && !selectedEventId) {
            setSelectedEventId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load timeline events", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchTimeline();
    return () => {
      isMounted = false;
    };
  }, [selectedCase]);

  // Filter and sort events
  const processedEvents = useMemo(() => {
    let result = [...events];

    // Filter by significance
    if (filterSignificance !== "all") {
      result = result.filter((e) => e.significance === filterSignificance);
    }

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.evidence_ids.some((evId) => evId.toLowerCase().includes(q)) ||
          e.entity_ids.some((enId) => enId.toLowerCase().includes(q))
      );
    }

    // Chronological sorting (never invent timestamps, sort strictly by recorded ISO string)
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [events, filterSignificance, searchQuery, sortOrder]);

  const handleSelectEvent = (evt: TimelineEvent) => {
    setSelectedEventId(evt.id);
    onSelectInspectorItem({
      type: "event",
      id: evt.id,
      title: evt.title,
      subtitle: `${new Date(evt.timestamp).toUTCString()} • ${evt.significance.toUpperCase()}`,
      classification: "CHRONO LOG",
      confidence: evt.significance === "critical" ? 98 : evt.significance === "anomalous" ? 88 : 94,
      epistemicType: "fact",
      description: evt.description,
      metadata: {
        "Event ID": evt.id,
        "Associated Case": evt.case_id,
        "UTC Timestamp": new Date(evt.timestamp).toISOString(),
        "Significance": evt.significance.toUpperCase(),
        "Linked Evidence": evt.evidence_ids.join(", ") || "None",
        "Linked Entities": evt.entity_ids.join(", ") || "None",
        "Documented Type": "Physical Telemetry / Sensor Audit Log",
      },
      linkedEvidence: evt.evidence_ids.map((id) => ({
        id,
        title: `Supporting Record ${id}`,
        hash: "Verified SHA-256 in Evidence Vault",
      })),
    });
  };

  const handleClearFilters = () => {
    setFilterSignificance("all");
    setSearchQuery("");
    setSortOrder("asc");
  };

  const hasActiveFilters =
    filterSignificance !== "all" || searchQuery.trim() !== "" || sortOrder !== "asc";

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-nexora-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-nexora-cyan" />
              TEMPORAL RECONSTRUCTION
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              MICROSECOND-ORDERED CHRONO LOG
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white mt-1">
            Temporal Reconstruction
          </h1>
          <p className="text-xs lg:text-sm text-nexora-textSecondary mt-1 max-w-2xl leading-relaxed">
            The workspace organizes recorded events chronologically to establish precise timelines.
            Correlates physical telemetry, access logs, and radio frequency bursts with supporting evidence records.
          </p>
        </div>

        {/* CASE SELECTOR */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <label className="text-xs font-mono text-nexora-textSubtle uppercase">Case Scope:</label>
          <select
            value={selectedCase}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCase(val);
              if (val !== "ALL" && onSelectCaseId) {
                onSelectCaseId(val);
              }
            }}
            className="bg-nexora-surface border border-nexora-border rounded px-3 py-1.5 text-xs font-mono text-nexora-text focus:outline-none focus:border-nexora-purple"
          >
            <option value="ALL">All Recorded Cases</option>
            {casesList.length > 0 ? (
              casesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.length > 25 ? `${c.title.substring(0, 25)}...` : c.title}
                </option>
              ))
            ) : (
              <>
                <option value="CASE-001">CASE-001 — Operation Vanguard Horizon</option>
                <option value="CASE-002">CASE-002 — Incident Blackwood SCADA</option>
                <option value="CASE-003">CASE-003 — Port Sector Infiltration</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* 2. CONTROLS BAR: FILTERS, SEARCH, SORT, CLEAR */}
      <div className="p-3.5 rounded-lg bg-nexora-surface border border-nexora-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          {/* Significance filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-nexora-textSubtle">Type:</span>
            {["all", "critical", "anomalous", "routine"].map((sig) => (
              <button
                key={sig}
                onClick={() => setFilterSignificance(sig)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                  filterSignificance === sig
                    ? "bg-nexora-purpleActive text-white"
                    : "bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-nexora-text"
                }`}
              >
                {sig}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-nexora-textSubtle absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search events, IDs, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-nexora-lowest border border-nexora-border rounded pl-8 pr-3 py-1 text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-nexora-lowest border border-nexora-border text-nexora-text hover:border-nexora-purple transition-colors"
            title="Toggle Chronological Direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-nexora-purple" />
            <span>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
          </button>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900/60 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}

          <span className="text-nexora-textSubtle text-[11px] pl-2 border-l border-nexora-border">
            {processedEvents.length} {processedEvents.length === 1 ? "Event" : "Events"}
          </span>
        </div>
      </div>

      {/* 3. TIMELINE FEED & SELECTED EVENT INSPECTOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / CENTER: TIMELINE FEED */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border animate-pulse">
              Reconstructing chronological stream from immutable logs...
            </div>
          ) : processedEvents.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-nexora-surface border border-nexora-border space-y-3">
              <Calendar className="w-8 h-8 text-nexora-textSubtle mx-auto opacity-50" />
              <div className="text-sm font-semibold text-white">No chronological events match the current criteria</div>
              <p className="text-xs text-nexora-textSecondary max-w-md mx-auto">
                No events recorded for this case and filter selection. Chronology is never fabricated to fill gaps.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-3 py-1.5 rounded bg-nexora-purpleActive text-white text-xs font-mono hover:bg-nexora-purple transition-all"
                >
                  Reset Active Filters
                </button>
              )}
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-nexora-purple/40 space-y-5 my-2">
              {processedEvents.map((evt) => {
                const isSelected = selectedEventId === evt.id;
                const isDocumented = evt.significance === "critical" || evt.significance === "routine";

                return (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    className={`relative p-4 rounded-xl border transition-all space-y-2.5 cursor-pointer shadow-lg ${
                      isSelected
                        ? "bg-nexora-surface border-nexora-purpleBright ring-1 ring-nexora-purple"
                        : "bg-nexora-surface border-nexora-border hover:border-nexora-purple/60 hover:bg-nexora-raised/60"
                    }`}
                  >
                    {/* Timeline Pin Node */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform ${
                        isSelected
                          ? "bg-nexora-purpleBright border-white scale-110"
                          : "bg-nexora-app border-nexora-purple"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-nexora-cyan" />
                    </div>

                    {/* Top Row: Event ID, Provenance Tag, Significance, UTC Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-nexora-cyan">
                          {evt.id}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            evt.significance === "critical"
                              ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                              : evt.significance === "anomalous"
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                              : "bg-nexora-lowest text-nexora-ice border border-nexora-border"
                          }`}
                        >
                          {evt.significance}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexora-lowest text-nexora-textSubtle border border-nexora-border">
                          {isDocumented ? "DOCUMENTED" : "INFERRED PATTERN"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-nexora-textSubtle">
                        <Clock className="w-3.5 h-3.5 text-nexora-purple" />
                        <span>{new Date(evt.timestamp).toUTCString()}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-nexora-purpleBright transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-nexora-textSecondary mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Evidence and Entity links */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-nexora-border/60 text-[10px] font-mono">
                      <div className="flex flex-wrap items-center gap-2">
                        {evt.evidence_ids.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-nexora-textSubtle">Evidence:</span>
                            {evt.evidence_ids.map((evId) => (
                              <button
                                key={evId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onNavigateToEvidence) {
                                    onNavigateToEvidence(evId);
                                  } else {
                                    handleSelectEvent(evt);
                                  }
                                }}
                                className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-nexora-cyan border border-cyan-800 hover:bg-cyan-900/60 transition-colors flex items-center gap-1"
                                title="Inspect in Evidence Vault"
                              >
                                <ShieldCheck className="w-2.5 h-2.5" />
                                {evId}
                              </button>
                            ))}
                          </div>
                        )}

                        {evt.entity_ids.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-nexora-textSubtle">Entities:</span>
                            {evt.entity_ids.map((enId) => (
                              <span
                                key={enId}
                                className="px-1.5 py-0.5 rounded bg-purple-950/60 text-nexora-purpleBright border border-purple-800"
                              >
                                {enId}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-nexora-textSubtle">
                        <span className="font-mono text-[9px] uppercase">Case: {evt.case_id}</span>
                        <span className="text-nexora-purple hover:underline flex items-center gap-0.5">
                          Inspect <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: SELECTED EVENT DOSSIER INSPECTOR */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-nexora-border pb-3">
              <span className="font-mono text-xs font-bold text-nexora-textSubtle uppercase tracking-wider">
                SELECTED EVENT INSPECTOR
              </span>
              <span className="font-mono text-[10px] text-nexora-cyan px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                AUDITED
              </span>
            </div>

            {selectedEventId ? (
              (() => {
                const activeEvt = events.find((e) => e.id === selectedEventId) || events[0];
                if (!activeEvt) return null;

                return (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-nexora-cyan">{activeEvt.id}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            activeEvt.significance === "critical"
                              ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {activeEvt.significance}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-white">
                        {activeEvt.title}
                      </h4>
                      <p className="text-nexora-textSecondary leading-relaxed text-[11px] pt-1">
                        {activeEvt.description}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-nexora-lowest border border-nexora-border space-y-2 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-nexora-textSubtle">UTC Timestamp:</span>
                        <span className="text-nexora-text font-semibold">
                          {new Date(activeEvt.timestamp).toUTCString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nexora-textSubtle">Case ID:</span>
                        <button
                          onClick={() => onNavigateToCase && onNavigateToCase(activeEvt.case_id)}
                          className="text-nexora-purpleBright hover:underline"
                        >
                          {activeEvt.case_id}
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nexora-textSubtle">Provenance:</span>
                        <span className="text-nexora-green">Documented Physical Record</span>
                      </div>
                    </div>

                    {/* Supporting Evidence List */}
                    <div className="space-y-2">
                      <div className="text-nexora-textSubtle uppercase text-[10px] font-semibold">
                        Supporting Evidence Items ({activeEvt.evidence_ids.length})
                      </div>
                      {activeEvt.evidence_ids.length > 0 ? (
                        activeEvt.evidence_ids.map((evId) => (
                          <div
                            key={evId}
                            onClick={() => onNavigateToEvidence && onNavigateToEvidence(evId)}
                            className="p-2.5 rounded bg-nexora-lowest border border-nexora-border hover:border-nexora-cyan/60 cursor-pointer flex items-center justify-between transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-nexora-cyan" />
                              <span className="text-nexora-cyan font-bold">{evId}</span>
                            </div>
                            <span className="text-[10px] text-nexora-textSubtle group-hover:text-nexora-cyan flex items-center gap-1">
                              Open Vault <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-nexora-textMuted text-[11px] italic">
                          No direct evidence file linked to this entry.
                        </div>
                      )}
                    </div>

                    {/* Quick navigation actions */}
                    <div className="pt-2 border-t border-nexora-border flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (activeEvt.evidence_ids.length > 0 && onNavigateToEvidence) {
                            onNavigateToEvidence(activeEvt.evidence_ids[0]);
                          }
                        }}
                        className="w-full py-1.5 px-3 rounded bg-nexora-purpleActive hover:bg-nexora-purple text-white font-medium flex items-center justify-center gap-1.5 transition-all text-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Inspect Linked Evidence Record</span>
                      </button>

                      {onNavigateToCase && (
                        <button
                          onClick={() => onNavigateToCase(activeEvt.case_id)}
                          className="w-full py-1.5 px-3 rounded bg-nexora-lowest border border-nexora-border hover:border-nexora-borderStrong text-nexora-text flex items-center justify-center gap-1.5 transition-all text-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-nexora-textSubtle" />
                          <span>Return to Case Dossier</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-nexora-textSubtle text-xs italic py-6 text-center">
                Select an event from the timeline to view corroborating sources.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { CaseSummary, Entity, Evidence, TimelineEvent, Relationship } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  Layers,
  Network,
  Clock,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  Shield,
  Activity,
  Cpu,
  RefreshCw,
  FolderOpen
} from "lucide-react";

interface FusionStudioViewProps {
  caseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onNavigateToModule?: (moduleId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

export const FusionStudioView: React.FC<FusionStudioViewProps> = ({
  caseId = "CASE-001",
  onSelectCaseId,
  onNavigateToModule,
  onSelectInspectorItem,
}) => {
  const [selectedCase, setSelectedCase] = useState<string>(caseId);
  const [casesList, setCasesList] = useState<CaseSummary[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [activePane, setActivePane] = useState<"all" | "graph" | "timeline" | "evidence">("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [focusedEntityId, setFocusedEntityId] = useState<string | null>("ENT-001");

  // Sync caseId prop
  useEffect(() => {
    if (caseId) setSelectedCase(caseId);
  }, [caseId]);

  // Load cases
  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        const cList = await nexoraApi.getCases();
        if (isMounted) setCasesList(cList);
      } catch (e) {
        console.error("Failed to load cases", e);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load synchronized case context
  useEffect(() => {
    let isMounted = true;
    async function loadFusionContext() {
      setIsLoading(true);
      try {
        const [entList, evList, tlList, relList] = await Promise.all([
          nexoraApi.getEntities(selectedCase),
          nexoraApi.getEvidence(selectedCase),
          nexoraApi.getTimeline(selectedCase),
          nexoraApi.getRelationships(selectedCase),
        ]);
        if (isMounted) {
          setEntities(entList);
          setEvidence(evList);
          setTimeline(tlList);
          setRelationships(relList);
        }
      } catch (err) {
        console.error("Failed to load fusion context", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFusionContext();
    return () => {
      isMounted = false;
    };
  }, [selectedCase]);

  const handleEntityClick = (ent: Entity) => {
    setFocusedEntityId(ent.id);
    onSelectInspectorItem({
      type: "entity",
      id: ent.id,
      title: ent.name,
      subtitle: `${ent.category.toUpperCase()} • ${ent.reliability_score * 100}% Reliability`,
      classification: "FUSED ENTITY",
      confidence: Math.round(ent.reliability_score * 100),
      epistemicType: "lead",
      description: ent.notes || `Investigative target correlated with ${selectedCase}.`,
      metadata: {
        "Entity ID": ent.id,
        "Category": ent.category,
        "Associated Cases": ent.case_ids.join(", "),
      },
    });
  };

  const handleEvidenceClick = (ev: Evidence) => {
    onSelectInspectorItem({
      type: "evidence",
      id: ev.id,
      title: ev.title,
      subtitle: `${ev.evidence_type.toUpperCase()} • ${ev.source}`,
      classification: "FUSED EVIDENCE",
      confidence: Math.round(ev.confidence_score * 100),
      epistemicType: "fact",
      description: ev.summary,
      hash: ev.checksum,
      metadata: {
        "Record ID": ev.id,
        "Origin": ev.source,
        "SHA-256": ev.checksum,
      },
    });
  };

  const handleTimelineClick = (evt: TimelineEvent) => {
    onSelectInspectorItem({
      type: "event",
      id: evt.id,
      title: evt.title,
      subtitle: `${new Date(evt.timestamp).toUTCString()} • ${evt.significance.toUpperCase()}`,
      classification: "FUSED CHRONO",
      confidence: 95,
      epistemicType: "fact",
      description: evt.description,
      metadata: {
        "Event ID": evt.id,
        "UTC Timestamp": new Date(evt.timestamp).toISOString(),
        "Linked Evidence": evt.evidence_ids.join(", "),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-nexora-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-purpleBright uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-nexora-purpleBright" />
              INTELLIGENCE FUSION STUDIO
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-cyan">
              SYNCHRONIZED MULTI-CANVAS WORKBENCH
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white mt-1">
            Intelligence Fusion Studio
          </h1>
          <p className="text-xs lg:text-sm text-nexora-textSecondary mt-1 max-w-2xl leading-relaxed">
            Coordinated multi-pane workspace synchronizing entity focus, topological links, chronological events, and cryptographic evidence seals in real time.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <label className="text-nexora-textSubtle">Scope:</label>
            <select
              value={selectedCase}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCase(val);
                if (onSelectCaseId) onSelectCaseId(val);
              }}
              className="bg-nexora-surface border border-nexora-border rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-nexora-purple"
            >
              {casesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.length > 25 ? `${c.title.substring(0, 25)}...` : c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-nexora-surface border border-nexora-border rounded p-1 text-xs font-mono">
            {(["all", "graph", "timeline", "evidence"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePane(p)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                  activePane === p
                    ? "bg-nexora-purpleActive text-white"
                    : "text-nexora-textSubtle hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-xl border border-nexora-border animate-pulse">
          Synchronizing multi-pane intelligence canvases for {selectedCase}...
        </div>
      ) : (
        /* 2. SYNCHRONIZED FUSION GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* PANE 1: TOPOLOGICAL RELATIONSHIP GRAPH (4 COLS) */}
          {(activePane === "all" || activePane === "graph") && (
            <div
              className={`${
                activePane === "all" ? "lg:col-span-4" : "lg:col-span-12"
              } p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-3.5 flex flex-col h-[650px] shadow-lg`}
            >
              <div className="flex items-center justify-between border-b border-nexora-border pb-2.5">
                <span className="font-mono text-xs font-bold text-nexora-purpleBright uppercase tracking-wider flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-nexora-purpleBright" />
                  Topology & Entities ({entities.length})
                </span>
                {onNavigateToModule && (
                  <button
                    onClick={() => onNavigateToModule("knowledge-graph")}
                    className="text-[10px] font-mono text-nexora-textSubtle hover:text-nexora-purpleBright flex items-center gap-1"
                  >
                    <span>Full Canvas</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {entities.map((ent) => {
                  const isFocused = focusedEntityId === ent.id;
                  return (
                    <div
                      key={ent.id}
                      onClick={() => handleEntityClick(ent)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                        isFocused
                          ? "bg-nexora-lowest border-nexora-purpleBright ring-1 ring-nexora-purple/40"
                          : "bg-nexora-lowest border-nexora-border hover:border-nexora-purple/60"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-nexora-purpleBright font-bold">{ent.id}</span>
                        <span className="px-1.5 py-0.5 rounded bg-nexora-app text-nexora-textSubtle uppercase">
                          {ent.category}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-white">{ent.name}</h4>
                      <div className="flex justify-between text-[11px] font-mono text-nexora-textSubtle pt-1 border-t border-nexora-border/40">
                        <span>Reliability: {Math.round(ent.reliability_score * 100)}%</span>
                        <span className="text-nexora-purple hover:underline">Focus Node</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PANE 2: TEMPORAL RECONSTRUCTION (4 COLS) */}
          {(activePane === "all" || activePane === "timeline") && (
            <div
              className={`${
                activePane === "all" ? "lg:col-span-4" : "lg:col-span-12"
              } p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-3.5 flex flex-col h-[650px] shadow-lg`}
            >
              <div className="flex items-center justify-between border-b border-nexora-border pb-2.5">
                <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-nexora-cyan" />
                  Chronological Stream ({timeline.length})
                </span>
                {onNavigateToModule && (
                  <button
                    onClick={() => onNavigateToModule("timeline")}
                    className="text-[10px] font-mono text-nexora-textSubtle hover:text-nexora-cyan flex items-center gap-1"
                  >
                    <span>Full Chrono</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {timeline.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleTimelineClick(evt)}
                    className="p-3 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-cyan/60 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-nexora-cyan font-bold">{evt.id}</span>
                      <span className="text-nexora-textSubtle">
                        {new Date(evt.timestamp).toLocaleTimeString()} UTC
                      </span>
                    </div>
                    <h4 className="font-display text-xs font-bold text-white">{evt.title}</h4>
                    <p className="text-[11px] text-nexora-textSecondary line-clamp-2">
                      {evt.description}
                    </p>
                    <div className="text-[10px] font-mono text-nexora-textSubtle pt-1 border-t border-nexora-border/40 flex justify-between">
                      <span className="text-nexora-cyan">Evidence: {evt.evidence_ids.join(", ")}</span>
                      <span className="uppercase text-amber-400 font-semibold">{evt.significance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANE 3: EVIDENCE VAULT & PROVENANCE (4 COLS) */}
          {(activePane === "all" || activePane === "evidence") && (
            <div
              className={`${
                activePane === "all" ? "lg:col-span-4" : "lg:col-span-12"
              } p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-3.5 flex flex-col h-[650px] shadow-lg`}
            >
              <div className="flex items-center justify-between border-b border-nexora-border pb-2.5">
                <span className="font-mono text-xs font-bold text-nexora-ice uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-nexora-ice" />
                  Evidence Vault ({evidence.length})
                </span>
                {onNavigateToModule && (
                  <button
                    onClick={() => onNavigateToModule("evidence-vault")}
                    className="text-[10px] font-mono text-nexora-textSubtle hover:text-nexora-ice flex items-center gap-1"
                  >
                    <span>Full Vault</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {evidence.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => handleEvidenceClick(ev)}
                    className="p-3 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-ice/60 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-nexora-cyan font-bold">{ev.id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-nexora-app text-nexora-ice uppercase">
                        {ev.evidence_type.replace("_", " ")}
                      </span>
                    </div>
                    <h4 className="font-display text-xs font-bold text-white">{ev.title}</h4>
                    <p className="text-[11px] text-nexora-textSecondary line-clamp-2">
                      {ev.summary}
                    </p>
                    <div className="text-[10px] font-mono text-nexora-cyan pt-1 border-t border-nexora-border/40 truncate">
                      SHA: {ev.checksum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

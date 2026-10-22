"use client";

import React from "react";
import {
  X,
  Shield,
  FileText,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  AlertTriangle,
  Network,
  MapPin,
} from "lucide-react";

export interface InspectorItem {
  type: "entity" | "case" | "evidence" | "event" | "hypothesis" | "relationship";
  id: string;
  title: string;
  subtitle?: string;
  classification?: string;
  confidence?: number;
  epistemicType?: "fact" | "lead" | "result";
  description: string;
  metadata?: Record<string, string>;
  hash?: string;
  linkedEvidence?: { id: string; title: string; hash?: string }[];
  linkedEntities?: { id: string; name: string; role?: string }[];
  unverifiedAssumptions?: string[];
  openQuestions?: string[];
  onAction?: (action: string) => void;
}

interface ContextInspectorProps {
  item: InspectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClearSelection: () => void;
  onNavigateToModule?: (moduleId: string) => void;
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({
  item,
  isOpen,
  onClose,
  onClearSelection,
  onNavigateToModule,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className="w-80 lg:w-96 border-l border-nexora-border bg-nexora-sidebar/95 backdrop-blur-md flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 right-0 z-10 shrink-0 select-none overflow-hidden"
      aria-label="Context Inspector"
    >
      {/* Inspector Header */}
      <div className="h-12 border-b border-nexora-border flex items-center justify-between px-4 bg-nexora-lowest/80">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-nexora-purple" />
          <span className="font-mono text-xs font-semibold uppercase text-nexora-textSecondary tracking-wider">
            {item ? `${item.type.toUpperCase()} INSPECTOR` : "CONTEXT INSPECTOR"}
          </span>
          {item && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexora-raised border border-nexora-border text-nexora-purpleBright">
              {item.id}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {item && (
            <button
              onClick={onClearSelection}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-nexora-textSubtle hover:text-nexora-text hover:bg-nexora-raised transition-colors"
              title="Clear active selection"
            >
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-nexora-textMuted hover:text-nexora-text hover:bg-nexora-raised transition-colors"
            title="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!item ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-nexora-raised border border-nexora-border flex items-center justify-center text-nexora-textSubtle">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h4 className="font-display text-sm font-semibold text-nexora-text">No selection</h4>
            <p className="text-xs text-nexora-textMuted max-w-xs leading-relaxed">
              Select a case, entity, graph node, event, or evidence item in the workspace to inspect its details and provenance.
            </p>
          </div>
        ) : (
          /* Populated Inspector */
          <div className="space-y-4">
            {/* Title & Classification */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-nexora-text leading-tight">
                  {item.title}
                </h3>
              </div>
              {item.subtitle && (
                <p className="text-xs text-nexora-textMuted">{item.subtitle}</p>
              )}

              {/* Epistemic Grade Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {item.epistemicType === "fact" && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 font-mono text-[10px] text-nexora-cyan uppercase font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Documented Fact
                  </span>
                )}
                {item.epistemicType === "lead" && (
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 font-mono text-[10px] text-nexora-amber uppercase font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> AI Investigative Lead
                  </span>
                )}
                {item.confidence && (
                  <span className="px-2 py-0.5 rounded bg-nexora-raised border border-nexora-border font-mono text-[10px] text-nexora-purpleBright">
                    CONF: {item.confidence}%
                  </span>
                )}
                {item.classification && (
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                    {item.classification}
                  </span>
                )}
              </div>
            </div>

            {/* Governance Warning for AI Leads */}
            {item.epistemicType === "lead" && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Empirical Verification Required</span>
                </div>
                <p className="text-[10px] text-amber-200/80">
                  AI-suggested correlation. Model outputs are never auto-committed as documented facts without human analyst sign-off.
                </p>
              </div>
            )}

            {/* Description */}
            <div className="p-3 rounded-lg bg-nexora-panel border border-nexora-border space-y-1">
              <span className="font-mono text-[10px] text-nexora-textSubtle uppercase tracking-wider">
                Investigative Briefing
              </span>
              <p className="text-xs text-nexora-textSecondary leading-relaxed">{item.description}</p>
            </div>

            {/* Cryptographic Hash */}
            {item.hash && (
              <div className="p-2.5 rounded-lg bg-nexora-panel border border-nexora-border space-y-1">
                <span className="font-mono text-[10px] text-nexora-textSubtle uppercase tracking-wider">
                  SHA-256 Provenance Seal
                </span>
                <p className="font-mono text-[10px] text-nexora-cyan break-all select-all bg-nexora-lowest p-1.5 rounded border border-nexora-border">
                  {item.hash}
                </p>
              </div>
            )}

            {/* Metadata KV */}
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-nexora-textSubtle uppercase tracking-wider">
                  Attributes & Telemetry
                </span>
                <div className="rounded-lg bg-nexora-panel border border-nexora-border divide-y divide-nexora-border text-xs">
                  {Object.entries(item.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between px-3 py-1.5 font-mono text-[11px]">
                      <span className="text-nexora-textMuted">{key}</span>
                      <span className="text-nexora-text font-medium text-right truncate max-w-[180px]">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Evidence */}
            {item.linkedEvidence && item.linkedEvidence.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-nexora-textSubtle uppercase tracking-wider">
                  Linked Evidence Artifacts ({item.linkedEvidence.length})
                </span>
                <div className="space-y-1">
                  {item.linkedEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2 rounded bg-nexora-panel border border-nexora-border flex items-center justify-between text-xs hover:border-nexora-cyan/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-nexora-cyan shrink-0" />
                        <span className="font-mono text-nexora-cyan text-[11px] font-semibold">{ev.id}</span>
                        <span className="truncate text-nexora-text text-[11px]">{ev.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-nexora-textMuted shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unverified Assumptions & Open Leads */}
            {item.unverifiedAssumptions && item.unverifiedAssumptions.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-nexora-amber uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Unverified Assumptions ({item.unverifiedAssumptions.length})
                </span>
                <ul className="space-y-1 text-[11px] text-nexora-textSecondary list-disc list-inside bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-lg">
                  {item.unverifiedAssumptions.map((assump, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {assump}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-2 space-y-2">
              <span className="font-mono text-[10px] text-nexora-textSubtle uppercase tracking-wider">
                Investigative Actions
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onNavigateToModule && onNavigateToModule("knowledge-graph")}
                  className="py-1.5 px-2 rounded bg-nexora-raised border border-nexora-border hover:bg-nexora-surface text-nexora-text font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-nexora-purple" />
                  <span>Trace In Graph</span>
                </button>
                <button
                  onClick={() => onNavigateToModule && onNavigateToModule("map")}
                  className="py-1.5 px-2 rounded bg-nexora-raised border border-nexora-border hover:bg-nexora-surface text-nexora-text font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-nexora-cyan" />
                  <span>View On Map</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

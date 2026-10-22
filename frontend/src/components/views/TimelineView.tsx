"use client";

import React, { useState, useEffect } from "react";
import { TimelineEvent } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import { Clock, Filter, AlertTriangle, ShieldCheck, Calendar, ArrowRight } from "lucide-react";

interface TimelineViewProps {
  caseId?: string;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  caseId = "CASE-001",
  onSelectInspectorItem,
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTimeline() {
      setIsLoading(true);
      try {
        const data = await nexoraApi.getTimeline(caseId);
        if (isMounted) setEvents(data);
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
  }, [caseId]);

  const filteredEvents = events.filter((e) => {
    if (filter === "all") return true;
    return e.significance === filter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexora-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              CHRONO RECONSTRUCTION FEED
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              CASE: {caseId}
            </span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white mt-1">
            Timeline Reconstruction
          </h1>
          <p className="text-xs text-nexora-textSecondary mt-0.5">
            Microsecond-ordered multi-source chronological log correlating physical telemetry, access logs, and RF bursts.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {["all", "critical", "anomalous", "routine"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                filter === f
                  ? "bg-nexora-purpleActive text-white"
                  : "bg-nexora-surface border border-nexora-border text-nexora-textSubtle hover:text-nexora-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border animate-pulse">
          Loading chronological event log...
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-nexora-purple/40 space-y-6 my-4 max-w-4xl">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                onSelectInspectorItem({
                  type: "event",
                  id: evt.id,
                  title: evt.title,
                  subtitle: `${new Date(evt.timestamp).toUTCString()} • ${evt.significance.toUpperCase()}`,
                  classification: "CHRONO LOG",
                  confidence: 96,
                  epistemicType: "fact",
                  description: evt.description,
                  metadata: {
                    "Event ID": evt.id,
                    "UTC Timestamp": new Date(evt.timestamp).toISOString(),
                    "Significance": evt.significance.toUpperCase(),
                    "Linked Evidence": evt.evidence_ids.join(", "),
                    "Linked Entities": evt.entity_ids.join(", "),
                  },
                });
              }}
              className="relative p-4 rounded-xl bg-nexora-surface border border-nexora-border hover:border-nexora-purple/60 cursor-pointer transition-all space-y-2 group hover:bg-nexora-raised/60 shadow-lg"
            >
              {/* Timeline pin */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full bg-nexora-app border-2 border-nexora-purple flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-nexora-cyan" />
              </div>

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
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-nexora-textSubtle">
                  <Clock className="w-3.5 h-3.5 text-nexora-purple" />
                  <span>{new Date(evt.timestamp).toUTCString()}</span>
                </div>
              </div>

              <h3 className="font-display text-sm font-bold text-white group-hover:text-nexora-purpleBright transition-colors">
                {evt.title}
              </h3>
              <p className="text-xs text-nexora-textMuted leading-relaxed">
                {evt.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-nexora-border/60 text-[10px] font-mono text-nexora-textSubtle">
                <span className="flex items-center gap-1 text-nexora-cyan">
                  <ShieldCheck className="w-3 h-3" />
                  Evidence: {evt.evidence_ids.join(", ")}
                </span>
                <span className="text-nexora-purple">
                  Entities: {evt.entity_ids.join(", ")}
                </span>
                <span className="ml-auto text-nexora-textMuted group-hover:text-nexora-purple transition-colors flex items-center gap-1">
                  Inspect in panel <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

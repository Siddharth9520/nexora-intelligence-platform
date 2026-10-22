import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, Compass, UserCheck } from "lucide-react";

export const CorePrinciplesCard: React.FC = () => {
  return (
    <Card className="border-nexora-border/80">
      <CardHeader>
        <CardTitle className="text-slate-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          NEXORA Analytical Foundations
        </CardTitle>
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          Axiomatic Framework
        </span>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs tracking-wider uppercase font-mono">
            <span className="w-5 h-5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px]">
              01
            </span>
            Source of Truth
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Evidence is the single source of truth.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All relationships, timelines, and analytical deductions must anchor directly to verified physical, digital, or testimonial artifacts with cryptographic checksums.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs tracking-wider uppercase font-mono">
            <span className="w-5 h-5 rounded bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center text-[10px]">
              02
            </span>
            Investigative Leads
          </div>
          <p className="text-xs text-slate-300 font-medium">
            AI generates leads, not factual verdicts.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Local Gemma 4 E4B surfaces hypotheses, discovers multi-hop links, and spots contradictions. It is mathematically forbidden from inventing evidence or asserting guilt.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase font-mono">
            <span className="w-5 h-5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px]">
              03
            </span>
            Human Sovereignty
          </div>
          <p className="text-xs text-slate-300 font-medium">
            The analyst makes the final decision.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Intelligence products require human corroboration and peer audit. NEXORA provides explainable confidence scoring, not opaque black-box verdicts.
          </p>
        </div>
      </div>
    </Card>
  );
};

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  FolderSearch,
  Network,
  MapPin,
  Fingerprint,
  Clock,
  ShieldCheck,
  Bot,
  Scale,
  Layers,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface ModuleDef {
  phase: string;
  name: string;
  status: "active" | "planned";
  readiness: string;
  summary: string;
  icon: React.ElementType;
}

const MODULE_REGISTRY: ModuleDef[] = [
  {
    phase: "Phase 1",
    name: "Command Center",
    status: "active",
    readiness: "Operational",
    summary: "Foundational workspace, live API diagnostic probe, centralized config, and canonical data store.",
    icon: LayoutDashboard,
  },
  {
    phase: "Phase 2",
    name: "Case Explorer",
    status: "planned",
    readiness: "Schema Ready",
    summary: "Dossier search, structured case rosters, multi-jurisdiction tagging, and incident aggregation.",
    icon: FolderSearch,
  },
  {
    phase: "Phase 3",
    name: "Knowledge Graph",
    status: "planned",
    readiness: "Contract Defined",
    summary: "Cytoscape/D3 interactive link analysis, centrality calculation, and multi-hop neighbor expansion.",
    icon: Network,
  },
  {
    phase: "Phase 4",
    name: "Geospatial Heatmaps",
    status: "planned",
    readiness: "Coordinates Prepared",
    summary: "MapLibre spatial cluster analysis, incident-density heatmaps, and bounding-box spatial filtering.",
    icon: MapPin,
  },
  {
    phase: "Phase 5",
    name: "Modus Operandi",
    status: "planned",
    readiness: "Taxonomy Structured",
    summary: "Explainable tactical feature vectors, weighted pattern similarity matrix, and signature matching.",
    icon: Fingerprint,
  },
  {
    phase: "Phase 6",
    name: "Temporal Reconstruction",
    status: "planned",
    readiness: "Timestamps Anchored",
    summary: "Multi-stream event interval sequencing, timeline anomaly detection, and playback coordination.",
    icon: Clock,
  },
  {
    phase: "Phase 7",
    name: "Evidence Vault",
    status: "planned",
    readiness: "SHA-256 Enforced",
    summary: "Immutable chain of custody tracking, cryptographic seals, and faceted document analysis.",
    icon: ShieldCheck,
  },
  {
    phase: "Phase 8",
    name: "Intelligence Copilot",
    status: "planned",
    readiness: "Ollama Gemma 4 Stub",
    summary: "Offline Gemma 4 E4B assistive reasoning drawer with compulsory evidence citation checking.",
    icon: Bot,
  },
  {
    phase: "Phase 9",
    name: "Competing Hypotheses",
    status: "planned",
    readiness: "ACH Matrix Modelled",
    summary: "Analysis of Competing Hypotheses (ACH) matrix mitigating cognitive and confirmation biases.",
    icon: Scale,
  },
  {
    phase: "Phase 10",
    name: "Fusion Studio",
    status: "planned",
    readiness: "Docking Specified",
    summary: "Synchronized multi-pane workspace locking entity focus across graph, map, timeline, and copilot.",
    icon: Layers,
  },
  {
    phase: "Phase 11",
    name: "Report Generation",
    status: "planned",
    readiness: "Format Structured",
    summary: "Audit-ready intelligence briefing generator with interactive footnotes to primary evidence.",
    icon: FileText,
  },
  {
    phase: "Phase 12",
    name: "Audit & Data Quality",
    status: "planned",
    readiness: "Integrity Runner Active",
    summary: "Continuous graph cycle detection, referential consistency audits, and forensic activity logging.",
    icon: CheckCircle2,
  },
];

export const ModuleStatusGrid: React.FC = () => {
  return (
    <Card className="border-nexora-border">
      <CardHeader>
        <CardTitle className="text-slate-200">
          <Layers className="w-4 h-4 text-cyan-400" />
          12-Module Architectural Blueprint & Phased Roadmap
        </CardTitle>
        <span className="text-[10px] font-mono text-slate-500">
          Strict Separation of Concerns
        </span>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {MODULE_REGISTRY.map((mod) => {
          const Icon = mod.icon;
          const isActive = mod.status === "active";

          return (
            <div
              key={mod.name}
              className={`p-3.5 rounded border transition-all duration-150 ${
                isActive
                  ? "bg-slate-900/90 border-cyan-800/80 shadow-[0_0_12px_rgba(0,229,255,0.06)]"
                  : "bg-slate-950/40 border-slate-800/60 opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isActive
                        ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-slate-200">
                    {mod.name}
                  </span>
                </div>

                <Badge
                  variant={isActive ? "active" : "planned"}
                  className="text-[9px] py-0 px-1.5"
                >
                  {isActive ? "ACTIVE" : mod.phase}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                {mod.summary}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Readiness:</span>
                <span
                  className={
                    isActive ? "text-cyan-400 font-semibold" : "text-slate-400"
                  }
                >
                  {mod.readiness}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

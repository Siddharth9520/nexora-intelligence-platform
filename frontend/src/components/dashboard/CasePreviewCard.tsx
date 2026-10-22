"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Case, Evidence, Entity } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import {
  FolderOpen,
  FileCheck2,
  Users,
  Shield,
  Hash,
  Clock,
  Sparkles,
} from "lucide-react";

export const CasePreviewCard: React.FC = () => {
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [entityList, setEntityList] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCaseData() {
      try {
        setIsLoading(true);
        const [caseData, evidenceData, entityData] = await Promise.all([
          nexoraApi.getCase("CASE-001"),
          nexoraApi.getEvidenceForCase("CASE-001"),
          nexoraApi.getEntitiesForCase("CASE-001"),
        ]);
        if (isMounted) {
          setActiveCase(caseData);
          setEvidenceList(evidenceData);
          setEntityList(entityData);
          setFetchError(null);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(
            err instanceof Error ? err.message : "Failed to load canonical synthetic case"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card elevated className="border-nexora-border">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          Canonical Case Dossier • Live Store
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-[10px]">
            SYNTHETIC DATASET
          </Badge>
          <Badge variant="critical" className="font-mono text-[10px]">
            PRIORITY: CRITICAL
          </Badge>
        </div>
      </CardHeader>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500 font-mono animate-pulse">
          Querying canonical synthetic store (/api/v1/cases/CASE-001)...
        </div>
      ) : fetchError ? (
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-amber-400">Canonical Store Offline</p>
          <p className="text-[11px] text-slate-500">{fetchError}</p>
        </div>
      ) : activeCase ? (
        <div className="space-y-5">
          {/* Case Header Details */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {activeCase.id}
                </span>
                <span className="text-slate-500">•</span>
                <h4 className="font-bold text-slate-100 text-sm">
                  {activeCase.title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Lead: <strong className="text-slate-200">{activeCase.lead_analyst}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCase.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Two-Column Roster: Evidence & Entities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Evidence Roster */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  Verified Evidence ({evidenceList.length})
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  SHA-256 Verified
                </span>
              </div>

              <div className="space-y-2">
                {evidenceList.map((evd) => (
                  <div
                    key={evd.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/60 rounded text-xs space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                        {evd.id}
                      </span>
                      <Badge variant="info" className="text-[9px] py-0 px-1">
                        {evd.evidence_type}
                      </Badge>
                    </div>
                    <p className="text-slate-200 font-medium text-xs truncate">
                      {evd.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 truncate">
                      <Hash className="w-2.5 h-2.5 shrink-0 text-slate-600" />
                      <span className="truncate">{evd.checksum}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entities Roster */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Tracked Entities ({entityList.length})
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Canonical Graph Nodes
                </span>
              </div>

              <div className="space-y-2">
                {entityList.map((ent) => (
                  <div
                    key={ent.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/60 rounded text-xs space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-semibold text-[11px]">
                        {ent.id}
                      </span>
                      <Badge variant="warning" className="text-[9px] py-0 px-1">
                        {ent.category}
                      </Badge>
                    </div>
                    <p className="text-slate-200 font-medium text-xs truncate">
                      {ent.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Reliability: {(ent.reliability_score * 100).toFixed(0)}%</span>
                      {ent.aliases.length > 0 && (
                        <span>Alias: {ent.aliases[0]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

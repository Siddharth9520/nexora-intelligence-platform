"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HealthResponse } from "@/types/intelligence";
import { Activity, Server, Cpu, Database, CheckCircle, AlertTriangle } from "lucide-react";

interface HealthWidgetProps {
  health: HealthResponse | null;
  latencyMs: number | null;
  error: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  lastChecked: Date | null;
}

export const HealthStatusWidget: React.FC<HealthWidgetProps> = ({
  health,
  latencyMs,
  error,
  isLoading,
  onRefresh,
  lastChecked,
}) => {
  const isOnline = !!health && !error;

  return (
    <Card elevated className="border-cyan-900/40">
      <CardHeader>
        <CardTitle className="text-cyan-400">
          <Activity className="w-4 h-4 text-nexora-cyan" />
          Analytical Gateway & Health Probe
        </CardTitle>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="active" className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              REST API ONLINE
            </Badge>
          ) : (
            <Badge variant="critical">DISCONNECTED</Badge>
          )}
        </div>
      </CardHeader>

      <div className="space-y-4">
        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Latency */}
          <div className="p-3 bg-slate-950/60 border border-nexora-border/60 rounded">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3 h-3 text-cyan-400" />
              Latency
            </div>
            <div className="text-lg font-bold font-mono text-slate-100 mt-1">
              {latencyMs !== null ? `${latencyMs} ms` : "—"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Roundtrip HTTP</div>
          </div>

          {/* Backend Version */}
          <div className="p-3 bg-slate-950/60 border border-nexora-border/60 rounded">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3 h-3 text-sky-400" />
              Service Engine
            </div>
            <div className="text-lg font-bold font-mono text-slate-100 mt-1">
              {health ? `v${health.version}` : "v0.1.0"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">FastAPI & Pydantic v2</div>
          </div>

          {/* AI Subsystem */}
          <div className="p-3 bg-slate-950/60 border border-nexora-border/60 rounded">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-amber-400" />
              AI Subsystem
            </div>
            <div className="text-sm font-bold font-mono text-amber-300 mt-1 truncate">
              {health ? health.ai_provider.active_provider.toUpperCase() : "NONE"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {health?.ai_provider.status === "ready" ? "Operational" : "Offline / Standby"}
            </div>
          </div>

          {/* Canonical Data Status */}
          <div className="p-3 bg-slate-950/60 border border-nexora-border/60 rounded">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3 h-3 text-emerald-400" />
              Synthetic Store
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {health ? `${health.canonical_data.cases_count} Cases` : "—"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {health
                ? `${health.canonical_data.evidence_count} evidence records`
                : "Awaiting probe"}
            </div>
          </div>
        </div>

        {/* Status Details / Error message */}
        {error ? (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded text-xs text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Backend Unreachable</p>
              <p className="text-[11px] text-rose-400/90 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-900/50 border border-slate-800 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Backend active on <code className="text-slate-300 font-mono">http://127.0.0.1:8000/api/v1</code>
              </span>
            </div>
            {lastChecked && (
              <span className="text-[10px] text-slate-500 font-mono">
                Verified: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            isLoading={isLoading}
            className="text-xs"
          >
            Probe API Health Check
          </Button>
        </div>
      </div>
    </Card>
  );
};

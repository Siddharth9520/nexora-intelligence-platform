"use client";

import React from "react";
import { Search, RefreshCw, Cpu, Activity, Shield, Command } from "lucide-react";

interface HeaderProps {
  isLive: boolean;
  latencyMs: number | null;
  onRefresh: () => void;
  isChecking: boolean;
  version: string;
  activeCaseId?: string;
  onOpenCommandPalette?: () => void;
  breadcrumbs?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  isLive,
  latencyMs,
  onRefresh,
  isChecking,
  version,
  activeCaseId = "CASE-001",
  onOpenCommandPalette,
  breadcrumbs = ["Workspace", "Command Center"],
}) => {
  return (
    <header className="h-14 border-b border-nexora-border bg-nexora-app/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Left: Breadcrumbs & Active Case Context */}
      <div className="flex items-center gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-nexora-textMuted font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <span className="text-nexora-textSubtle">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? "text-nexora-text font-semibold" : ""}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {activeCaseId && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-nexora-raised border border-nexora-border text-[11px] font-mono text-nexora-purpleBright">
            <span className="w-1.5 h-1.5 rounded-full bg-nexora-purpleActive" />
            {activeCaseId}: Op Vanguard Horizon
          </span>
        )}
      </div>

      {/* Center: Global Command Search Trigger */}
      <div className="hidden md:flex items-center w-80 max-w-sm">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-nexora-sidebar border border-nexora-border text-xs text-nexora-textSubtle hover:text-nexora-text hover:border-nexora-purple/50 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-nexora-textMuted" />
            <span>Search entities, artifacts, cases...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-nexora-raised border border-nexora-border text-[10px] font-mono text-nexora-textMuted flex items-center gap-0.5">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Telemetry & Engine Readiness */}
      <div className="flex items-center gap-3 text-xs">
        {/* Backend Connectivity Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[11px] transition-colors ${
            isLive
              ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-300"
              : "bg-red-950/40 border-red-800/50 text-red-300"
          }`}
          title={isLive ? `Backend Online (FastAPI) - ${latencyMs}ms latency` : "Backend Disconnected"}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-nexora-green animate-pulse" : "bg-nexora-red"
            }`}
          />
          <span className="font-semibold">
            {isLive ? `ONLINE ${latencyMs !== null ? `(${latencyMs}ms)` : ""}` : "OFFLINE"}
          </span>
        </div>

        {/* Inference Provider Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-nexora-sidebar border border-nexora-border text-nexora-cyan font-mono text-[11px]">
          <Cpu className="w-3.5 h-3.5 text-nexora-cyan" />
          <span>Ollama Gemma 4 E4B [Ready]</span>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isChecking}
          title="Re-verify system health"
          className="p-1.5 rounded-md bg-nexora-raised border border-nexora-border hover:bg-nexora-surface text-nexora-textMuted hover:text-nexora-text transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-nexora-purple" : ""}`} />
        </button>
      </div>
    </header>
  );
};

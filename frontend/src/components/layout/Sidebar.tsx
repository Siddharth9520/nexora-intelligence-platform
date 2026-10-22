"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderSearch,
  Network,
  MapPin,
  ShieldCheck,
  Clock,
  Bot,
  Scale,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Plus,
} from "lucide-react";

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  badge?: string;
  status: "active" | "ready" | "planned";
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "ANALYZE",
    items: [
      { id: "command-center", name: "Command Center", icon: LayoutDashboard, status: "active" },
      { id: "cases", name: "Cases", icon: FolderSearch, status: "ready", badge: "1" },
      { id: "knowledge-graph", name: "Knowledge Graph", icon: Network, status: "ready" },
      { id: "map", name: "Map", icon: MapPin, status: "ready" },
    ],
  },
  {
    group: "EVIDENCE",
    items: [
      { id: "evidence-vault", name: "Evidence Vault", icon: ShieldCheck, status: "ready", badge: "SHA" },
      { id: "timeline", name: "Timeline", icon: Clock, status: "ready" },
    ],
  },
  {
    group: "REASON",
    items: [
      { id: "copilot", name: "AI Copilot", icon: Bot, status: "ready", badge: "LEAD" },
      { id: "hypotheses", name: "Hypotheses", icon: Scale, status: "ready", badge: "ACH" },
    ],
  },
  {
    group: "PREFERENCES",
    items: [
      { id: "settings", name: "Settings", icon: Settings, status: "ready" },
      { id: "help", name: "Help", icon: HelpCircle, status: "ready" },
    ],
  },
];

interface SidebarProps {
  activeModule?: string;
  onSelectModule?: (id: string) => void;
  onNewCase?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule = "command-center",
  onSelectModule,
  onNewCase,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [collapsedInternal, setCollapsedInternal] = useState(false);
  const collapsed = isCollapsed ?? collapsedInternal;
  const toggleCollapse = onToggleCollapse ?? (() => setCollapsedInternal(!collapsedInternal));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-nexora-sidebar border-r border-nexora-border transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-nexora-border flex items-center justify-between px-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Hexagonal Geometric Emblem */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexora-purple via-nexora-purpleActive to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-nexora-purple/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-display font-bold text-sm tracking-wider text-nexora-text leading-tight">
                NEXORA
              </span>
              <span className="font-mono text-[9px] text-nexora-cyan tracking-widest uppercase">
                FORENSIC SUITE v4.2
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded text-nexora-textMuted hover:text-nexora-text hover:bg-nexora-raised transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Ingest CTA */}
      {!collapsed ? (
        <div className="p-3">
          <button
            onClick={onNewCase}
            className="w-full py-2 px-3 rounded-md bg-nexora-purpleActive hover:bg-nexora-purple text-white text-xs font-medium flex items-center justify-center gap-2 shadow-md shadow-nexora-purple/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Ingest Artifact / Case</span>
          </button>
        </div>
      ) : (
        <div className="p-2 flex justify-center">
          <button
            onClick={onNewCase}
            title="Ingest Artifact / New Case"
            className="w-10 h-10 rounded-md bg-nexora-purpleActive hover:bg-nexora-purple text-white flex items-center justify-center shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <span className="px-2.5 font-mono text-[10px] font-semibold text-nexora-textSubtle tracking-wider uppercase">
                {group.group}
              </span>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule && onSelectModule(item.id)}
                    title={collapsed ? `${item.name} (${item.status})` : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all group relative ${
                      isActive
                        ? "bg-nexora-raised text-nexora-purpleBright border-l-2 border-nexora-purple shadow-sm"
                        : "text-nexora-textSecondary hover:text-nexora-text hover:bg-nexora-surface"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-nexora-purpleBright"
                          : "text-nexora-textMuted group-hover:text-nexora-text"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                          item.badge === "SHA"
                            ? "bg-cyan-950/80 border-cyan-800/60 text-nexora-cyan"
                            : item.badge === "LEAD"
                            ? "bg-amber-950/80 border-amber-800/60 text-nexora-amber"
                            : item.badge === "ACH"
                            ? "bg-purple-950/80 border-purple-800/60 text-nexora-purpleBright"
                            : "bg-slate-900 border-slate-700 text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {/* Collapsed Tooltip Indicator */}
                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-nexora-purpleBright" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Analyst Status & Footer */}
      <div className="border-t border-nexora-border p-2.5 bg-nexora-lowest">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-nexora-raised border border-nexora-border flex items-center justify-center shrink-0 text-nexora-cyan font-mono text-xs font-bold">
                KV
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-nexora-text truncate">
                  Agent K. Vance
                </span>
                <span className="font-mono text-[9px] text-nexora-cyan tracking-wider truncate">
                  SEC//IL-5 AUDITED
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-nexora-green animate-pulse" title="System Connected" />
          </div>
        ) : (
          <div className="flex justify-center" title="Agent K. Vance (SEC//IL-5)">
            <div className="w-7 h-7 rounded-full bg-nexora-raised border border-nexora-border flex items-center justify-center text-nexora-cyan font-mono text-xs font-bold">
              KV
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

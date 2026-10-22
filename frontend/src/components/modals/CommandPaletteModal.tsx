"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FolderSearch,
  Network,
  ShieldCheck,
  Clock,
  User,
  ArrowRight,
  Command,
  X,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  category: "Cases" | "Entities" | "Evidence" | "Timeline" | "Navigation";
  title: string;
  subtitle: string;
  badge?: string;
  targetModule: string;
  icon: React.ElementType;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Cases
  {
    id: "CASE-001",
    category: "Cases",
    title: "Operation Vanguard Horizon",
    subtitle: "Critical • Substation cyber-physical breach",
    badge: "CRITICAL",
    targetModule: "cases",
    icon: FolderSearch,
  },
  {
    id: "CASE-002",
    category: "Cases",
    title: "Operation Cobalt Sentinel",
    subtitle: "Pending allocation • Regional firmware anomalies",
    badge: "NEW",
    targetModule: "cases",
    icon: FolderSearch,
  },
  // Entities
  {
    id: "ENT-001",
    category: "Entities",
    title: "Alex Mercer",
    subtitle: "Person • Primary Suspect • Former Substation Contractor",
    badge: "CONF: 85%",
    targetModule: "knowledge-graph",
    icon: User,
  },
  {
    id: "ENT-002",
    category: "Entities",
    title: "AeroGrid Industrial Services",
    subtitle: "Organization • Regional Substation Operator",
    targetModule: "knowledge-graph",
    icon: Network,
  },
  {
    id: "ENT-003",
    category: "Entities",
    title: "Black Sky Logistics LLC",
    subtitle: "Organization • Suspected front contractor",
    targetModule: "knowledge-graph",
    icon: Network,
  },
  // Evidence
  {
    id: "EVD-001",
    category: "Evidence",
    title: "CCTV Gate 4 Entry Footage",
    subtitle: "Video • 2026-10-14 02:41:09 UTC • SHA: 7f83b165...9069",
    badge: "FACT",
    targetModule: "evidence-vault",
    icon: ShieldCheck,
  },
  {
    id: "EVD-002",
    category: "Evidence",
    title: "SCADA RTU-09 Memory Crash Dump",
    subtitle: "Log • 2026-10-14 02:47:33 UTC • SHA: cb244e8c...c8f8",
    badge: "FACT",
    targetModule: "evidence-vault",
    icon: ShieldCheck,
  },
  {
    id: "EVD-004",
    category: "Evidence",
    title: "RF Burst Transmission Spectrum Intercept",
    subtitle: "Signal IQ • 433.92 MHz SDR capture • SHA: e4a78129...5f1a",
    badge: "ANALYTICAL",
    targetModule: "evidence-vault",
    icon: ShieldCheck,
  },
  // Timeline
  {
    id: "EVT-004",
    category: "Timeline",
    title: "Substation Perimeter Gate Forced Access",
    subtitle: "Event • 2026-10-14 02:41:09 UTC • North Substation Gate 4",
    badge: "FACT",
    targetModule: "timeline",
    icon: Clock,
  },
  // Navigation
  {
    id: "NAV-GRAPH",
    category: "Navigation",
    title: "Open Knowledge Graph Canvas",
    subtitle: "Inspect relationship topologies and entity links",
    targetModule: "knowledge-graph",
    icon: Network,
  },
  {
    id: "NAV-MAP",
    category: "Navigation",
    title: "Open Geospatial Map Workspace",
    subtitle: "View sensor placements and waypoint perimeters",
    targetModule: "map",
    icon: Network,
  },
  {
    id: "NAV-ACH",
    category: "Navigation",
    title: "Open Hypothesis Matrix (ACH)",
    subtitle: "Evaluate competing hypotheses against evidence",
    targetModule: "hypotheses",
    icon: Network,
  },
];

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (targetModule: string, itemId?: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredResults = SEARCH_DATABASE.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        onSelectResult(selected.targetModule, selected.id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose, onSelectResult]);

  if (!isOpen) return null;

  // Group filtered items
  const grouped = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResultItem[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm select-none">
      <div
        className="w-full max-w-2xl rounded-xl bg-nexora-overlay border border-nexora-borderElevated shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="h-14 border-b border-nexora-border flex items-center px-4 gap-3 bg-nexora-lowest">
          <Search className="w-5 h-5 text-nexora-purple shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search cases, entities, evidence, events, or modules..."
            className="w-full bg-transparent text-sm text-nexora-text placeholder:text-nexora-textSubtle outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-nexora-textMuted hover:text-nexora-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-nexora-raised border border-nexora-border text-[10px] font-mono text-nexora-textMuted">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-nexora-border/40">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-nexora-textMuted space-y-1">
              <p className="font-semibold text-nexora-text">No matching records found</p>
              <p className="text-[11px] text-nexora-textSubtle">
                Try searching by entity ID (e.g. ENT-001), evidence hash, or case name.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="py-2 first:pt-0 last:pb-0">
                <span className="px-3 py-1 font-mono text-[10px] font-semibold text-nexora-textSubtle uppercase tracking-wider block">
                  {category}
                </span>
                <div className="space-y-0.5 mt-1">
                  {items.map((item) => {
                    const currentIndex = filteredResults.indexOf(item);
                    const isSelected = currentIndex === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult(item.targetModule, item.id);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-nexora-raised text-white border-l-2 border-nexora-purple"
                            : "text-nexora-textSecondary hover:bg-nexora-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-nexora-purple/20 text-nexora-purpleBright"
                                : "bg-nexora-lowest text-nexora-textMuted"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-nexora-text truncate">
                                {item.title}
                              </span>
                              <span className="font-mono text-[10px] text-nexora-cyan px-1 rounded bg-nexora-lowest border border-nexora-border">
                                {item.id}
                              </span>
                            </div>
                            <span className="text-[11px] text-nexora-textMuted truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.badge && (
                            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-nexora-lowest border border-nexora-border text-nexora-purpleBright font-semibold">
                              {item.badge}
                            </span>
                          )}
                          {isSelected && (
                            <ArrowRight className="w-3.5 h-3.5 text-nexora-purpleBright" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Palette Footer */}
        <div className="h-10 border-t border-nexora-border px-4 flex items-center justify-between bg-nexora-lowest text-[11px] text-nexora-textSubtle font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>IL-5 AUDITED DATASET</span>
        </div>
      </div>
    </div>
  );
};

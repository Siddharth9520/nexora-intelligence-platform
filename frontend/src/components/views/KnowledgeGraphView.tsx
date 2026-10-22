"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Entity, Relationship, CaseSummary } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  Network,
  Shield,
  Layers,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Info,
  User,
  Building2,
  Truck,
  Database,
  Radio,
  Search,
  Filter,
  ArrowLeft,
  Share2,
  Maximize2,
  X,
  ExternalLink,
} from "lucide-react";

interface KnowledgeGraphViewProps {
  caseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onReturnToCase?: (caseId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

interface NodePosition {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  entity: Entity;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  caseId = "CASE-001",
  onSelectCaseId,
  onReturnToCase,
  onSelectInspectorItem,
}) => {
  const [activeCaseFilter, setActiveCaseFilter] = useState<string>(caseId);
  const [availableCases, setAvailableCases] = useState<CaseSummary[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("ENT-001");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync external caseId
  useEffect(() => {
    if (caseId && caseId !== activeCaseFilter) {
      setActiveCaseFilter(caseId);
    }
  }, [caseId]);

  // Load available cases for dropdown
  useEffect(() => {
    let isMounted = true;
    async function fetchCases() {
      try {
        const data = await nexoraApi.getCases();
        if (isMounted) setAvailableCases(data);
      } catch (err) {
        console.error("Failed to load cases list", err);
      }
    }
    fetchCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load entities and relationships for active case filter
  useEffect(() => {
    let isMounted = true;
    async function loadGraphData() {
      setIsLoading(true);
      try {
        const filterParam = activeCaseFilter === "all" ? undefined : activeCaseFilter;
        const [ents, rels] = await Promise.all([
          nexoraApi.getEntities(filterParam),
          nexoraApi.getRelationships(filterParam),
        ]);
        if (isMounted) {
          setEntities(ents);
          setRelationships(rels);
          if (ents.length > 0) {
            // Keep current selection if valid, else pick first
            if (!selectedNodeId || !ents.some((e) => e.id === selectedNodeId)) {
              setSelectedNodeId(ents[0].id);
            }
          } else {
            setSelectedNodeId(null);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load graph data");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGraphData();
    return () => {
      isMounted = false;
    };
  }, [activeCaseFilter]);

  // Compute deterministic coordinates
  const nodes: NodePosition[] = useMemo(() => {
    if (entities.length === 0) return [];
    const width = 860;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 80;

    return entities.map((ent, idx) => {
      // Deterministic focal placements
      if (ent.id === "ENT-001") {
        return {
          id: ent.id,
          label: ent.name,
          category: ent.category,
          x: centerX - 80,
          y: centerY + 20,
          entity: ent,
        };
      }
      if (ent.id === "ENT-002") {
        return {
          id: ent.id,
          label: ent.name,
          category: ent.category,
          x: centerX + 120,
          y: centerY - 40,
          entity: ent,
        };
      }
      if (ent.id === "ENT-006") {
        return {
          id: ent.id,
          label: ent.name,
          category: ent.category,
          x: centerX + 20,
          y: centerY - 130,
          entity: ent,
        };
      }
      if (ent.id === "ENT-007") {
        return {
          id: ent.id,
          label: ent.name,
          category: ent.category,
          x: centerX - 120,
          y: centerY + 140,
          entity: ent,
        };
      }

      const totalOuter = Math.max(1, entities.length - 4);
      const angle = (idx / totalOuter) * 2 * Math.PI;
      const x = Math.round(centerX + radius * Math.cos(angle));
      const y = Math.round(centerY + radius * Math.sin(angle));
      return {
        id: ent.id,
        label: ent.name,
        category: ent.category,
        x: Math.max(90, Math.min(width - 90, x)),
        y: Math.max(70, Math.min(height - 70, y)),
        entity: ent,
      };
    });
  }, [entities]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodePosition>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Compute set of connected node IDs to selected node
  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (!selectedNodeId) return set;
    set.add(selectedNodeId);

    relationships.forEach((rel) => {
      if (rel.source_id === selectedNodeId) {
        set.add(rel.target_id);
      } else if (rel.target_id === selectedNodeId) {
        set.add(rel.source_id);
      }
    });
    return set;
  }, [selectedNodeId, relationships]);

  // Filter nodes according to search and category filter
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch =
        !searchQuery.trim() ||
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === "all" || n.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [nodes, searchQuery, categoryFilter]);

  const filteredNodeIds = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  // Node selection handler
  const handleNodeClick = (node: NodePosition) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);

    onSelectInspectorItem({
      type: "entity",
      id: node.entity.id,
      title: node.entity.name,
      subtitle: `Category: ${node.entity.category.toUpperCase()} • Reliability: ${Math.round(
        node.entity.reliability_score * 100
      )}%`,
      classification: node.entity.category.toUpperCase(),
      confidence: Math.round(node.entity.reliability_score * 100),
      epistemicType: "lead",
      description: node.entity.notes || "Entity node in synthetic knowledge graph.",
      metadata: {
        "Entity ID": node.entity.id,
        "Category": node.entity.category,
        "Associated Case": node.entity.case_ids?.join(", ") || activeCaseFilter,
        "Aliases": node.entity.aliases?.join(", ") || "None",
        ...node.entity.identifiers,
      },
    });
  };

  // Edge selection handler
  const handleEdgeClick = (rel: Relationship) => {
    setSelectedEdgeId(rel.id);

    onSelectInspectorItem({
      type: "relationship",
      id: rel.id,
      title: `${rel.source_id} → ${rel.relationship_type.replace(/_/g, " ").toUpperCase()} → ${rel.target_id}`,
      subtitle: `Confidence: ${Math.round(rel.confidence * 100)}% • Weight: ${rel.weight}`,
      classification: "GRAPH EDGE",
      confidence: Math.round(rel.confidence * 100),
      epistemicType: rel.inference_type === "factual" ? "fact" : "lead",
      description: rel.notes || "Topological link between investigation entities.",
      metadata: {
        "Edge ID": rel.id,
        "Source Entity": rel.source_id,
        "Target Entity": rel.target_id,
        "Relationship": rel.relationship_type,
        "Inference Type": rel.inference_type.toUpperCase(),
        "Confidence": `${Math.round(rel.confidence * 100)}%`,
        "Supporting Evidence": rel.supporting_evidence_ids.join(", ") || "None cited",
      },
      linkedEvidence: rel.supporting_evidence_ids.map((id) => ({
        id,
        title: `Evidence ${id}`,
      })),
    });
  };

  const getNodeColor = (category: string, isSelected: boolean) => {
    if (isSelected) return "#c084fc"; // purpleBright
    switch (category) {
      case "person":
        return "#a855f7"; // purple
      case "organization":
        return "#38bdf8"; // cyan
      case "vehicle":
        return "#fbbf24"; // amber
      case "digital_asset":
        return "#34d399"; // emerald
      default:
        return "#94a3b8"; // slate
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.6, Math.min(1.8, +(prev + delta).toFixed(1))));
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    setSearchQuery("");
    setCategoryFilter("all");
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* TOP HEADER & CASE CONTEXT BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-nexora-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-purpleBright uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              TOPOLOGICAL KNOWLEDGE GRAPH
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-cyan">
              {filteredNodes.length} VISIBLE NODES • {relationships.length} EDGES
            </span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white mt-1 flex items-center gap-3">
            Interactive Knowledge Graph
          </h1>
          <p className="text-xs text-nexora-textSecondary mt-0.5">
            Signature multi-hop link analysis canvas linking entities, subjects, and infrastructure with strict epistemic provenance.
          </p>
        </div>

        {/* PRIMARY ACTIONS & CASE RETURN */}
        <div className="flex items-center gap-2.5">
          {onReturnToCase && (
            <button
              onClick={() => onReturnToCase(activeCaseFilter)}
              className="px-3 py-1.5 rounded-md bg-nexora-surface border border-nexora-border hover:bg-nexora-raised text-xs font-mono text-nexora-text hover:text-white flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-nexora-cyan" />
              <span>Return to Case ({activeCaseFilter})</span>
            </button>
          )}

          {/* CASE SELECTOR DROPDOWN */}
          <select
            value={activeCaseFilter}
            onChange={(e) => {
              setActiveCaseFilter(e.target.value);
              if (onSelectCaseId && e.target.value !== "all") {
                onSelectCaseId(e.target.value);
              }
            }}
            className="px-3 py-1.5 rounded-md bg-nexora-surface border border-nexora-border text-xs font-mono text-nexora-text focus:outline-none focus:border-nexora-purple cursor-pointer"
          >
            <option value="CASE-001">CASE-001: Vanguard Horizon</option>
            <option value="CASE-002">CASE-002: Cobalt Sentinel</option>
            <option value="CASE-003">CASE-003: Maritime AIS Spoofing</option>
            <option value="all">All Canonical Cases (Unified)</option>
          </select>
        </div>
      </div>

      {/* GRAPH TOOLBAR */}
      <div className="p-3 rounded-lg bg-nexora-surface border border-nexora-border flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-nexora-textSubtle" />
            <input
              type="text"
              placeholder="Search entity node or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1 rounded bg-nexora-lowest border border-nexora-border text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple w-48 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-nexora-textSubtle hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
            {[
              { id: "all", label: "All" },
              { id: "person", label: "Person" },
              { id: "organization", label: "Facility" },
              { id: "vehicle", label: "Vehicle" },
              { id: "digital_asset", label: "Digital SCADA" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2 py-0.5 rounded transition-all ${
                  categoryFilter === cat.id
                    ? "bg-nexora-purpleActive text-white font-bold"
                    : "bg-nexora-lowest text-nexora-textSubtle hover:text-nexora-text border border-nexora-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Fit-to-view Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-nexora-lowest rounded border border-nexora-border">
            <button
              onClick={() => handleZoom(-0.2)}
              disabled={zoomLevel <= 0.6}
              className="p-1.5 hover:text-white text-nexora-textSubtle disabled:opacity-40 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] text-nexora-cyan font-bold select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.2)}
              disabled={zoomLevel >= 1.8}
              className="p-1.5 hover:text-white text-nexora-textSubtle disabled:opacity-40 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-white transition-colors"
            title="Reset zoom & filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* GRAPH CANVAS WRAPPER */}
      {isLoading ? (
        <div className="h-[520px] rounded-xl bg-nexora-lowest border border-nexora-border flex items-center justify-center text-xs font-mono text-nexora-textSubtle animate-pulse">
          Computing topological force layout for {activeCaseFilter}...
        </div>
      ) : filteredNodes.length === 0 ? (
        /* EMPTY STATE */
        <div className="h-[480px] rounded-xl bg-nexora-lowest border border-nexora-border flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-nexora-surface border border-nexora-border flex items-center justify-center text-nexora-textSubtle">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-white">No graph data available</h3>
          <p className="text-xs text-nexora-textMuted max-w-sm leading-relaxed">
            No entities or relationships match your current search &quot;{searchQuery}&quot; or category filter in this case context.
          </p>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded bg-nexora-purpleActive hover:bg-nexora-purple text-xs font-medium text-white transition-all"
          >
            Reset Search & Filters
          </button>
        </div>
      ) : (
        <div className="relative rounded-xl bg-nexora-lowest border border-nexora-border overflow-hidden shadow-2xl">
          {/* TOP OVERLAYS */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-nexora-surface/90 backdrop-blur border border-nexora-border text-nexora-textSubtle">
              FOCUSED CASE: <strong className="text-nexora-cyan">{activeCaseFilter}</strong>
            </span>
            {selectedNodeId && (
              <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-nexora-surface/90 backdrop-blur border border-nexora-border text-nexora-purpleBright font-bold">
                ACTIVE NODE: {selectedNodeId}
              </span>
            )}
            {selectedEdgeId && (
              <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-amber-950/90 backdrop-blur border border-amber-800 text-amber-300 font-bold">
                ACTIVE EDGE: {selectedEdgeId}
              </span>
            )}
          </div>

          {/* SVG GRAPH CANVAS */}
          <div className="w-full overflow-hidden flex justify-center py-2">
            <svg
              viewBox="0 0 860 520"
              className="w-full max-w-5xl h-[500px] select-none"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <defs>
                {/* Arrow markers for directed edges */}
                <marker
                  id="arrow-factual"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="arrow-lead"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-dimmed"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                </marker>

                <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* EDGES */}
              {relationships.map((rel) => {
                const source = nodeMap.get(rel.source_id);
                const target = nodeMap.get(rel.target_id);
                if (!source || !target) return null;

                const isFactual = rel.inference_type === "factual";
                const isDirectlyConnected =
                  selectedNodeId === rel.source_id || selectedNodeId === rel.target_id;
                const isSelectedEdge = selectedEdgeId === rel.id;

                const strokeColor = isSelectedEdge
                  ? "#a855f7"
                  : isDirectlyConnected
                  ? isFactual
                    ? "#38bdf8"
                    : "#fbbf24"
                  : "#334155";

                const strokeOpacity =
                  isSelectedEdge || isDirectlyConnected ? 0.95 : selectedNodeId ? 0.2 : 0.45;

                const strokeWidth = isSelectedEdge ? 3.5 : isDirectlyConnected ? 2.5 : 1.5;

                const markerId = isSelectedEdge || isDirectlyConnected
                  ? isFactual
                    ? "url(#arrow-factual)"
                    : "url(#arrow-lead)"
                  : "url(#arrow-dimmed)";

                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;

                return (
                  <g
                    key={rel.id}
                    onClick={() => handleEdgeClick(rel)}
                    className="cursor-pointer group"
                  >
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      strokeDasharray={isFactual ? undefined : "6 4"}
                      markerEnd={markerId}
                      className="transition-all duration-200"
                    />

                    {/* Edge Label badge */}
                    {(isDirectlyConnected || isSelectedEdge) && (
                      <g transform={`translate(${midX}, ${midY - 8})`}>
                        <rect
                          x="-45"
                          y="-8"
                          width="90"
                          height="16"
                          rx="4"
                          fill="#0f172a"
                          stroke={isFactual ? "#0284c7" : "#b45309"}
                          strokeWidth="1"
                          opacity="0.9"
                        />
                        <text
                          textAnchor="middle"
                          dy="3.5"
                          fill={isFactual ? "#38bdf8" : "#fbbf24"}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {rel.relationship_type.replace(/_/g, " ").slice(0, 14)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* NODES */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isConnected = connectedNodeIds.has(node.id);
                const matchesFilter = filteredNodeIds.has(node.id);

                // If a node is selected, dim unconnected nodes. If search is active, dim non-matching nodes.
                const isDimmed =
                  (selectedNodeId && !isConnected) || (!matchesFilter);

                const nodeOpacity = isDimmed ? 0.22 : 1.0;
                const color = getNodeColor(node.category, isSelected);

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group transition-opacity duration-200"
                    transform={`translate(${node.x}, ${node.y})`}
                    opacity={nodeOpacity}
                  >
                    {/* Selected Halo Pulse */}
                    {isSelected && (
                      <circle
                        r="30"
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        className="animate-spin-slow opacity-90"
                      />
                    )}

                    {/* Outer Glow */}
                    <circle
                      r={isSelected ? 22 : 18}
                      fill="#020617"
                      stroke={color}
                      strokeWidth={isSelected ? 3.5 : 2}
                      filter={isSelected ? "url(#glow-purple)" : undefined}
                      className="transition-all duration-200 group-hover:scale-110"
                    />

                    {/* Node Inner Core */}
                    <circle
                      r="6"
                      fill={color}
                      opacity={isSelected ? 1 : 0.8}
                    />

                    {/* Node ID label */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {node.id.replace("ENT-", "")}
                    </text>

                    {/* Node Name Label */}
                    <text
                      textAnchor="middle"
                      dy="34"
                      fill={isSelected ? "#ffffff" : "#94a3b8"}
                      fontSize={isSelected ? "11" : "10"}
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none drop-shadow"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* BOTTOM INTERACTIVE LEGEND BAR */}
          <div className="p-3 border-t border-nexora-border/80 bg-nexora-surface/80 backdrop-blur flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-nexora-textSubtle">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-nexora-cyan">
                <span className="w-2.5 h-2.5 rounded-full bg-nexora-cyan" />
                Factual Link (Solid)
              </span>
              <span className="flex items-center gap-1.5 text-nexora-amber">
                <span className="w-2.5 h-2.5 rounded-full bg-nexora-amber" />
                Analytical Lead (Dashed)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                Person
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                SCADA / Digital Asset
              </span>
            </div>

            <div className="flex items-center gap-2 text-nexora-ice">
              <Info className="w-3.5 h-3.5" />
              <span>Select node or edge to inspect full chain of custody</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

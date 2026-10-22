"use client";

import React, { useState, useEffect } from "react";
import { Entity, Relationship } from "@/types/intelligence";
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
} from "lucide-react";

interface KnowledgeGraphViewProps {
  caseId?: string;
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
  onSelectInspectorItem,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("ENT-001");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGraphData() {
      setIsLoading(true);
      try {
        const [ents, rels] = await Promise.all([
          nexoraApi.getEntities(caseId),
          nexoraApi.getRelationships(caseId),
        ]);
        if (isMounted) {
          setEntities(ents);
          setRelationships(rels);
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
  }, [caseId]);

  // Compute node coordinates in a circular/force-like deterministic layout
  const nodes: NodePosition[] = React.useMemo(() => {
    if (entities.length === 0) return [];
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 80;

    return entities.map((ent, idx) => {
      // Put central primary suspect or facility near center
      if (ent.id === "ENT-001") {
        return {
          id: ent.id,
          label: ent.name,
          category: ent.category,
          x: centerX - 60,
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

      const angle = (idx / (entities.length - 2)) * 2 * Math.PI;
      const x = Math.round(centerX + radius * Math.cos(angle));
      const y = Math.round(centerY + radius * Math.sin(angle));
      return {
        id: ent.id,
        label: ent.name,
        category: ent.category,
        x: Math.max(80, Math.min(width - 80, x)),
        y: Math.max(60, Math.min(height - 60, y)),
        entity: ent,
      };
    });
  }, [entities]);

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, NodePosition>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const handleNodeClick = (node: NodePosition) => {
    setSelectedNodeId(node.id);
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
        "Aliases": node.entity.aliases?.join(", ") || "None",
        ...node.entity.identifiers,
      },
    });
  };

  const getNodeColor = (category: string, isSelected: boolean) => {
    if (isSelected) return "#a855f7"; // purpleBright
    switch (category) {
      case "person":
        return "#c084fc"; // purple
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

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nexora-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              TOPOLOGICAL LINK CANVAS
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              {relationships.length} EDGES • {entities.length} NODES
            </span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white mt-1">
            Knowledge Graph & Relationship Network
          </h1>
          <p className="text-xs text-nexora-textSecondary mt-0.5">
            Interactive link-analysis topology highlighting substantiated factual edges and AI analytical hypotheses.
          </p>
        </div>

        {/* LEGEND BADGES */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-nexora-cyan flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-nexora-cyan" />
            Factual Link (Solid)
          </span>
          <span className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-nexora-amber flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-nexora-amber" />
            Analytical Lead (Dashed)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 rounded-xl bg-nexora-surface border border-nexora-border flex items-center justify-center text-xs font-mono text-nexora-textSubtle animate-pulse">
          Computing topological force layout for {caseId}...
        </div>
      ) : (
        <div className="relative rounded-xl bg-nexora-lowest border border-nexora-border overflow-hidden shadow-2xl">
          {/* TOP CONTROLS OVERLAY */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-1 rounded bg-nexora-surface/90 backdrop-blur border border-nexora-border text-nexora-textMuted">
              CASE: <strong className="text-white">{caseId}</strong>
            </span>
            <span className="font-mono text-[10px] px-2 py-1 rounded bg-nexora-surface/90 backdrop-blur border border-nexora-border text-nexora-purpleBright">
              ACTIVE NODE: {selectedNodeId}
            </span>
          </div>

          {/* SVG GRAPH CANVAS */}
          <div className="w-full overflow-x-auto flex justify-center py-4">
            <svg
              viewBox="0 0 800 500"
              className="w-full max-w-4xl h-[480px] select-none"
            >
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* EDGES */}
              {relationships.map((rel) => {
                const source = nodeMap.get(rel.source_id);
                const target = nodeMap.get(rel.target_id);
                if (!source || !target) return null;

                const isFactual = rel.inference_type === "factual";
                const isSelectedRel =
                  selectedNodeId === rel.source_id || selectedNodeId === rel.target_id;

                return (
                  <g key={rel.id} className="cursor-pointer">
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={
                        isSelectedRel
                          ? isFactual
                            ? "#38bdf8"
                            : "#f59e0b"
                          : isFactual
                          ? "#334155"
                          : "#475569"
                      }
                      strokeWidth={isSelectedRel ? 2.5 : 1.5}
                      strokeDasharray={isFactual ? undefined : "5 4"}
                      opacity={isSelectedRel ? 0.95 : 0.45}
                    />
                    {/* Edge Label near midpoint */}
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 4}
                      fill={isSelectedRel ? "#e2e8f0" : "#64748b"}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {rel.relationship_type.replace(/_/g, " ")}
                    </text>
                  </g>
                );
              })}

              {/* NODES */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const color = getNodeColor(node.category, isSelected);

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group"
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    {isSelected && (
                      <circle
                        r="26"
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-spin-slow opacity-80"
                      />
                    )}

                    <circle
                      r="18"
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? "url(#glow)" : undefined}
                      className="transition-all duration-200 group-hover:scale-110"
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

                    {/* Node Title underneath */}
                    <text
                      textAnchor="middle"
                      dy="32"
                      fill={isSelected ? "#ffffff" : "#94a3b8"}
                      fontSize="10"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* BOTTOM QUICK DOCKET */}
          <div className="p-3 border-t border-nexora-border/80 bg-nexora-surface/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-nexora-textSubtle">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-nexora-cyan" />
              <span>Click any node or connection to inspect cryptographic provenance in Context Inspector.</span>
            </div>
            <div className="text-[11px] text-nexora-ice">
              {nodes.length} nodes mapped • Force simulated
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { CaseSummary, Entity } from "@/types/intelligence";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  MapPin,
  Radio,
  Eye,
  Truck,
  Building2,
  Navigation,
  Layers,
  Shield,
  Clock,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ExternalLink
} from "lucide-react";

interface GeospatialMapViewProps {
  caseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onNavigateToCase?: (caseId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

interface MapMarker {
  id: string;
  name: string;
  type: "facility" | "sensor" | "vehicle" | "burst";
  x: number; // percentage in tactical SVG canvas
  y: number;
  coordinates: string;
  description: string;
  confidence: number;
  details: Record<string, string>;
}

const TACTICAL_MARKERS: MapMarker[] = [
  {
    id: "LOC-001",
    name: "AeroGrid Substation #04 - Gate 4",
    type: "facility",
    x: 48,
    y: 52,
    coordinates: "45°31'12.4\"N 122°40'55.2\"W",
    description: "North perimeter turnstile access portal. RFID credential cloning ingress point.",
    confidence: 96,
    details: {
      "Target Zone": "Substation Perimeter",
      "Breach Method": "Cloned RFID #SYN-EMP-4421",
      "Recorded Time": "02:41:09 UTC",
    },
  },
  {
    id: "CAM-04",
    name: "CCTV Camera #04 FOV Cone",
    type: "sensor",
    x: 44,
    y: 47,
    coordinates: "45°31'14.1\"N 122°40'53.8\"W",
    description: "Fixed 1080p60 surveillance camera monitoring Gate 4 approach and telemetry cabin.",
    confidence: 98,
    details: {
      "Sensor ID": "Cam-04 NVR",
      "Field of View": "82° Horizontal Angle",
      "Evidence Seal": "EVD-001",
    },
  },
  {
    id: "VEH-001",
    name: "Utility Van Loitering Spot",
    type: "vehicle",
    x: 28,
    y: 35,
    coordinates: "45°31'18.9\"N 122°41'08.4\"W",
    description: "Dark blue Ford Transit loitering for 18 minutes along North Perimeter access road.",
    confidence: 88,
    details: {
      "Vehicle Entity": "ENT-003",
      "Plates Partial": "7X...9A",
      "Recorded Time": "02:15:30 UTC",
    },
  },
  {
    id: "RF-BURST",
    name: "433.92 MHz RF Burst Radius",
    type: "burst",
    x: 38,
    y: 42,
    coordinates: "45°31'16.0\"N 122°41'02.0\"W",
    description: "High-amplitude SDR transmission triggering wireless telemetry interface override.",
    confidence: 92,
    details: {
      "Frequency": "433.92 MHz ± 5 kHz",
      "Modulation": "ASK / FSK Burst",
      "Evidence Seal": "EVD-004",
    },
  },
  {
    id: "RTU-09",
    name: "Telemetry Terminal RTU-09",
    type: "facility",
    x: 58,
    y: 65,
    coordinates: "45°31'10.8\"N 122°40'50.1\"W",
    description: "SCADA distribution automation cabinet where corrupted firmware payload was written via USB.",
    confidence: 95,
    details: {
      "Terminal Node": "RTU-09 Main Board",
      "Corrupted Binary": "0x4A8E...Payload",
      "Evidence Seal": "EVD-003",
    },
  },
];

export const GeospatialMapView: React.FC<GeospatialMapViewProps> = ({
  caseId = "CASE-001",
  onSelectCaseId,
  onNavigateToCase,
  onSelectInspectorItem,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker>(TACTICAL_MARKERS[0]);
  const [filterType, setFilterType] = useState<string>("all");
  const [showFovCones, setShowFovCones] = useState<boolean>(true);
  const [showRfRadius, setShowRfRadius] = useState<boolean>(true);

  const filteredMarkers = TACTICAL_MARKERS.filter((m) => {
    if (filterType === "all") return true;
    return m.type === filterType;
  });

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onSelectInspectorItem({
      type: "entity",
      id: marker.id,
      title: marker.name,
      subtitle: `${marker.type.toUpperCase()} • ${marker.coordinates}`,
      classification: "GEOSPATIAL POINT",
      confidence: marker.confidence,
      epistemicType: "fact",
      description: marker.description,
      metadata: {
        "Point ID": marker.id,
        "GPS Coordinates": marker.coordinates,
        ...marker.details,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-nexora-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-nexora-cyan" />
              TACTICAL CARTOGRAPHY & SPATIAL INTELLIGENCE
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              GEO-CORRELATED SENSOR ARRAYS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white mt-1">
            Tactical Spatial Map
          </h1>
          <p className="text-xs lg:text-sm text-nexora-textSecondary mt-1 max-w-2xl leading-relaxed">
            Correlates physical coordinates, surveillance field-of-view cones, RF burst telemetry, and subject vehicle waypoints for {caseId}.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setShowFovCones(!showFovCones)}
            className={`px-3 py-1.5 rounded transition-all ${
              showFovCones
                ? "bg-nexora-purpleActive text-white"
                : "bg-nexora-surface border border-nexora-border text-nexora-textSubtle"
            }`}
          >
            FOV Cones
          </button>
          <button
            onClick={() => setShowRfRadius(!showRfRadius)}
            className={`px-3 py-1.5 rounded transition-all ${
              showRfRadius
                ? "bg-cyan-950 text-nexora-cyan border border-cyan-800"
                : "bg-nexora-surface border border-nexora-border text-nexora-textSubtle"
            }`}
          >
            RF Coverage
          </button>
        </div>
      </div>

      {/* 2. MAIN MAP WORKSPACE & INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: TACTICAL SVG CARTOGRAPHIC CANVAS (8 COLS) */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-3 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-nexora-textSubtle border-b border-nexora-border pb-2">
            <span className="flex items-center gap-1.5 text-nexora-cyan font-bold">
              <Crosshair className="w-3.5 h-3.5" />
              GRID: SUBSTATION-NORTH-PERIMETER-QUADRANT
            </span>
            <span>PROJECTION: WGS-84 UTM 10N</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[520px] bg-slate-950/90 rounded-lg overflow-hidden border border-nexora-border/80 select-none">
            {/* Tactical Grid Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tactical-grid)" />
            </svg>

            {/* Perimeter Line & Facility Outline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Access road */}
              <path
                d="M 50 180 Q 250 200 450 320 T 700 400"
                fill="none"
                stroke="#334155"
                strokeWidth="14"
                strokeDasharray="6 6"
              />
              {/* Perimeter Fence Line */}
              <polygon
                points="300,180 650,220 600,480 250,420"
                fill="#0f172a"
                fillOpacity="0.4"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* FOV Cone for CCTV Cam-04 */}
              {showFovCones && (
                <path
                  d="M 330 240 L 460 170 L 480 340 Z"
                  fill="#818cf8"
                  fillOpacity="0.15"
                  stroke="#818cf8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* RF Burst Radius circle */}
              {showRfRadius && (
                <circle
                  cx="285"
                  cy="218"
                  r="75"
                  fill="#06b6d4"
                  fillOpacity="0.12"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </svg>

            {/* Interactive Markers */}
            {filteredMarkers.map((m) => {
              const isSelected = selectedMarker.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleMarkerClick(m)}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all group z-10`}
                >
                  <div
                    className={`p-2 rounded-full border shadow-lg flex items-center justify-center transition-transform ${
                      isSelected
                        ? "bg-white text-nexora-app border-nexora-cyan scale-125 ring-4 ring-nexora-cyan/40"
                        : m.type === "facility"
                        ? "bg-nexora-surface border-cyan-500 text-cyan-400 hover:scale-110"
                        : m.type === "sensor"
                        ? "bg-nexora-surface border-purple-500 text-purple-400 hover:scale-110"
                        : m.type === "vehicle"
                        ? "bg-nexora-surface border-amber-500 text-amber-400 hover:scale-110"
                        : "bg-nexora-surface border-rose-500 text-rose-400 hover:scale-110"
                    }`}
                  >
                    {m.type === "facility" ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : m.type === "sensor" ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : m.type === "vehicle" ? (
                      <Truck className="w-3.5 h-3.5" />
                    ) : (
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                    )}
                  </div>

                  {/* Marker Tooltip Badge */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block whitespace-nowrap bg-nexora-lowest border border-nexora-border px-2 py-0.5 rounded text-[10px] font-mono text-white shadow-xl z-20">
                    {m.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas Footer Toolbar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-nexora-textSubtle pt-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Layers:</span>
              {["all", "facility", "sensor", "vehicle", "burst"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    filterType === t
                      ? "bg-nexora-purpleActive text-white"
                      : "hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <span>5 Tactical Geopoints Verified</span>
          </div>
        </div>

        {/* RIGHT: SELECTED GEOPOINT INSPECTOR (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-nexora-surface border border-nexora-border space-y-4 shadow-lg sticky top-6">
            <div className="flex items-center justify-between border-b border-nexora-border pb-3">
              <span className="font-mono text-xs font-bold text-nexora-textSubtle uppercase tracking-wider">
                GEO-TACTICAL INSPECTOR
              </span>
              <span className="font-mono text-[10px] text-nexora-cyan px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                AUDITED GPS
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-nexora-cyan font-bold">{selectedMarker.id}</span>
                <h3 className="font-display text-sm font-bold text-white">
                  {selectedMarker.name}
                </h3>
                <p className="text-[11px] text-nexora-textSecondary leading-relaxed pt-1">
                  {selectedMarker.description}
                </p>
              </div>

              <div className="p-3 rounded bg-nexora-lowest border border-nexora-border space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-nexora-textSubtle">Coordinates:</span>
                  <span className="text-nexora-cyan font-bold">{selectedMarker.coordinates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nexora-textSubtle">Geopoint Type:</span>
                  <span className="text-white uppercase font-semibold">{selectedMarker.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nexora-textSubtle">Confidence Score:</span>
                  <span className="text-emerald-400 font-semibold">{selectedMarker.confidence}%</span>
                </div>
              </div>

              {/* Specific metadata */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-nexora-textSubtle uppercase font-bold">
                  Field Details:
                </span>
                {Object.entries(selectedMarker.details).map(([k, v]) => (
                  <div key={k} className="p-2 rounded bg-nexora-lowest border border-nexora-border flex justify-between text-[10px]">
                    <span className="text-nexora-textSubtle">{k}:</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {onNavigateToCase && (
                <button
                  onClick={() => onNavigateToCase(caseId)}
                  className="w-full mt-2 py-2 px-3 rounded bg-nexora-purpleActive hover:bg-nexora-purple text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Return to Case Dossier</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

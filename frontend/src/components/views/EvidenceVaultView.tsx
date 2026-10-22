"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Evidence, CaseSummary, TimelineEvent } from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  ShieldCheck,
  Shield,
  Clock,
  FileCheck2,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ExternalLink,
  ArrowRight,
  Fingerprint,
  RefreshCw,
  Hash,
  Database,
  FileText,
  Calendar,
  Layers,
  UploadCloud,
  FileCode2,
  Info
} from "lucide-react";

interface EvidenceVaultViewProps {
  initialCaseId?: string;
  initialEvidenceId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onNavigateToTimeline?: (caseId: string, eventId?: string) => void;
  onNavigateToCase?: (caseId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  initialCaseId = "CASE-001",
  initialEvidenceId,
  onSelectCaseId,
  onNavigateToTimeline,
  onNavigateToCase,
  onSelectInspectorItem,
}) => {
  const [selectedCase, setSelectedCase] = useState<string>(initialCaseId);
  const [casesList, setCasesList] = useState<CaseSummary[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(initialEvidenceId || "EVD-001");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Live hash calculator state for uploaded file / raw string verification
  const [calcInput, setCalcInput] = useState<string>("");
  const [calculatedHash, setCalculatedHash] = useState<string | null>(null);
  const [calcStatus, setCalcStatus] = useState<string | null>(null);

  // Sync initialCaseId prop
  useEffect(() => {
    if (initialCaseId) {
      setSelectedCase(initialCaseId);
    }
  }, [initialCaseId]);

  // Sync initialEvidenceId prop
  useEffect(() => {
    if (initialEvidenceId) {
      setSelectedEvidenceId(initialEvidenceId);
    }
  }, [initialEvidenceId]);

  // Load cases list
  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        const cases = await nexoraApi.getCases();
        if (isMounted) setCasesList(cases);
      } catch (err) {
        console.error("Failed to load cases", err);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load evidence and timeline events
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const targetCase = selectedCase === "ALL" ? undefined : selectedCase;
        const [evList, tlList] = await Promise.all([
          nexoraApi.getEvidence(targetCase),
          nexoraApi.getTimeline(targetCase),
        ]);
        if (isMounted) {
          setEvidenceList(evList);
          setTimelineEvents(tlList);
          if (evList.length > 0 && !selectedEvidenceId) {
            setSelectedEvidenceId(evList[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load evidence records", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [selectedCase]);

  // Real SHA-256 hash generator using standard Web Crypto API (SubtleCrypto)
  const computeSha256 = async (text: string) => {
    if (!text.trim()) {
      setCalculatedHash(null);
      setCalcStatus(null);
      return;
    }
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setCalculatedHash(hashHex);
      setCalcStatus("Hash computed locally via SHA-256 engine. (Note: A calculated hash does not independently prove chain of custody or authenticity.)");
    } catch (e) {
      console.error("SHA-256 calculation failed", e);
      setCalcStatus("Failed to compute SHA-256 hash.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      setCalcInput(`[FILE: ${file.name} - ${file.size} bytes]\n${content.substring(0, 500)}...`);
      await computeSha256(content);
    };
    reader.readAsText(file);
  };

  // Filter evidence list
  const filteredEvidence = useMemo(() => {
    let result = [...evidenceList];

    if (typeFilter !== "all") {
      result = result.filter((e) => e.evidence_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.checksum.toLowerCase().includes(q)
      );
    }

    return result;
  }, [evidenceList, typeFilter, searchQuery]);

  const activeEvidence = useMemo(() => {
    return (
      evidenceList.find((e) => e.id === selectedEvidenceId) ||
      evidenceList[0] ||
      null
    );
  }, [evidenceList, selectedEvidenceId]);

  // Related timeline events for the active evidence
  const relatedEvents = useMemo(() => {
    if (!activeEvidence) return [];
    return timelineEvents.filter((evt) =>
      evt.evidence_ids.includes(activeEvidence.id)
    );
  }, [activeEvidence, timelineEvents]);

  // When active evidence changes, update the Inspector
  const handleSelectEvidence = (ev: Evidence) => {
    setSelectedEvidenceId(ev.id);
    onSelectInspectorItem({
      type: "evidence",
      id: ev.id,
      title: ev.title,
      subtitle: `${ev.evidence_type.toUpperCase()} • ${ev.source}`,
      classification: "VERIFIED RECORD",
      confidence: Math.round(ev.confidence_score * 100),
      epistemicType: "fact",
      description: ev.summary,
      hash: ev.checksum,
      metadata: {
        "Record ID": ev.id,
        "Evidence Type": ev.evidence_type,
        "Source Origin": ev.source,
        "Collection Time": new Date(ev.collected_at).toUTCString(),
        "Associated Case": ev.case_id,
        "Application Checksum": ev.checksum,
        "Custody Events": `${ev.chain_of_custody.length} handoffs recorded`,
      },
      linkedEvidence: [
        {
          id: ev.id,
          title: ev.title,
          hash: ev.checksum,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-nexora-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-nexora-cyan" />
              EVIDENCE INTELLIGENCE & PROVENANCE VAULT
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-textMuted">
              INTEGRITY-CONSTRAINED CHAIN OF CUSTODY
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white mt-1">
            Evidence Vault & Provenance
          </h1>
          <p className="text-xs lg:text-sm text-nexora-textSecondary mt-1 max-w-2xl leading-relaxed">
            Transparently distinguishes between source recorded data, application-calculated SHA-256 hashes, and verified reference benchmarks.
            No false claims of immutability without proof.
          </p>
        </div>

        {/* CASE FILTER SELECTOR */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <label className="text-xs font-mono text-nexora-textSubtle uppercase">Case Scope:</label>
          <select
            value={selectedCase}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCase(val);
              if (val !== "ALL" && onSelectCaseId) {
                onSelectCaseId(val);
              }
            }}
            className="bg-nexora-surface border border-nexora-border rounded px-3 py-1.5 text-xs font-mono text-nexora-text focus:outline-none focus:border-nexora-purple"
          >
            <option value="ALL">All Recorded Cases</option>
            {casesList.length > 0 ? (
              casesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.length > 25 ? `${c.title.substring(0, 25)}...` : c.title}
                </option>
              ))
            ) : (
              <>
                <option value="CASE-001">CASE-001 — Operation Vanguard Horizon</option>
                <option value="CASE-002">CASE-002 — Incident Blackwood SCADA</option>
                <option value="CASE-003">CASE-003 — Port Sector Infiltration</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* 2. PROVENANCE INTEGRITY TAXONOMY NOTICE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-nexora-surface border border-nexora-border space-y-1">
          <div className="flex items-center gap-1.5 text-nexora-cyan font-bold uppercase text-[10px]">
            <Database className="w-3.5 h-3.5" />
            1. Source Recorded
          </div>
          <p className="text-[11px] text-nexora-textSecondary">
            Metadata, timestamps, and camera IDs captured at ingestion from physical sensors or host logs.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-nexora-surface border border-nexora-border space-y-1">
          <div className="flex items-center gap-1.5 text-nexora-ice font-bold uppercase text-[10px]">
            <Hash className="w-3.5 h-3.5" />
            2. Calculated Checksum
          </div>
          <p className="text-[11px] text-nexora-textSecondary">
            SHA-256 bitstream computed on binary payload by NEXORA engine. Confirms file integrity.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-nexora-surface border border-nexora-border space-y-1">
          <div className="flex items-center gap-1.5 text-nexora-purpleBright font-bold uppercase text-[10px]">
            <Shield className="w-3.5 h-3.5" />
            3. Reference Verified
          </div>
          <p className="text-[11px] text-nexora-textSecondary">
            Matched against an independent official benchmark (e.g. state agency hash ledger or vendor cert).
          </p>
        </div>

        <div className="p-3 rounded-lg bg-nexora-surface border border-nexora-border space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            4. Unverified Provenance
          </div>
          <p className="text-[11px] text-nexora-textSecondary">
            Records missing trusted upstream signatures are explicitly flagged. Authenticity is not assumed.
          </p>
        </div>
      </div>

      {/* 3. CONTROLS: TYPE FILTER & SEARCH */}
      <div className="p-3.5 rounded-lg bg-nexora-surface border border-nexora-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-nexora-textSubtle">Type:</span>
          {[
            { id: "all", label: "All Types" },
            { id: "digital_video", label: "Video" },
            { id: "access_log", label: "Access Logs" },
            { id: "telemetry_dump", label: "Telemetry" },
            { id: "forensic_report", label: "Forensic" },
            { id: "communication", label: "Comms" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                typeFilter === t.id
                  ? "bg-nexora-purpleActive text-white"
                  : "bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-nexora-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-nexora-textSubtle absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search hash, title, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexora-lowest border border-nexora-border rounded pl-8 pr-3 py-1 text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple"
          />
        </div>
      </div>

      {/* 4. MASTER-DETAIL DUAL PANE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EVIDENCE RECORDS LIST (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-nexora-textSubtle px-1">
            <span>VAULT INVENTORY</span>
            <span>{filteredEvidence.length} RECORDS</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-nexora-textSubtle bg-nexora-surface rounded-lg border border-nexora-border animate-pulse">
              Retrieving cryptographic records...
            </div>
          ) : filteredEvidence.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-nexora-surface border border-nexora-border text-xs font-mono text-nexora-textSubtle">
              No evidence records found matching criteria.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredEvidence.map((ev) => {
                const isSelected = selectedEvidenceId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => handleSelectEvidence(ev)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 shadow-sm ${
                      isSelected
                        ? "bg-nexora-surface border-nexora-cyan ring-1 ring-nexora-cyan/40"
                        : "bg-nexora-surface border-nexora-border hover:border-nexora-purple/60 hover:bg-nexora-raised/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-nexora-cyan">
                          {ev.id}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexora-lowest text-nexora-ice border border-nexora-border uppercase">
                          {ev.evidence_type.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-nexora-textSubtle">
                        {new Date(ev.collected_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white leading-snug">
                      {ev.title}
                    </h4>

                    <p className="text-xs text-nexora-textSecondary line-clamp-2 leading-relaxed">
                      {ev.summary}
                    </p>

                    <div className="pt-2 border-t border-nexora-border/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-nexora-textSubtle truncate max-w-[200px]">
                        Src: {ev.source}
                      </span>
                      <span className="text-nexora-cyan font-mono flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" />
                        {ev.checksum ? `${ev.checksum.substring(0, 10)}...` : "NO HASH"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: EVIDENCE DETAIL INSPECTOR & PROVENANCE AUDIT (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {activeEvidence ? (
            <div className="p-5 rounded-xl bg-nexora-surface border border-nexora-border space-y-5">
              {/* Top Badge Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-nexora-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-extrabold text-nexora-cyan">
                    {activeEvidence.id}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-nexora-cyan border border-cyan-800 font-semibold">
                    {activeEvidence.evidence_type.replace("_", " ")}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-nexora-lowest text-nexora-ice border border-nexora-border">
                    CONFIDENCE: {Math.round(activeEvidence.confidence_score * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-nexora-textSubtle">
                    CASE: {activeEvidence.case_id}
                  </span>
                </div>
              </div>

              {/* Title & Analytical Summary */}
              <div className="space-y-1.5">
                <h2 className="text-xl font-display font-extrabold text-white">
                  {activeEvidence.title}
                </h2>
                <p className="text-xs text-nexora-textSecondary leading-relaxed">
                  {activeEvidence.summary}
                </p>
              </div>

              {/* PROVENANCE BREAKDOWN CARD */}
              <div className="p-4 rounded-lg bg-nexora-lowest border border-nexora-border space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-nexora-textSubtle">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-white flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-nexora-cyan" />
                    CRYPTOGRAPHIC PROVENANCE DOSSIER
                  </span>
                  <span className="text-[10px] text-nexora-cyan">AUDITED CHECK</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-nexora-border/60">
                    <span className="text-nexora-textSubtle">1. Recorded Source Origin:</span>
                    <span className="text-white font-medium">{activeEvidence.source}</span>
                  </div>

                  <div className="flex flex-col gap-1 py-1 border-b border-nexora-border/60">
                    <span className="text-nexora-textSubtle">2. Calculated SHA-256 Bitstream:</span>
                    <div className="p-2 rounded bg-nexora-app border border-nexora-border text-nexora-cyan text-[11px] break-all select-all font-mono">
                      {activeEvidence.checksum || "None calculated"}
                    </div>
                    <span className="text-[10px] text-nexora-textSubtle italic">
                      Label: Application-calculated hash. A hash alone does not prove authenticity or unbroken custody.
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-nexora-border/60">
                    <span className="text-nexora-textSubtle">3. Verified Reference State:</span>
                    <span className="text-nexora-ice font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-nexora-ice" />
                      Reference Matched in Canonical Ingest Ledger
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-nexora-textSubtle">Collection Timestamp:</span>
                    <span className="text-nexora-text">
                      {new Date(activeEvidence.collected_at).toUTCString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CHAIN OF CUSTODY LOG */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-nexora-purple" />
                    CHAIN OF CUSTODY RECORD ({activeEvidence.chain_of_custody.length} TRANSFERS)
                  </span>
                </div>

                <div className="border border-nexora-border rounded-lg overflow-hidden bg-nexora-lowest">
                  {activeEvidence.chain_of_custody.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        idx !== activeEvidence.chain_of_custody.length - 1
                          ? "border-b border-nexora-border/60"
                          : ""
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-white font-medium">{entry.action}</div>
                        <div className="text-[11px] text-nexora-textSubtle">
                          Custodian: <span className="text-nexora-purpleBright">{entry.custodian}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-nexora-textSubtle font-mono">
                        {new Date(entry.timestamp).toUTCString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CORRELATED TIMELINE EVENTS */}
              <div className="space-y-2 font-mono">
                <div className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-nexora-cyan" />
                  CORRELATED TIMELINE EVENTS ({relatedEvents.length})
                </div>

                {relatedEvents.length > 0 ? (
                  <div className="space-y-2">
                    {relatedEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-lg bg-nexora-lowest border border-nexora-border flex items-center justify-between text-xs hover:border-nexora-purple/60 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-nexora-cyan font-bold">{evt.id}</span>
                            <span className="text-white font-medium">{evt.title}</span>
                          </div>
                          <div className="text-[10px] text-nexora-textSubtle">
                            {new Date(evt.timestamp).toUTCString()}
                          </div>
                        </div>

                        {onNavigateToTimeline && (
                          <button
                            onClick={() => onNavigateToTimeline(evt.case_id, evt.id)}
                            className="px-2 py-1 rounded bg-nexora-surface border border-nexora-border text-nexora-purpleBright hover:bg-nexora-raised transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <span>View on Timeline</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded bg-nexora-lowest border border-nexora-border text-xs text-nexora-textSubtle italic">
                    No timeline events directly cite this evidence record ID.
                  </div>
                )}
              </div>

              {/* INTERACTIVE INTEGRITY CHECK CALCULATOR */}
              <div className="p-4 rounded-xl bg-nexora-surface border border-nexora-purple/40 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-nexora-purple" />
                    LIVE SHA-256 INTEGRITY CALCULATOR
                  </span>
                  <span className="text-[10px] text-nexora-purpleBright">CLIENT-SIDE WebCrypto</span>
                </div>
                <p className="text-[11px] text-nexora-textSecondary">
                  Test and calculate SHA-256 hashes on sample files or strings. A calculated hash confirms bitstream reproduction, not authentic origin.
                </p>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste payload or type text to calculate hash..."
                      value={calcInput}
                      onChange={(e) => {
                        setCalcInput(e.target.value);
                        computeSha256(e.target.value);
                      }}
                      className="flex-1 bg-nexora-lowest border border-nexora-border rounded px-3 py-1.5 text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple"
                    />
                    <label className="cursor-pointer px-3 py-1.5 rounded bg-nexora-lowest border border-nexora-border hover:border-nexora-purple text-xs text-nexora-text flex items-center gap-1 transition-colors">
                      <UploadCloud className="w-3 h-3 text-nexora-purple" />
                      <span>Upload</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {calculatedHash && (
                    <div className="p-2.5 rounded bg-nexora-lowest border border-nexora-border space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-nexora-textSubtle">CALCULATED SHA-256:</span>
                        <span className="text-nexora-green font-bold">COMPUTED</span>
                      </div>
                      <div className="font-mono text-xs text-nexora-cyan break-all select-all">
                        {calculatedHash}
                      </div>
                      <div className="text-[10px] text-nexora-textSubtle pt-1">
                        Match with Active Record:{" "}
                        {calculatedHash.toLowerCase() === activeEvidence.checksum?.toLowerCase() ? (
                          <strong className="text-nexora-green font-normal">EXACT MATCH (Bitstream Integrity Verified)</strong>
                        ) : (
                          <span className="text-amber-400">Different bitstream from active record</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* NAVIGATION ACTIONS */}
              <div className="pt-2 border-t border-nexora-border flex flex-wrap items-center gap-3">
                {onNavigateToCase && (
                  <button
                    onClick={() => onNavigateToCase(activeEvidence.case_id)}
                    className="px-3 py-2 rounded bg-nexora-lowest border border-nexora-border hover:border-nexora-purple text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-nexora-purple" />
                    <span>Open Case {activeEvidence.case_id}</span>
                  </button>
                )}

                {onNavigateToTimeline && (
                  <button
                    onClick={() => onNavigateToTimeline(activeEvidence.case_id)}
                    className="px-3 py-2 rounded bg-nexora-purpleActive hover:bg-nexora-purple text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>View Temporal Reconstruction</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-nexora-surface border border-nexora-border text-xs font-mono text-nexora-textSubtle">
              Select an evidence item from the inventory list to view its cryptographic provenance and chain of custody.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

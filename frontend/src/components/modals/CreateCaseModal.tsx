"use client";

import React, { useState } from "react";
import { X, Shield, CheckCircle2, AlertCircle, Lock, Terminal } from "lucide-react";

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseData: { id: string; name: string; priority: string }) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [caseName, setCaseName] = useState("Operation Cobalt Sentinel");
  const [description, setDescription] = useState(
    "Anomalous firmware downgrade detected across regional distribution nodes following unauthorized physical perimeter breach at East Substation 09."
  );
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Critical");
  const [tags, setTags] = useState<string[]>(["#SCADA", "#CyberPhysical", "#PerimeterBreach"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [initLedger, setInitLedger] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      const formatted = newTagInput.startsWith("#") ? newTagInput.trim() : `#${newTagInput.trim()}`;
      setTags([...tags, formatted]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName.trim()) {
      setError("Case Operation Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Primary incident briefing is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate creation
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        id: "CASE-002",
        name: caseName,
        priority: priority,
      });
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div
        className="w-full max-w-xl rounded-xl bg-nexora-overlay border border-nexora-borderElevated shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="h-14 border-b border-nexora-border flex items-center justify-between px-6 bg-nexora-lowest/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexora-raised border border-nexora-border flex items-center justify-center text-nexora-purple">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-nexora-text">
                Initiate Investigative Case Dossier
              </h3>
              <p className="text-[11px] text-nexora-textMuted">
                Create a new compartmentalized intelligence dossier and cryptographic audit chain.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-nexora-textMuted hover:text-nexora-text hover:bg-nexora-raised transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-800/80 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Case Identifier */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
              Case Identifier // System Allocated
            </label>
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-nexora-lowest border border-nexora-border font-mono text-xs">
              <span className="text-nexora-cyan font-bold">CASE-002</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-[10px] text-nexora-cyan uppercase font-bold">
                ALLOCATED
              </span>
            </div>
          </div>

          {/* Case Title */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
              Case Codename / Operation Title *
            </label>
            <div className="relative">
              <input
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="e.g. Operation Vanguard Horizon"
                className="w-full px-3 py-2 rounded-md bg-nexora-lowest border border-nexora-border text-nexora-text focus:outline-none focus:border-nexora-purple transition-colors text-xs"
              />
              {caseName && (
                <CheckCircle2 className="w-4 h-4 text-nexora-green absolute right-3 top-2.5" />
              )}
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider">
                Primary Incident Briefing *
              </label>
              <span className="font-mono text-[10px] text-nexora-textSubtle">
                {description.length}/1000
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-nexora-lowest border border-nexora-border text-nexora-text focus:outline-none focus:border-nexora-purple transition-colors text-xs resize-none"
            />
          </div>

          {/* Priority Pill Selector */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
              Investigation Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["Low", "Medium", "High", "Critical"] as const).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-md font-mono text-xs font-semibold border transition-all ${
                      isSelected
                        ? p === "Critical"
                          ? "bg-red-950/60 border-red-600 text-nexora-red shadow-sm"
                          : "bg-nexora-raised border-nexora-purple text-nexora-purpleBright"
                        : "bg-nexora-lowest border-nexora-border text-nexora-textMuted hover:text-nexora-text"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Compartment & Analyst */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
                Security Enclave
              </label>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-nexora-lowest border border-nexora-border font-mono text-xs text-nexora-text">
                <Lock className="w-3.5 h-3.5 text-nexora-amber" />
                <span className="truncate">SECRET // NOFORN</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
                Assigned Lead
              </label>
              <div className="px-3 py-2 rounded-md bg-nexora-lowest border border-nexora-border text-xs text-nexora-text truncate font-medium">
                Analyst K. Vance (KV-4819)
              </div>
            </div>
          </div>

          {/* Scope Tags */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-nexora-textMuted uppercase tracking-wider block">
              Evidentiary Scope Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-md bg-nexora-lowest border border-nexora-border min-h-[36px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-nexora-raised border border-nexora-border text-[11px] font-mono text-nexora-purpleBright flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="+ Add Tag..."
                  className="bg-transparent text-xs text-nexora-text outline-none px-1 py-0.5 w-24 font-mono placeholder:text-nexora-textSubtle"
                />
              </div>
            </div>
          </div>

          {/* Audit Ledger Checkbox */}
          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={initLedger}
              onChange={(e) => setInitLedger(e.target.checked)}
              className="mt-0.5 rounded bg-nexora-lowest border-nexora-border text-nexora-purple focus:ring-0"
            />
            <div className="text-[11px] leading-tight">
              <span className="text-nexora-text font-medium block">
                Initialize Immutable SHA-256 Chain-of-Custody Ledger
              </span>
              <span className="text-nexora-textSubtle text-[10px]">
                Binds the case genesis block to the active analyst key and registers an audit trail.
              </span>
            </div>
          </label>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-nexora-border flex items-center justify-between">
            <span className="font-mono text-[10px] text-nexora-textSubtle flex items-center gap-1">
              <Terminal className="w-3 h-3 text-nexora-cyan" />
              PROTOTYPE: Persists to local SQLite store
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-nexora-textMuted hover:text-nexora-text hover:bg-nexora-raised transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-md bg-nexora-purpleActive hover:bg-nexora-purple text-white text-xs font-medium shadow-md shadow-nexora-purple/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? "Allocating..." : "Create Case & Open Dossier"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

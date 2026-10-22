"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CopilotQueryResponse,
  CopilotStatusResponse,
  CopilotCitation,
  CaseSummary,
} from "@/types/intelligence";
import { nexoraApi } from "@/lib/api-client";
import { InspectorItem } from "@/components/layout/ContextInspector";
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Shield,
  Layers,
  HelpCircle,
  Clock,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FileText,
  CornerDownRight,
  Info,
} from "lucide-react";

interface CopilotMessage {
  id: string;
  sender: "analyst" | "copilot";
  timestamp: string;
  prompt?: string;
  response?: CopilotQueryResponse;
  text?: string;
  isError?: boolean;
}

interface CopilotViewProps {
  initialCaseId?: string;
  onSelectCaseId?: (caseId: string) => void;
  onNavigateToEvidence?: (evidenceId: string) => void;
  onNavigateToTimeline?: (caseId: string) => void;
  onNavigateToCase?: (caseId: string) => void;
  onSelectInspectorItem: (item: InspectorItem) => void;
}

const SUGGESTED_PROMPTS = [
  "Summarize the selected case.",
  "Summarize the documented timeline.",
  "List entities referenced by this evidence.",
  "Identify relationships supported by the available records.",
  "What information is missing from this investigation?",
];

export const CopilotView: React.FC<CopilotViewProps> = ({
  initialCaseId = "CASE-001",
  onSelectCaseId,
  onNavigateToEvidence,
  onNavigateToTimeline,
  onNavigateToCase,
  onSelectInspectorItem,
}) => {
  const [selectedCase, setSelectedCase] = useState<string>(initialCaseId);
  const [casesList, setCasesList] = useState<CaseSummary[]>([]);
  const [activeProvider, setActiveProvider] = useState<"ollama" | "gemini">("ollama");
  const [providerStatus, setProviderStatus] = useState<CopilotStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "msg-init",
      sender: "copilot",
      timestamp: new Date().toISOString(),
      text: "NEXORA Investigative Copilot initialized. Grounded exclusively in verified dossier records, cryptographic hashes, and documented timeline telemetry. Select a prompt or query the active case.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initialCaseId prop
  useEffect(() => {
    if (initialCaseId) {
      setSelectedCase(initialCaseId);
    }
  }, [initialCaseId]);

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

  // Check provider status
  const checkStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const status = await nexoraApi.getCopilotStatus();
      setProviderStatus(status);
    } catch (err) {
      console.error("Failed to check copilot provider status", err);
      setProviderStatus(null);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isQuerying]);

  const handleSendPrompt = async (promptToSend: string) => {
    const trimmed = promptToSend.trim();
    if (!trimmed || isQuerying) return;

    const userMsgId = `user-${Date.now()}`;
    const copilotMsgId = `copilot-${Date.now()}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "analyst",
        timestamp: new Date().toISOString(),
        text: trimmed,
      },
    ]);
    setInputPrompt("");
    setIsQuerying(true);

    try {
      const res = await nexoraApi.queryCopilot(selectedCase, trimmed, activeProvider);
      setMessages((prev) => [
        ...prev,
        {
          id: copilotMsgId,
          sender: "copilot",
          timestamp: new Date().toISOString(),
          response: res,
        },
      ]);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to process query with the analytical model provider.";
      setMessages((prev) => [
        ...prev,
        {
          id: copilotMsgId,
          sender: "copilot",
          timestamp: new Date().toISOString(),
          text: `[PROVIDER ERROR] ${errMsg}`,
          isError: true,
        },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleCitationClick = (citation: CopilotCitation) => {
    if (onNavigateToEvidence) {
      onNavigateToEvidence(citation.id);
    } else {
      onSelectInspectorItem({
        type: "evidence",
        id: citation.id,
        title: citation.title,
        subtitle: "Grounding Citation",
        classification: "CORROBORATING RECORD",
        confidence: 95,
        epistemicType: "fact",
        description: `Corroborating record cited by AI Copilot for ${selectedCase}.`,
        hash: citation.checksum || "Verified in canonical store",
      });
    }
  };

  const isCurrentProviderOnline =
    activeProvider === "ollama"
      ? providerStatus?.ollama_available
      : providerStatus?.gemini_available;

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-nexora-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-nexora-purpleBright uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-nexora-purpleBright" />
              AI COPILOT INVESTIGATIVE INTELLIGENCE
            </span>
            <span className="text-xs text-nexora-textSubtle">•</span>
            <span className="text-xs font-mono text-nexora-cyan">
              GROUNDED IN CANONICAL EVIDENCE
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white mt-1">
            Investigative AI Copilot
          </h1>
          <p className="text-xs lg:text-sm text-nexora-textSecondary mt-1 max-w-2xl leading-relaxed">
            Assistive reasoning constrained strictly to verified dossier facts, cryptographic hashes, and microsecond telemetry.
            Distinguishes facts from leads and explicitly exposes unverified gaps.
          </p>
        </div>

        {/* CASE CONTEXT SELECTOR */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <label className="text-xs font-mono text-nexora-textSubtle uppercase">Target Case:</label>
          <select
            value={selectedCase}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCase(val);
              if (onSelectCaseId) onSelectCaseId(val);
            }}
            className="bg-nexora-surface border border-nexora-border rounded px-3 py-1.5 text-xs font-mono text-nexora-text focus:outline-none focus:border-nexora-purple"
          >
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

      {/* 2. PROVIDER TELEMETRY & SELECTION STATUS BAR */}
      <div className="p-3.5 rounded-lg bg-nexora-surface border border-nexora-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-nexora-textSubtle uppercase text-[11px] font-semibold">
            Inference Engine:
          </span>

          {/* Local Ollama Button */}
          <button
            onClick={() => setActiveProvider("ollama")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
              activeProvider === "ollama"
                ? "bg-nexora-purpleActive text-white font-bold ring-1 ring-nexora-purpleBright"
                : "bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Local Gemma 4 E4B (Ollama)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                providerStatus?.ollama_available ? "bg-emerald-400" : "bg-amber-400"
              }`}
              title={providerStatus?.ollama_available ? "Ollama daemon connected" : "Ollama daemon standby"}
            />
          </button>

          {/* Google Gemini Button */}
          <button
            onClick={() => setActiveProvider("gemini")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
              activeProvider === "gemini"
                ? "bg-nexora-purpleActive text-white font-bold ring-1 ring-nexora-purpleBright"
                : "bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini API</span>
            <span
              className={`w-2 h-2 rounded-full ${
                providerStatus?.gemini_available ? "bg-emerald-400" : "bg-amber-400"
              }`}
              title={providerStatus?.gemini_available ? "Gemini API key loaded" : "GEMINI_API_KEY standby"}
            />
          </button>
        </div>

        {/* Live Provider Health Feedback */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-nexora-textSubtle">Status:</span>
            {isCurrentProviderOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                STANDBY (Grounded Retrieval Active)
              </span>
            )}
          </div>

          <button
            onClick={checkStatus}
            disabled={isCheckingStatus}
            className="p-1 rounded bg-nexora-lowest border border-nexora-border text-nexora-textSubtle hover:text-white transition-colors"
            title="Refresh Provider Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3. HONEST STANDBY NOTICE IF PROVIDER DAEMON NOT RUNNING */}
      {!isCurrentProviderOnline && (
        <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Honest Provider Telemetry Notice:</span>
          </div>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            {activeProvider === "ollama"
              ? `Local Ollama daemon is not responding on ${providerStatus?.ollama_endpoint || "http://127.0.0.1:11434"}. To run local model weights: 'ollama run ${providerStatus?.configured_model || "gemma4:e4b"}'. Copilot is operating in Grounded Retrieval mode with compulsory canonical evidence citations.`
              : "Google Gemini API key is not configured in backend environment. Set GEMINI_API_KEY to activate hosted cloud reasoning. Zero silent fallback."}
          </p>
        </div>
      )}

      {/* 4. MAIN CHAT WORKSPACE & SUGGESTED PROMPTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: SUGGESTED PROMPTS & CONSTRAINTS (1 COL) */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="p-4 rounded-xl bg-nexora-surface border border-nexora-border space-y-3 font-mono text-xs">
            <div className="text-white font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-nexora-purpleBright" />
              SUGGESTED PROMPTS
            </div>
            <p className="text-nexora-textSecondary text-[11px]">
              Click any investigative question to query case <strong className="text-nexora-cyan">{selectedCase}</strong>:
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p)}
                  disabled={isQuerying}
                  className="w-full text-left p-2.5 rounded-lg bg-nexora-lowest border border-nexora-border hover:border-nexora-purple/60 text-nexora-text hover:text-white transition-all text-[11px] leading-snug flex items-start gap-1.5 group"
                >
                  <CornerDownRight className="w-3 h-3 text-nexora-purple mt-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Epistemic Grounding Contract */}
          <div className="p-4 rounded-xl bg-nexora-lowest border border-nexora-border space-y-2.5 font-mono text-[11px]">
            <div className="text-nexora-textSubtle font-bold uppercase">
              REASONING CONSTRAINTS
            </div>
            <div className="space-y-1.5 text-nexora-textSecondary">
              <div className="flex items-center gap-1.5 text-nexora-cyan">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Compulsory evidence citations</span>
              </div>
              <div className="flex items-center gap-1.5 text-nexora-ice">
                <Layers className="w-3.5 h-3.5" />
                <span>Epistemic categorizations</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Explicit investigative gaps</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONVERSATION PANEL (3 COLS) */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2 flex flex-col h-[750px] bg-nexora-surface rounded-xl border border-nexora-border overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {messages.map((msg) => {
              if (msg.sender === "analyst") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl p-3.5 rounded-2xl rounded-tr-sm bg-nexora-purpleActive text-white text-xs font-mono shadow-md space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-purple-200">
                        <span className="font-bold">ANALYST QUERY</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="leading-relaxed text-sm font-sans">{msg.text}</p>
                    </div>
                  </div>
                );
              }

              // Copilot Response Render
              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-nexora-lowest border border-nexora-border flex items-center justify-center text-nexora-purpleBright shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="flex-1 max-w-2xl space-y-3">
                    {msg.response ? (
                      <div className="p-4 rounded-xl bg-nexora-lowest border border-nexora-border space-y-4 text-xs font-mono">
                        {/* Meta banner: Status, Provider, Model, Latency */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-nexora-border/60 pb-2 text-[10px]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                msg.response.status === "generated"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : "bg-cyan-950 text-nexora-cyan border border-cyan-800"
                              }`}
                            >
                              {msg.response.status.replace("_", " ")}
                            </span>
                            <span className="text-nexora-textSubtle">
                              Provider: {msg.response.provider} ({msg.response.model})
                            </span>
                          </div>
                          <span className="text-nexora-textSubtle">
                            Latency: {msg.response.latency_ms}ms
                          </span>
                        </div>

                        {/* Answer Text */}
                        <div className="text-sm font-sans text-white leading-relaxed whitespace-pre-line">
                          {msg.response.answer}
                        </div>

                        {/* EPISTEMIC TAXONOMY SECTIONS */}
                        <div className="space-y-3 pt-2">
                          {/* 1. Documented Facts */}
                          {msg.response.factual_observations.length > 0 && (
                            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 space-y-1.5">
                              <span className="font-mono text-[10px] font-bold text-nexora-cyan uppercase tracking-wider flex items-center gap-1">
                                <Shield className="w-3 h-3 text-nexora-cyan" />
                                DOCUMENTED FACTS (DIRECT RECORD EVIDENCE)
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-[11px] text-nexora-text">
                                {msg.response.factual_observations.map((fact, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {fact}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 2. Analytical Leads */}
                          {msg.response.analytical_leads.length > 0 && (
                            <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 space-y-1.5">
                              <span className="font-mono text-[10px] font-bold text-nexora-ice uppercase tracking-wider flex items-center gap-1">
                                <Layers className="w-3 h-3 text-nexora-ice" />
                                ANALYTICAL OBSERVATIONS & LEADS
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-[11px] text-nexora-text">
                                {msg.response.analytical_leads.map((lead, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {lead}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 3. Unverified Gaps */}
                          {msg.response.unverified_gaps.length > 0 && (
                            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 space-y-1.5">
                              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                INVESTIGATIVE GAPS & UNVERIFIED QUESTIONS
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/90">
                                {msg.response.unverified_gaps.map((gap, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {gap}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* EVIDENCE CITATIONS CHIPS */}
                        {msg.response.citations.length > 0 && (
                          <div className="pt-2 border-t border-nexora-border/60 space-y-2">
                            <span className="text-[10px] uppercase text-nexora-textSubtle font-bold">
                              Corroborating Evidence Records ({msg.response.citations.length}):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {msg.response.citations.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => handleCitationClick(c)}
                                  className="px-2 py-1 rounded bg-nexora-surface border border-cyan-800/80 text-nexora-cyan hover:bg-cyan-950/80 transition-colors flex items-center gap-1 text-[11px]"
                                  title="Inspect Evidence Record"
                                >
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>{c.id}: {c.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed ${
                          msg.isError
                            ? "bg-rose-950/30 border-rose-800 text-rose-300"
                            : "bg-nexora-lowest border border-nexora-border text-nexora-text"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isQuerying && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-nexora-lowest border border-nexora-border flex items-center justify-center text-nexora-purpleBright shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3 rounded-xl bg-nexora-lowest border border-nexora-border text-xs font-mono text-nexora-purpleBright flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nexora-purpleBright animate-ping" />
                  <span>Synthesizing case context and cross-referencing citations...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="p-4 border-t border-nexora-border bg-nexora-lowest">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputPrompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Ask Copilot about ${selectedCase} (e.g. 'Summarize the documented timeline')...`}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={isQuerying}
                className="flex-1 bg-nexora-surface border border-nexora-border rounded-lg px-4 py-2.5 text-xs text-nexora-text placeholder-nexora-textSubtle focus:outline-none focus:border-nexora-purple"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isQuerying}
                className="py-2.5 px-4 rounded-lg bg-nexora-purpleActive hover:bg-nexora-purple disabled:opacity-40 text-white font-medium flex items-center gap-1.5 transition-all text-xs font-mono shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

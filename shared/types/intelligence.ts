/**
 * NEXORA Intelligence Platform - Canonical Type Definitions
 * Tagline: Every Connection Reveals a Clue.
 * Synchronized with Backend Pydantic v2 schemas in backend/app/schemas/
 */

export type CaseStatus = 'active' | 'archived' | 'closed' | 'cold';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Case {
  id: string; // e.g. CASE-001
  title: string;
  summary: string;
  status: CaseStatus;
  priority: PriorityLevel;
  created_at: string;
  updated_at: string;
  lead_analyst: string;
  incident_ids: string[];
  entity_ids: string[];
  evidence_ids: string[];
  tags: string[];
}

export interface CaseSummary {
  id: string;
  title: string;
  summary: string;
  status: CaseStatus;
  priority: PriorityLevel;
  lead_analyst: string;
  incident_count: int_number;
  entity_count: int_number;
  evidence_count: int_number;
  updated_at: string;
}

type int_number = number;

export type EntityCategory =
  | 'person'
  | 'organization'
  | 'vehicle'
  | 'digital_asset'
  | 'location_entity'
  | 'financial_account';

export interface Entity {
  id: string; // e.g. ENT-001
  category: EntityCategory;
  name: string;
  aliases: string[];
  identifiers: Record<string, string>;
  attributes: Record<string, unknown>;
  reliability_score: number; // 0.0 - 1.0
  notes?: string | null;
  case_ids: string[];
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string; // e.g. INC-001
  case_id: string;
  title: string;
  incident_type: string;
  occurred_at: string;
  location_id: string;
  summary: string;
  severity: IncidentSeverity;
  status: string;
  mo_id?: string | null;
  evidence_ids: string[];
}

export interface CustodyEntry {
  timestamp: string;
  custodian: string;
  action: string;
}

export type EvidenceType =
  | 'digital_video'
  | 'access_log'
  | 'forensic_report'
  | 'telemetry_dump'
  | 'witness_statement'
  | 'communication';

export interface Evidence {
  id: string; // e.g. EVD-001
  case_id: string;
  title: string;
  evidence_type: EvidenceType;
  source: string;
  collected_at: string;
  chain_of_custody: CustodyEntry[];
  checksum: string; // sha256:...
  confidence_score: number; // 0.0 - 1.0
  summary: string;
  raw_metadata: Record<string, unknown>;
}

export type InferenceType = 'factual' | 'analytical_lead' | 'ai_hypothesis';
export type DirectionType = 'directed' | 'bidirectional' | 'undirected';

export interface Relationship {
  id: string; // e.g. REL-001
  case_id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  direction: DirectionType;
  weight: number; // 0.0 - 1.0
  start_time?: string | null;
  end_time?: string | null;
  supporting_evidence_ids: string[];
  inference_type: InferenceType;
  confidence: number;
  notes?: string | null;
}

export interface Hypothesis {
  id: string; // e.g. HYP-001
  case_id: string;
  statement: string;
  origin: 'analyst' | 'ai_copilot';
  model_name?: string | null;
  supporting_evidence_ids: string[];
  inconsistent_evidence_ids: string[];
  credibility_score: number;
  created_at: string;
}

export interface AIProviderStatus {
  active_provider: 'none' | 'ollama' | 'gemini';
  ollama_configured: boolean;
  gemini_configured: boolean;
  status: 'ready' | 'standby' | 'unreachable' | 'error';
}

export interface CanonicalDataSummary {
  status: string;
  cases_count: number;
  entities_count: number;
  evidence_count: number;
  relationships_count: number;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  environment: string;
  tagline: string;
  timestamp: string;
  ai_provider: AIProviderStatus;
  canonical_data: CanonicalDataSummary;
}

export interface APIErrorDetail {
  code: string;
  message: string;
  status: number;
  timestamp?: string;
  details?: unknown;
}

export interface APIResponseEnvelope<T> {
  status: 'success' | 'error';
  data: T;
  timestamp: string;
}

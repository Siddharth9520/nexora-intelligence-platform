import {
  HealthResponse,
  CaseSummary,
  Case,
  Entity,
  Evidence,
  Relationship,
  DashboardSummary,
  TimelineEvent,
  Hypothesis,
  APIErrorDetail
} from "@/types/intelligence";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class APIClientError extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = "APIClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorBody: APIErrorDetail | null = null;
      try {
        const json = await res.json();
        errorBody = json.error || json;
      } catch {
        // Body was not JSON
      }

      throw new APIClientError(
        errorBody?.message || `HTTP error ${res.status}: ${res.statusText}`,
        res.status,
        errorBody?.code || "HTTP_ERROR",
        errorBody?.details
      );
    }

    return await res.json();
  } catch (error) {
    if (error instanceof APIClientError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Network failure connecting to NEXORA analytical backend";
    throw new APIClientError(
      `Cannot connect to backend API at ${url}. Ensure the FastAPI server is running on port 8000. (${message})`,
      0,
      "NETWORK_ERROR"
    );
  }
}

export const nexoraApi = {
  async getHealth(): Promise<{ data: HealthResponse; latencyMs: number }> {
    const start = performance.now();
    const data = await request<HealthResponse>("health");
    const latencyMs = Math.round(performance.now() - start);
    return { data, latencyMs };
  },

  async getDashboard(): Promise<DashboardSummary> {
    return request<DashboardSummary>("dashboard");
  },

  async getCases(): Promise<CaseSummary[]> {
    return request<CaseSummary[]>("cases");
  },

  async getCase(caseId: string): Promise<Case> {
    return request<Case>(`cases/${encodeURIComponent(caseId)}`);
  },

  async getEntities(caseId?: string): Promise<Entity[]> {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : "";
    return request<Entity[]>(`entities${query}`);
  },

  async getEntitiesForCase(caseId: string): Promise<Entity[]> {
    return request<Entity[]>(`cases/${encodeURIComponent(caseId)}/entities`);
  },

  async getEvidence(caseId?: string): Promise<Evidence[]> {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : "";
    return request<Evidence[]>(`evidence${query}`);
  },

  async getEvidenceForCase(caseId: string): Promise<Evidence[]> {
    return request<Evidence[]>(`cases/${encodeURIComponent(caseId)}/evidence`);
  },

  async getRelationships(caseId?: string): Promise<Relationship[]> {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : "";
    return request<Relationship[]>(`relationships${query}`);
  },

  async getRelationshipsForCase(caseId: string): Promise<Relationship[]> {
    return request<Relationship[]>(`cases/${encodeURIComponent(caseId)}/relationships`);
  },

  async getTimeline(caseId?: string): Promise<TimelineEvent[]> {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : "";
    return request<TimelineEvent[]>(`timeline${query}`);
  },

  async getHypotheses(caseId?: string): Promise<Hypothesis[]> {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : "";
    return request<Hypothesis[]>(`hypotheses${query}`);
  },
};


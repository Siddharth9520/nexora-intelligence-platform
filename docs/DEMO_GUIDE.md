# NEXORA — Emergency Demo Guide

This guide walks an evaluator, analyst, or reviewer through the live demonstration of the **NEXORA Intelligence Platform**.

---

## Quick Startup Commands

### 1. Analytical Backend (FastAPI :8000)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # (or source venv/bin/activate on Unix)
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Health Check: `GET http://127.0.0.1:8000/api/v1/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### 2. Analytical Frontend (Next.js :3000)
```bash
cd frontend
npm install
npm run dev
```
- Open in browser: `http://localhost:3000`

---

## 5-Minute End-to-End Demo Script

### Step 1: Command Center & System Health
1. Open `http://localhost:3000`.
2. Observe the persistent **Command Center** dashboard:
   - System connectivity status (`FASTAPI :8000 ONLINE`, canonical memory loaded).
   - Epistemological breakdown: Documented Facts, Analytical Results, and AI Investigative Leads.
   - 3 active cases (`CASE-001`, `CASE-002`, `CASE-003`), 8 entities, 6 evidence files, and 10 topological relationships.

### Step 2: Cases & Investigation Dossiers
1. Click **Cases & Dossiers** in the sidebar.
2. Select **CASE-001 — Operation Vanguard Horizon**.
3. View the classified metadata, lead analyst (`K. Vance`), and correlated entities.
4. Click **Export Dossier** to download the complete case data as structured JSON.
5. Click **Print Summary** to generate a clean, printable intelligence brief.

### Step 3: Interactive Knowledge Graph
1. In the case header, click **Knowledge Graph** (or select **Knowledge Graph** from the sidebar).
2. Explore the interactive 2D canvas with physics simulation.
3. Filter nodes by category (Person, Facility, Vehicle, Digital Asset, Organization).
4. Click node **Alex Mercer (ENT-001)** to inspect direct topological edges, confidence scores, and linked evidence items.

### Step 4: Temporal Reconstruction
1. Click **Timeline Reconstruction** in the sidebar.
2. Filter events by type: `critical`, `anomalous`, or `routine`.
3. Toggle chronological sorting (`Oldest First` vs `Newest First`). Timestamps are never fabricated.
4. Click on **EVT-001** (North perimeter loitering) or **EVT-004** (Gate 4 bypass).
5. Click on the cyan evidence badge **EVD-001** to jump directly to the Evidence Vault.

### Step 5: Evidence Vault & Provenance Verification
1. Review the cryptographic provenance breakdown:
   - **Source Recorded:** Sensor/NVR camera origin.
   - **Calculated Checksum:** SHA-256 bitstream computed by NEXORA.
   - **Verified Reference State:** Matched against canonical ingest benchmark.
   - **Chain of Custody:** Transfer audit trail.
2. Under **Live SHA-256 Integrity Calculator**, enter any payload or file to verify real-time client-side cryptographic hashing.

### Step 6: Investigative AI Copilot
1. Click **AI Copilot** in the sidebar.
2. Check provider telemetry (`Local Gemma 4 E4B Ollama` vs `Google Gemini API`).
3. Click the suggested prompt: **"Summarize the documented timeline."**
4. Observe the grounded answer with:
   - Compulsory evidence citations (`[EVD-001]`, `[EVD-002]`, `[EVD-004]`).
   - Categorized blocks: **Documented Facts**, **Analytical Leads**, and **Investigative Gaps**.
5. Click any citation chip to inspect the record in the Context Inspector.
6. Return to **Cases & Dossiers** to resume investigation.

---

## Epistemological Contract
- **Facts:** Records corroborated by source evidence and verified SHA-256 checksums.
- **Results:** Reproducible findings derived from graph and signal algorithms.
- **Leads:** AI-proposed hypotheses requiring analyst validation. Never auto-committed as truth.

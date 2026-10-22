# NEXORA Development & Setup Guide

This guide walks through configuring, running, and verifying the NEXORA platform locally.

---

## 1. Prerequisites

- **Node.js:** v18.17+ or v20+ / v22+ (verified on Node v24.15)
- **Python:** 3.10+ or 3.11+ (verified on Python 3.11.0)
- **Git:** 2.30+
- **Ollama (Optional for Phase 8+):** For local Gemma 4 E4B inference.

---

## 2. Directory Layout Overview

```text
nexora-intelligence-platform/
├── frontend/             # Next.js TypeScript Web Application
├── backend/              # FastAPI Python Analytical Backend
├── shared/               # Shared Schemas & Generated Type Definitions
├── docs/                 # Architectural Blueprints & Guides
├── .env.example          # Environment template
└── README.md             # Project documentation
```

---

## 3. Quickstart (Independent Services)

### Step 3.1: Environment Setup
Copy the environment template:
```bash
# Windows PowerShell
Copy-Item .env.example .env
```

### Step 3.2: Backend Setup & Launch
Open a terminal in `backend/`:
```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux / macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI development server with auto-reload
python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```

Backend will be available at:
- **API Health:** `http://127.0.0.1:8000/api/v1/health`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc API Documentation:** `http://127.0.0.1:8000/redoc`

### Step 3.3: Frontend Setup & Launch
Open a second terminal in `frontend/`:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Frontend will be available at:
- **Application Shell & Command Center:** `http://localhost:3000`

---

## 4. Verification & Testing

### Running Backend Unit & Contract Tests
From the `backend/` directory with active venv:
```bash
pytest tests/ -v
```

### Running Frontend Production Build Verification
From the `frontend/` directory:
```bash
npm run build
```

---

## 5. Troubleshooting Common Issues

| Symptom | Cause | Resolution |
| :--- | :--- | :--- |
| **API Health Indicator displays Disconnected** | Backend server is not running on port 8000 or CORS origin is mismatched. | Verify backend is running on `127.0.0.1:8000` and `NEXT_PUBLIC_API_URL` points to `http://localhost:8000/api/v1`. |
| **Pydantic ValidationError on startup** | Invalid synthetic dataset JSON or missing schema fields. | Inspect synthetic store fixture files against Pydantic schemas in `app/schemas/`. |
| **PowerShell script execution disabled** | Windows execution policy restricts running venv scripts. | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`. |

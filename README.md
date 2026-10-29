# TruthLens AI — Misinformation Detection & Credibility Analysis Platform

> **"Look closer. Know what to trust."**  
> An explainable AI-powered misinformation detection, linguistic risk auditing, and media credibility platform built with React, Node.js/Express, MongoDB, and Python FastAPI.

---

## 🌟 Executive Summary

**TruthLens AI** is an advanced full-stack SaaS platform designed to detect suspicious rhetorical tactics, sensationalist clickbait, anonymous attribution claims, and viral panic patterns across news articles and social media content. Rather than relying on opaque black-box assertions, TruthLens provides transparent, explainable scoring alongside concrete verification playbooks.

---

## 🏗️ Architecture & Technology Stack

TruthLens AI is architected into three distinct services:

```
TruthLens-AI/
├── client/          # Frontend: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts
├── server/          # Backend: Node.js, Express REST API, Mongoose ORM, JWT, Helmet
├── ai-service/      # AI Service: Python 3.11, FastAPI, Modular Heuristic NLP Engine
├── run-all.ps1      # 1-Click Launch Script (PowerShell)
├── run-all.bat      # 1-Click Launch Script (Windows Batch)
└── README.md        # Comprehensive Documentation
```

### Component Breakdown
| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide React, React Router 6 | Premium SaaS UI/UX (Midnight Navy & Cyan), Score Gauge, Dynamic Charts, Real-time Validation, Skeletons, Notifications |
| **Backend API** | Node.js, Express.js, Mongoose, JWT, bcryptjs, Helmet, Rate-Limit | Authentication, MongoDB CRUD, Aggregation Pipelines for Dashboard Analytics, Fallback NLP Engine |
| **AI Service** | Python 3.11, FastAPI, Uvicorn, Pydantic | Lexical extraction, Regex NLP heuristic auditing, Attributed entity verification, 0–100 calibrated risk scoring |
| **Database** | MongoDB (Local Service or MongoDB Atlas) | Users with hashed passwords, Persistent Analysis Reports, Compound indexes for fast full-text searching |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.11)
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas URI

---

### Option 1: One-Click Launch (Recommended)
You can launch all three microservices simultaneously using either:
- **PowerShell**: Right-click or run `.\run-all.ps1`
- **Windows Command Line / Explorer**: Double-click `run-all.bat`

This opens three dedicated terminal windows hosting the AI service, Backend API, and Frontend dev server.

---

### Option 2: Individual Terminal Launch

#### 1. Start the Python FastAPI AI Microservice (Port 8000)
```powershell
cd ai-service
# Install dependencies (fastapi, uvicorn, pydantic)
python -m pip install -r requirements.txt

# Run service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Check: http://127.0.0.1:8000/health*

#### 2. Start the Express Backend Server (Port 5000)
```powershell
cd server
npm install
npm run dev
```
*API Gateway: http://localhost:5000*  
*Health Check: http://localhost:5000/api/health*

#### 3. Start the Vite React Frontend (Port 5173)
```powershell
cd client
npm install
npm run dev
```
*Frontend Application: http://localhost:5173*

---

## 🔐 Environment Variables

### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/truthlens
JWT_SECRET=truthlens_development_jwt_secret_token_key_2026
AI_SERVICE_URL=http://127.0.0.1:8000
```

### MongoDB Atlas Setup (Cloud Database)
If using MongoDB Atlas instead of a local database:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges under **Database Access**.
3. Allow network access under **Network Access** (Add `0.0.0.0/0` for development).
4. Click **Connect** → **Drivers** and copy your connection string.
5. Replace `MONGO_URI` in `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/truthlens?retryWrites=true&w=majority
   ```

---

## 📋 Comprehensive Feature Checklist

### 1. Landing Page (`/`)
- Hero headline: *"Look closer. Know what to trust."*
- Interactive live preview card showcasing a high-risk claim breakdown.
- One-click presets to test real-world cases instantly.
- 4-card NLP architecture feature grid.
- 3-step operational workflow explanation.
- Frequently Asked Questions accordion.
- Responsible AI ethical disclaimer banner and footer.

### 2. Analysis Workspace (`/analyze`)
- Multi-input card for news articles, social media posts, and controversial claims.
- Optional Title and Source Link inputs.
- Real-time character counter and input validation.
- Animated multi-stage analysis loading states.
- Polished circular SVG **ScoreGauge** with calibrated risk color arcs (Emerald, Amber, Crimson).
- Warning signal cards highlighting exact matched phrases and pedagogical rationales.
- Positive credibility markers acknowledging peer citations and epistemic hedges.
- Domain-tailored practical verification checklists.
- 1-Click "Copy Formatted Report" and "Open Permanent Report" actions.

### 3. Analytics Dashboard (`/dashboard`)
- 4 Real-time KPI Cards: Total Analyses, High-Risk Assessments, Average Risk Score, Low-Risk Baseline.
- **Recharts AreaChart**: 7-Day analysis volume and average risk trends.
- **Recharts DonutChart**: Categorical threat breakdown (Sensationalism, Health Misinformation, Conspiracy, etc.).
- Recent analyses table with direct link to full reports.
- Live system health status badge (MongoDB and AI Microservice connectivity).

### 4. Analysis Details (`/analysis/:id`)
- Dedicated permanent audit report page.
- Complete metadata: Timestamp, Source URL, Category, Score Gauge.
- Original verbatim submitted text.
- Comprehensive Warning & Positive Signal cards.
- Verification instructions checklist.
- Copy plain-text report and Delete record actions (with safety confirmation modal).

### 5. Audit History (`/history`)
- Real-time text search across claim titles and contents.
- Filter by Risk Level (`Low Risk`, `Moderate Risk`, `High Risk`).
- Filter by Category.
- Sorting by Date or Risk Score.
- Responsive pagination controls.
- Delete records with confirmation modal.

### 6. Methodology (`/methodology`)
- Full academic blueprint explaining tokenization, feature extraction, and risk formula.
- Transparent matrix distinguishing **Implemented Features (v1.0)** from **Planned Enhancements (v2.0)**.
- Responsible AI Code of Ethics.

### 7. Authentication (`/login`, `/register`)
- User registration and login screens.
- Passwords hashed with `bcryptjs` salt rounds (never stored in plaintext).
- JSON Web Token (`jwt`) authentication with 30-day persistence in `localStorage`.
- 1-Click **"Fill Demo"** button on the Login page for evaluator convenience.

---

## 📡 API Reference Documentation

### `POST /api/analyses`
Audits content and saves result to MongoDB.
- **Body**:
  ```json
  {
    "title": "Optional headline",
    "content": "Text of the news article or post...",
    "sourceUrl": "https://example.com/source",
    "contentType": "claim"
  }
  ```
- **Response**: Full structured analysis record with `riskScore`, `riskLevel`, `warningSignals`, `metrics`, etc.

### `GET /api/analyses`
Retrieves paginated, filtered analysis records.
- **Query Params**: `page`, `limit`, `riskLevel`, `category`, `search`, `sortBy`, `order`

### `GET /api/analyses/:id`
Retrieves a single permanent analysis report by its ID.

### `DELETE /api/analyses/:id`
Permanently deletes an analysis report.

### `GET /api/dashboard/metrics`
Calculates KPI metrics, category distributions, and 7-day trend series using MongoDB aggregation pipelines.

### `GET /api/health`
Integrated health check reporting server uptime, MongoDB status, and FastAPI microservice connectivity.

### `POST /api/auth/register` & `POST /api/auth/login`
Authentication endpoints issuing JWT tokens and user profiles.

---

## 🛡️ Responsible AI Disclosure

> **IMPORTANT:**  
> The TruthLens Risk Index reflects **linguistic, stylistic, and rhetorical risk markers**.  
> It does **NOT** constitute mathematical proof of falsehood or a real-time factual adjudication.  
> Fabricated claims can be written in sober, academic prose, and authentic urgent news reports can use emotional language. TruthLens AI is designed as a research and verification aid to accompany primary source verification and wire reports.

---

## 👨‍💻 Academic Project Attribution
- **Project**: TruthLens AI
- **Course**: Full-Stack Development (FSD) Capstone
- **Engine**: Modular Python FastAPI + MERN Stack Architecture

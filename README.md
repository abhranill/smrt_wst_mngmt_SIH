# CleanCity 360: Smart Waste Reporting & Municipal Management System
### Smart India Hackathon 2026 Working Prototype

> **Problem Statement Alignment:** Citizen grievance redressing for municipal solid waste, automated visual AI triage, geo-spatial GIS hotspot detection, and transparent end-to-end municipal operational workflows.

---

## 1. Project Overview

**CleanCity 360** is a full-stack, AI-assisted civic technology platform connecting citizens directly with urban municipal corporations (ULBs) for reporting, tracking, and resolving solid waste issues. 

Citizens can capture photographs of overflowing or illegal garbage heaps, drop a pin on an interactive map, obtain an immediate automated AI material classification (e.g., Plastic, Organic/Wet, Paper, Glass, Metal, Mixed), and receive an auditable tracking ID. Municipal officers gain access to a triage control center with GIS spatial mapping, automated hotspot cluster identification, field worker assignment, and photo-verified status tracking.

---

## 2. Key Features

### Citizen Experience
1. **Secure Authentication & Instant Demo Access:** Register as a citizen or use the 1-click Demo Citizen account.
2. **AI-Assisted Report Filing:**
   - Drag-and-drop garbage photograph upload with instant local preview.
   - **Hackathon Sample Presets:** Test image presets (Plastic bottles, Organic kitchen waste, Cardboard boxes, Glass shards, Metal cans, Roadside mixed heap) for immediate offline-safe demonstration.
   - **AI Vision Triage:** Analyzes visual features and suggests category, confidence percentage, color-coded bin advice, and eco-disposal tips.
   - **Citizen Confirmation:** Citizens can verify or override the AI prediction.
3. **Interactive Geo-Location Pin Dropper:**
   - OpenStreetMap & Leaflet interactive map picker.
   - HTML5 GPS location detection ("Use My GPS Location").
   - Quick City Spot presets (Connaught Place, Karol Bagh, Bandra, Indiranagar) for instant testing.
4. **Unique Grievance Tracking:** Generates human-readable tracking IDs (`CC-2026-XXXX`).
5. **Lifecycle Progression Stepper:** Clear 4-stage lifecycle:
   $$\text{Reported} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
6. **Public Tracking & Citizen Dashboard:** Track any complaint without login or review full personal complaint history.

### Municipal / Admin Experience
1. **Operations Triage Dashboard:** Filter complaints by status, waste category, priority, and text search.
2. **Interactive Municipal GIS Map:** Real-time spatial map with status-coded markers (Amber = Reported, Blue = Assigned, Indigo = In Progress, Emerald = Resolved). Clicking markers reveals incident snapshots and inspection links.
3. **Sanitation Worker Assignment:** Assign complaints to specific field workers based on zone, vehicle type (tipper, bio-compost truck, dry recyclable collector), and active task load.
4. **Photo-Proof Status Updates:** Update statuses with official municipal action logs and mandatory photographic resolution evidence.
5. **Spatial Hotspot Detection & Analytics:**
   - Identifies high-density complaint clusters across municipal wards.
   - Computes active backlog, urgent priority ratios, and recommended clearing operations.
   - Visual breakdown by waste category and priority.
   - Average resolution time SLA benchmark (18.4 hours).
6. **Field Worker Directory:** Monitor active task workloads and vehicle fleets across sanitation staff.
7. **Instant Database Reset:** Reseed demo data with 1-click for repeated hackathon demonstrations.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────┐
│               CLEANCITY 360 SYSTEM ARCHITECTURE         │
└────────────────────────────────────────────────────────┘

 [ Citizen Interface ]          [ Municipal Admin Console ]
         │                                   │
         └───────────────┬───────────────────┘
                         │ HTTPS / REST (JSON & FormData)
                         ▼
        ┌───────────────────────────────────┐
        │       Express.js API Server       │
        │       (Port 5000, 0.0.0.0)        │
        └─────────────────┬─────────────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌────────────────────────┐
│ SQLite DB    │   │ AI Vision    │   │ OpenStreetMap Tile CDN │
│ Relational   │   │ Engine       │   │ (Leaflet GIS Engine)   │
│ Schema       │   │ (ViT / Edge) │   └────────────────────────┘
└──────────────┘   └──────────────┘
```

### Flow Breakdown:
1. **Frontend:** Single Page Application (SPA) built with React, Tailwind CSS, Lucide icons, and Leaflet. Built into optimized static bundles and served by Express.
2. **Backend:** Express.js REST API providing modular routing for auth, grievances, AI triage, workers, and analytics.
3. **Database:** Embedded SQLite database (`cleancity.db`) requiring zero external database daemon setup, zero configuration, with relational foreign keys and indices.
4. **AI Vision Classifier:** Dual-engine architecture:
   - External Hugging Face ViT / Google Gemini API (if key configured).
   - Built-in Edge Heuristic Visual Classifier (guaranteed offline demo reliability with 0 latency).
5. **GIS Mapping:** OpenStreetMap tile provider via Leaflet with custom dynamic SVG map pins and coordinate geocoding.

---

## 4. Technology Stack & Decision Rationale

| Layer | Technology | Rationale for SIH 2026 |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | Snappy UI, fast build times, responsive modern aesthetics. |
| **Icons** | Lucide React | Clean, standard civic/dashboard iconography. |
| **Mapping** | Leaflet, OpenStreetMap | 100% Free, no proprietary Google Maps API billing or rate limits. |
| **Backend** | Node.js, Express 5 | Fast asynchronous I/O, beginner-friendly JavaScript stack. |
| **Database** | SQLite 3 | Relational SQL, zero cloud hosting cost, instant local setup. |
| **Auth** | JWT + bcrypt.js | Industry-standard password hashing and stateless token security. |
| **File Uploads** | Multer | Robust multipart file validation (size, MIME type check). |
| **AI Classifier** | ViT & Edge Heuristics | Zero-downtime demo safety with realistic categorization. |

---

## 5. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## 6. Installation & Quick Setup

### Step 1: Clone the repository
```bash
git clone https://github.com/your-team/cleancity-360.git
cd cleancity-360
```

### Step 2: Automated One-Command Setup
From the project root directory, run:
```bash
npm run setup
```
*(This installs backend dependencies, frontend dependencies, and builds the frontend production bundle).*

### Step 3: Configure Environment Variables
Copy the `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```

---

## 7. Environment Variables (`.env.example`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
HOST=0.0.0.0

# Security
JWT_SECRET=cleancity_sih2026_super_secret_jwt_key_secure_token

# Database
DB_PATH=./data/cleancity.db

# Optional External AI API Keys (Leave blank to use built-in Edge Heuristic Classifier)
HUGGINGFACE_API_KEY=
GEMINI_API_KEY=
```

---

## 8. How to Run the Application

### Option A: Unified Full-Stack Mode (Recommended)
This starts the backend on port 5000, which serves both the REST API and the React SPA:
```bash
npm start
```
Open your browser at: **`http://localhost:5000`**

### Option B: Concurrent Development Mode
Run backend and frontend independently for hot-reloading:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
# Starts Express server on http://localhost:5000
```

**Terminal 2 (Frontend with Vite HMR):**
```bash
npm run dev:frontend
# Starts Vite dev server on http://localhost:5173 (proxies /api to 5000)
```

---

## 9. How to Test

Run the automated end-to-end integration test suite:
```bash
npm test
```
The test suite verifies:
- API health check (`/api/health`)
- AI category retrieval & sample preset categorization
- 1-click citizen & admin demo JWT authentication
- Grievance creation with GPS coordinates
- Public complaint tracking by ID (`CC-2026-XXXX`)
- Admin worker assignment & status advancement (`Reported` $\rightarrow$ `Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`)
- Spatial hotspot clustering computation

---

## 10. Default Demo Accounts

For hackathon presentation, click the instant login buttons or use:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@cleancity.gov.in` | `Admin@123` | Shri Rajesh Verma (Zonal Health Officer) |
| **Citizen** | `citizen@cleancity.gov.in` | `Citizen@123` | Priya Sharma |
| **Citizen 2** | `rahul@gmail.com` | `Citizen@123` | Rahul Sen |

---

## 11. Known Limitations & Future Roadmap

1. **AI Model Accuracy:** The current prototype uses a hybrid edge-heuristic and vision feature classifier designed for low-latency demonstration. In a production rollout, fine-tuned YOLOv8 or Mask R-CNN models trained on the TACO (Trash Annotations in Context) dataset should be deployed on a dedicated GPU microservice.
2. **Automated Geocoding:** Offline map markers rely on client coordinates and municipal ward bounding boxes; production systems should integrate with government GIS datasets (NIC / Bhuvan).
3. **SMS / WhatsApp Gateway:** Status updates currently log to the internal audit trail and are displayed in real-time on the citizen timeline; integration with MSG91 or Twilio would enable live SMS notifications to citizens.
4. **Offline Mobile Application:** A native React Native or PWA wrapper with background GPS caching will enable sanitation workers to log cleanups in low-connectivity areas.
#   S m a r t - w a s t e - m a n a g e m e n t -  
 #   s m r t _ w s t _ m n g m t _ S I H  
 
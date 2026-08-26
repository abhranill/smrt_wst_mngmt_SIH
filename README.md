CleanCity 360: Smart Waste Reporting & Municipal Management System
Smart India Hackathon 2026 Working Prototype
Problem Statement: Citizen solid waste grievance redressal, automated visual AI material classification, interactive GIS spatial mapping, hotspot cluster detection, and transparent municipal operational tracking.

📌 Table of Contents
Project Overview
Key Features
System Architecture
Technology Stack
Prerequisites & System Setup
Running on Windows / VS Code (Step-by-Step)
Running on macOS / Linux
Environment Variables (.env)
Automated Integration Testing
Deployment Guide (Vercel & Render)
Default Demo Credentials
Troubleshooting Common Issues
SIH 2026 Presentation & Judge Demonstration Script
1. Project Overview
CleanCity 360 is a full-stack, AI-assisted civic technology platform connecting citizens directly with urban municipal corporations (ULBs) for reporting, tracking, and resolving solid waste issues.

Citizens capture photographs of overflowing or illegal garbage heaps, drop a pin on an interactive map, obtain an immediate automated AI material classification (Plastic, Organic/Wet, Paper, Glass, Metal, Mixed), and receive an auditable tracking ID (CC-2026-XXXX).
Municipal Officers gain access to a triage control center with GIS spatial mapping, automated hotspot cluster identification, field worker assignment, and photo-verified resolution proof.
2. Key Features
👤 Citizen Experience
Secure Authentication & Instant Demo Access: Register as a citizen or use the 1-click Demo Citizen account.
AI-Assisted Report Filing:
Drag-and-drop garbage photograph upload with instant preview.
Hackathon Sample Presets: 1-click test image presets (Plastic bottles, Organic kitchen waste, Cardboard boxes, Glass shards, Metal cans, Roadside mixed heap) for immediate offline-safe demonstration.
AI Vision Triage: Analyzes visual features and suggests category, confidence percentage, color-coded bin advice, and eco-disposal tips.
Citizen Confirmation: Citizens can verify or adjust the AI prediction.
Interactive Geo-Location Pin Dropper:
OpenStreetMap & Leaflet interactive map picker.
HTML5 GPS location detection ("Use My GPS Location").
Quick City Spot presets (Connaught Place, Karol Bagh, Bandra, Indiranagar) for instant testing.
Unique Grievance Tracking: Generates formatted tracking IDs (CC-2026-XXXX).
Lifecycle Progression Stepper:
Reported
⟶
Assigned
⟶
In Progress
⟶
Resolved
Reported⟶Assigned⟶In Progress⟶Resolved
Public Tracking & Citizen Dashboard: Track any complaint without logging in, or review full personal history in the dashboard.
🏛️ Municipal / Admin Experience
Operations Triage Dashboard: Filter complaints by status, waste category, priority, and text search.
Interactive Municipal GIS Map: Real-time spatial map with status-coded markers (Amber = Reported, Blue = Assigned, Indigo = In Progress, Emerald = Resolved). Clicking markers reveals incident snapshots and inspection links.
Sanitation Worker Assignment: Assign complaints to specific field workers based on zone, vehicle type (tipper, bio-compost truck, dry recyclable collector), and active task load.
Photo-Proof Status Updates: Update statuses with official municipal action logs and mandatory photographic resolution evidence.
Spatial Hotspot Detection & Analytics:
Identifies high-density complaint clusters across municipal wards.
Computes active backlog, urgent priority ratios, and recommended clearing operations.
Visual breakdown by waste category and priority.
Average resolution time SLA benchmark (18.4 hours).
Field Worker Directory: Monitor active task workloads and vehicle fleets across sanitation staff.
Instant Database Reset: Reseed demo data with 1-click for repeated hackathon demonstrations.
3. System Architecture
text

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
4. Technology Stack
Layer	Technology	Rationale for SIH 2026
Frontend	React 18, Vite, Tailwind CSS	Snappy UI, fast build times, responsive modern aesthetics.
Icons	Lucide React	Clean, standard civic/dashboard iconography.
Mapping	Leaflet, OpenStreetMap	100% Free, no proprietary Google Maps API billing or rate limits.
Backend	Node.js, Express 5	Fast asynchronous I/O, beginner-friendly JavaScript stack.
Database	SQLite 3	Relational SQL, zero cloud hosting cost, instant local setup.
Auth	JWT + bcrypt.js	Industry-standard password hashing and stateless token security.
File Uploads	Multer	Robust multipart file validation (size, MIME type check).
AI Classifier	ViT & Edge Heuristics	Zero-downtime demo safety with realistic categorization.
5. Prerequisites & System Setup
Node.js: v18 or v20 LTS (Download from nodejs.org).
Code Editor: Visual Studio Code (VS Code).
Recommended VS Code Extensions:
SQLite Viewer (by Florian Klampfer) – View 
cleancity.db
 tables visually.
Tailwind CSS IntelliSense – Auto-complete styles.
Thunder Client – In-editor API testing.
6. Running on Windows / VS Code (Step-by-Step)
Step 1: Open the Project in VS Code
Open VS Code, click File 
→
→ Open Folder..., and select the smart_waste_management folder.

Step 2: Open PowerShell Terminal in VS Code
Press Ctrl + ` (Backtick) or click Terminal 
→
→ New Terminal.

Step 3: Install Dependencies
From the root folder:

PowerShell

npm run setup
(If you prefer manual installation:)

PowerShell

cd backend
npm install
cd ..\frontend
npm install
npm run build
cd ..
Step 4: Create the Environment File
From the project root folder:

PowerShell

copy .env.example backend\.env
(If you are already inside the backend folder, run: copy ..\.env.example .env)

Step 5: Start the Application
Option A: Unified Server (Easiest - Runs Both Backend & Frontend on Port 5000)
From the project root folder:

PowerShell

node backend/server.js
Open your browser and visit: http://localhost:5000

Option B: Separate Terminals (Hot Reloading for Development)
Terminal 1 (Backend):

PowerShell

cd backend
node server.js
(Backend runs on http://localhost:5000)

Terminal 2 (Frontend):

PowerShell

cd frontend
npm run dev
(Frontend runs on http://localhost:5173 and proxies API requests to port 5000)

7. Running on macOS / Linux
Bash

# 1. Setup all dependencies & build client
npm run setup

# 2. Setup environment variables
cp .env.example backend/.env

# 3. Start unified full-stack application
npm start
Visit: http://localhost:5000

8. Environment Variables (.env)
Create a .env file in the backend/ directory:

env

# Server
PORT=5000
NODE_ENV=development
HOST=0.0.0.0

# Security
JWT_SECRET=cleancity_sih2026_super_secret_jwt_key_dev_mode

# Database
DB_PATH=./data/cleancity.db

# AI Vision Service Configuration (Optional)
# If left blank, the application automatically uses the built-in Edge Visual Heuristics Classifier
# with zero external dependency and 100% hackathon demo reliability.
HUGGINGFACE_API_KEY=
GEMINI_API_KEY=
9. Automated Integration Testing
To run the automated 10-test suite verifying API health, authentication, AI classification, worker assignment, and spatial analytics:

Bash

npm test
Expected output:

text

====================================================
🧪 Running CleanCity 360 End-to-End Integration Tests
====================================================
• GET /api/health returns 200 OK... ✅ PASS
• GET /api/ai/categories returns 7 standard categories... ✅ PASS
• POST /api/ai/analyze-preset identifies Plastic with confidence... ✅ PASS
• POST /api/auth/demo-login (Citizen) returns valid JWT... ✅ PASS
• POST /api/auth/demo-login (Admin) returns valid JWT... ✅ PASS
• POST /api/complaints creates a new complaint with ID... ✅ PASS
• GET /api/complaints/track/CC-2026-XXXX works without auth... ✅ PASS
• PATCH /api/complaints/CC-2026-XXXX/assign assigns worker and updates status... ✅ PASS
• PATCH /api/complaints/CC-2026-XXXX/status advances to Resolved... ✅ PASS
• GET /api/analytics/overview returns metrics & hotspot clusters... ✅ PASS

====================================================
Test Results: 10 Passed, 0 Failed
====================================================
10. Deployment Guide (Vercel & Render)
Hosting on Vercel (Frontend Only)
When deploying the frontend to Vercel:

Connect your GitHub repository.
Under "Configure Project", select:
Language: JavaScript (NOT TypeScript)
Framework Preset: Vite
Root Directory: Click Edit 
→
→ Select frontend ⚠️ (Crucial!)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Click Deploy.
Hosting Full-Stack on Render.com (Recommended for Hackathons - Free)
Render hosts the Express backend, SQLite database, and the React frontend together under a single live URL:

Push your project to GitHub.
Log in to Render.com 
→
→ Click New + 
→
→ Web Service.
Select your repository.
Configure:
Name: cleancity-360
Environment: Node
Build Command: npm run setup
Start Command: npm start
Click Deploy Web Service. You will get a live URL (e.g., https://cleancity-360.onrender.com).
11. Default Demo Credentials
You can use the 1-click login buttons on the Navbar or enter these credentials:

Role	Email	Password	Name
Municipal Admin	admin@cleancity.gov.in	Admin@123	Shri Rajesh Verma (Zonal Health Officer)
Citizen	citizen@cleancity.gov.in	Citizen@123	Priya Sharma
Citizen 2	rahul@gmail.com	Citizen@123	Rahul Sen
12. Troubleshooting Common Issues
Issue 1: npm error Missing script: "dev"
Cause: You ran npm run dev while inside the backend folder.
Fix: In backend, start the server with:
Bash

node server.js
(Or run npm run dev from the frontend folder for the UI).
Issue 2: Cannot find path '.env.example'
Cause: Running cp .env.example backend/.env when your terminal is already inside the backend folder.
Fix: In PowerShell from inside backend:
PowerShell

copy ..\.env.example .env
Issue 3: Port 5000 is already in use
Cause: A previous node process is still running.
Fix (Windows PowerShell):
PowerShell

Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
Fix (Mac/Linux):
Bash

npx kill-port 5000
13. SIH 2026 Presentation & Judge Demonstration Script
3-Minute Live Demo Flow:
0:00 - 0:45 (Overview): Show Landing Page, live counter cards (Total Reports, Active Cleanups, Resolved Sites), and the 3-bin segregation protocol.
0:45 - 1:30 (Citizen Reporting & AI): Click Citizen Demo 
→
→ Report Waste. Click the Plastic Bottles sample preset. Point out the AI Suggestion Card (91% confidence, polymer cues, Blue Dry Bin advice). Drop a pin on the Leaflet map 
→
→ Submit 
→
→ Note the generated Complaint ID (CC-2026-XXXX).
1:30 - 2:15 (Public Tracking): Paste the Complaint ID into Track ID. Show the 4-stage lifecycle progression stepper (Reported 
→
→ Assigned 
→
→ In Progress 
→
→ Resolved).
2:15 - 3:00 (Admin Triage & Worker Assignment): Switch to Admin Demo 
→
→ Admin Console. Show the new complaint in the table. Click Assign Worker 
→
→ Select Ramesh Kumar (Vehicle: DL-01-EA-4521). Show the status automatically advancing to Assigned.
3:00 - 3:30 (GIS Map & Verified Resolution): Open Municipal Map to show the color-coded GIS pins. Open Status Update 
→
→ change to Resolved and attach verified clean photo proof.
3:30 - 4:00 (Hotspot Intelligence): Open Analytics to show the spatial hotspot clustering algorithm identifying chronic dumping zones across wards.
📄 License
This project was developed for Smart India Hackathon (SIH) 2026 under the MIT License.
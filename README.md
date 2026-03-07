# 🍽️ Hunger Hotspot Detection System

A full-stack AI-powered web application that maps, analyzes, and responds to hunger hotspots in real time. Built with the MERN stack, it enables citizens to report food insecurity, uses AI to assess severity, and helps NGOs and government bodies take targeted action.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [License](#license)

---

## ✨ Features

### 🗺️ Interactive Map
- View all approved hunger reports on a Leaflet map
- Toggle between **📍 Marker view** and **🔥 Heatmap view**
- DBSCAN-powered **AI cluster markers** highlighting dense hotspots
- Nearby **NGO markers** fetched live from OpenStreetMap (Overpass API)

### 📝 Report Submission
- Submit reports with title, description, location (auto-detect or manual), and severity
- **Image upload** with live preview (stored via Cloudinary)
- **Voice input** using Web Speech API (microphone button on description field)
- AI auto-analysis of severity using **Sarvam AI**
- **Image classification** via TensorFlow MobileNet (identifies food-related content)
- After location capture, nearby NGOs are suggested automatically

### 🤖 AI Chatbot
- Floating chatbot bubble available on every page
- Powered by **Sarvam AI** (`sarvam-m` model)
- Supports **voice input** (SpeechRecognition, en-IN) and **voice output** (SpeechSynthesis)
- Pre-loaded suggestion chips for quick navigation
- Animated typing indicator

### 📊 Government Dashboard (`/gov-dashboard`)
- Monthly trend line chart
- Severity distribution doughnut chart
- Per-district bar chart
- Priority areas ranked list with progress bars
- AI-detected cluster cards

### 🔔 NGO Alerts
- Automatic email alerts sent to all NGO-role users when a **HIGH severity** report is submitted
- Powered by Nodemailer (configurable SMTP)

### 🧠 AI & ML
- Sarvam AI for natural language severity analysis
- TensorFlow.js + MobileNet for image classification (pure JS, Node v24 compatible)
- DBSCAN clustering to detect hunger hotspots automatically

### 🔐 Authentication & Roles
- JWT-based login/register
- Three roles: **User**, **NGO**, **Admin**
- Role-based route protection on both frontend and backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Maps | Leaflet, React-Leaflet, leaflet.heat |
| Charts | Chart.js, react-chartjs-2 |
| Backend | Node.js v24, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| AI | Sarvam AI (sarvam-m), TensorFlow.js, MobileNet |
| Image Storage | Cloudinary, Multer, multer-storage-cloudinary |
| Email | Nodemailer |
| Clustering | density-clustering (DBSCAN) |
| NGO Discovery | OpenStreetMap Overpass API |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---

## 📁 Project Structure

```
Hunger Hotspot Detection System/
├── client/                        # React frontend
│   ├── public/images/
│   └── src/
│       ├── api/api.js             # Axios instance (base URL: localhost:8000/api)
│       ├── components/
│       │   ├── AIChatbot.jsx      # Floating AI chatbot with voice I/O
│       │   ├── navbar.jsx         # Navigation bar with role-based links
│       │   └── ProtectedRoute.jsx # Route guard by role
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx      # User: view own reports
│       │   ├── MapView.jsx        # Interactive map (markers/heatmap/NGOs/clusters)
│       │   ├── ReportForm.jsx     # Submit report with image + voice
│       │   ├── NGODashboard.jsx   # NGO: manage & review reports
│       │   ├── AdminDashboard.jsx # Admin: approve/reject reports
│       │   ├── GovDashboard.jsx   # Government: charts & analytics
│       │   └── Profile.jsx
│       └── utils/fixLeafletIcon.js
│
├── server/                        # Express backend
│   ├── server.js                  # Entry point, route mounting
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js      # Register / Login
│   │   └── chatController.js      # AI chatbot (Sarvam AI)
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access control
│   ├── models/
│   │   ├── User.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js        # All report CRUD + analytics + clusters
│   │   ├── adminRoutes.js
│   │   └── chatRoutes.js          # POST /api/chat
│   ├── services/
│   │   ├── sarvamService.js       # Sarvam AI API wrapper
│   │   ├── imageService.js        # MobileNet image classification
│   │   └── alertService.js        # Nodemailer NGO email alerts
│   └── utils/
│       └── findNearbyNGO.js       # Overpass API + fallback + cache
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ (v24 recommended)
- MongoDB Atlas account
- Sarvam AI API key
- Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Hunger Hotspot detection system"
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server/` folder (see [Environment Variables](#environment-variables)).

### 5. Run the development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

Create `server/.env` with the following:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Sarvam AI  (used for report analysis + chatbot)
SARVAM_API_KEY=your_sarvam_api_key

# Cloudinary  (used for image uploads)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret

# SMTP Email  (optional — for NGO alert emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

> **Tip:** For Gmail SMTP, generate an [App Password](https://myaccount.google.com/apppasswords) and use that as `SMTP_PASS`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Reports
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reports` | ✅ | Submit a new report (with image) |
| GET | `/api/reports` | ✅ | Get all reports (with filters) |
| GET | `/api/reports/public-stats` | ❌ | Public stats for homepage |
| GET | `/api/reports/clusters` | ✅ | DBSCAN hotspot clusters |
| GET | `/api/reports/priority-areas` | ✅ | Top 10 priority locations |
| GET | `/api/reports/analytics` | ✅ | Severity, monthly, per-location data |
| GET | `/api/reports/nearby-ngos` | ✅ | Nearby NGOs by lat/lng |
| POST | `/api/reports/:id/re-analyze` | ✅ Admin | Re-run AI analysis |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/reports` | ✅ Admin | All reports |
| PUT | `/api/admin/reports/:id` | ✅ Admin | Approve / Reject report |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI chatbot |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **User** | Submit reports, view map, use chatbot |
| **NGO** | All user access + NGO dashboard + email alerts |
| **Admin** | All access + admin dashboard + approve/reject reports + government dashboard |

---

## 🗺️ Map Features

- **Markers view** — individual report pins with popups (title, description, AI severity, nearby NGOs)
- **Heatmap view** — density heat overlay (green → yellow → red)
- **NGO markers** — live NGOs from OpenStreetMap shown as blue 🤝 pins
- **Cluster markers** — DBSCAN AI clusters shown as colored circle markers with 🔥 icon and risk level

---

## 📷 Image AI Classification

When a report image is uploaded:
1. Image is stored on **Cloudinary**
2. The public URL is passed to **imageService.js**
3. Image is downloaded and resized to 224×224 via **sharp**
4. **TensorFlow MobileNet** classifies it and returns top predictions
5. Classification labels are saved with the report for reference

---

## 🔊 Voice Features

- **Voice Input** — Click 🎤 in the description field or chatbot to speak your message (uses browser `SpeechRecognition`, best in Chrome/Edge)
- **Voice Output** — Chatbot reads replies aloud via `SpeechSynthesisUtterance`

---

## 📧 NGO Email Alerts

When a report is submitted with **HIGH** severity:
- The system automatically queries all users with the `ngo` role
- An HTML email is dispatched via Nodemailer to each NGO
- Includes report title, location, description, and a view link
- Silently skipped if SMTP env vars are not configured

---

## 🐛 Known Notes

- **MobileNet first load** is slow (~10–30s) since the model downloads on first use after server restart — this is normal
- **Voice features** require Chrome or Edge (Firefox has partial support)
- **Overpass API** for NGO discovery may be slow in areas with poor connectivity — a curated Indian NGO fallback list is used automatically

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ to fight hunger — one report at a time.

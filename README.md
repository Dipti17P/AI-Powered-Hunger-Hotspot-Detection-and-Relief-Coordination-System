# 🍽️ AI-Powered Hunger Hotspot Detection & Relief Coordination System

A full-stack AI-powered web platform that detects, maps, and responds to hunger hotspots in real time. Citizens can report food insecurity, AI automatically assesses severity, and NGOs + government bodies get actionable insights to coordinate relief effectively.

---

## 📌 About the Project

Hunger is a critical issue that often goes unaddressed due to lack of real-time data and poor coordination between citizens, NGOs, and the government. This system bridges that gap by providing:

- A platform for **citizens** to report hunger situations with location, images, and descriptions
- **AI-driven severity analysis** so reports are prioritized automatically
- An **interactive map** that visualizes hunger hotspots across regions
- **NGO dashboards** for on-ground relief coordination
- A **Government analytics dashboard** to support data-driven policy decisions
- An **AI chatbot** for instant guidance and assistance

---

## ⭐ Key Highlights

- 🤖 **Sarvam AI** analyzes report severity in natural language (low / medium / high)
- 🗺️ **Live heatmap** and **DBSCAN clustering** automatically identify the densest hunger zones
- 📸 **TensorFlow MobileNet** classifies uploaded images to verify food-related content
- 🤝 **Real NGO discovery** via OpenStreetMap Overpass API with Indian fallback list
- 📧 **Instant NGO email alerts** when a high-severity report is submitted
- 🎤 **Voice input & output** for accessibility (report by speaking, chatbot speaks back)
- 🔐 **Role-based access** — different dashboards and permissions for Users, NGOs, and Admins
- 📊 **Government Dashboard** with live charts for monthly trends, severity distribution, and district-wise data

---

## ✨ Features

### 🗺️ Interactive Map
- Toggle between **Marker view** and **Heatmap view**
- DBSCAN-powered **AI cluster markers** highlight dense hotspots
- Nearby **NGO markers** fetched live from OpenStreetMap
- Each report popup shows title, description, AI severity level, and nearby NGOs

### 📝 Report Submission
- Submit with title, description, auto-detected or manual location, and severity
- **Image upload** with live preview (stored on Cloudinary)
- **Voice input** via microphone button on description field
- AI auto-analyzes severity on submission
- MobileNet classifies the uploaded image
- Nearby NGOs shown after location is captured

### 🤖 AI Chatbot
- Floating chatbot bubble on every page
- Powered by **Sarvam AI** (sarvam-m model)
- Supports **voice input** and **voice output**
- Suggestion chips for quick help
- Animated typing indicator

### 📊 Government Dashboard
- Monthly trend line chart
- Severity distribution doughnut chart
- Per-district bar chart
- Priority areas ranked list with progress bars
- AI-detected hotspot cluster cards

### 🔔 NGO Alerts
- Auto email to all NGO users when a HIGH severity report is submitted
- HTML email with report details, location, and action link

### 🔐 Authentication & Roles
- JWT-based login / register
- Three roles: **User**, **NGO**, **Admin**
- Protected routes on both frontend and backend

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
| Authentication | JWT, bcryptjs |
| AI / NLP | Sarvam AI (sarvam-m model) |
| Image AI | TensorFlow.js + MobileNet (pure JS, Node v24 compatible) |
| Image Storage | Cloudinary, Multer, multer-storage-cloudinary |
| Email Alerts | Nodemailer |
| Clustering | density-clustering (DBSCAN) |
| NGO Discovery | OpenStreetMap Overpass API |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---



> Built with ❤️ to fight hunger — one report at a time.

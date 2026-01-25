# FarmHelp Platform

**FarmHelp** is an integrated technological ecosystem designed to assist farmers and agricultural administrators. It bridges the gap between traditional farming and modern digital services efficiently.

The project is structured as a monorepo containing a high-performance **FastAPI backend** and a modern **Next.js frontend**.

## 🏗️ System Architecture

The ecosystem consists of two active core modules:

1.  **Backend (`/backend`)**: The central nervous system. It handles data persistence, authentication, business logic, machine learning inferences, and third-party integrations.
2.  **Web Frontend (`/frontendweb`)**: The primary interface for administrators to manage farmers and applications, and for public users to access services.

---

## 📂 Detailed Directory & Route Structure

Below is a visual breakdown of the project structure, mapping files to their specific application Routes and API Endpoints.

```graphql
farmhelp/
├── backend/
│   ├── app/
│   │   ├── main.py                # Server Entry Point
│   │   └── routes/                # 🔌 API ENDPOINTS
│   │       ├── router.py          # central router aggregator
│   │       │
│   │       │   # 🔐 Admin Management
│   │       ├── adminaddfarmerdata.py        → POST /adminaddfarmerdata
│   │       ├── adminfarmerdata.py           → GET  /adminfarmerdata
│   │       ├── adminapplicationfoamdata.py  → GET  /adminapplicationfoamdata
│   │       ├── admincontactfoamdata.py      → GET  /admincontactfoamdata
│   │       ├── verifyadmin.py               → POST /verifyadmin
│   │       │
│   │       │   # 📝 Public Forms
│   │       ├── submitapplicationfoamdata.py → POST /submitapplicationfoamdata
│   │       ├── submitcontactfoamdata.py     → POST /submitcontactfoamdata
│   │       ├── farmerdata.py                → GET  /farmerdata
│   │       │
│   │       │   # 🤖 Features (Demo vs Actual)
│   │       ├── democropprediction.py        → POST /democropprediction
│   │       ├── actualcropprediction.py      → POST /actualcropprediction
│   │       ├── demotwiliocall.py            → GET  /demotwiliocall
│   │       ├── actualtwiliocall.py          → GET  /actualtwiliocall
│   │       ├── demosenserdata.py            → POST /demosenserdata
│   │       └── actualsenserdata.py          → POST /actualsenserdata
│   │
│   └── README.md                  # Backend specific documentation
│
├── frontendweb/
│   ├── src/
│   │   ├── components/            # Reusable UI widgets
│   │   └── app/                   # 🖥️ PAGE ROUTES
│   │       ├── layout.tsx         # Root Layout (Theme, Navbar)
│   │       ├── page.tsx           # / (Home Landing Page)
│   │       ├── about/
│   │       │   └── page.tsx       # /about
│   │       ├── contact/
│   │       │   └── page.tsx       # /contact
│   │       ├── farms/
│   │       │   └── page.tsx       # /farms (Search & List Farms)
│   │       ├── service-centers/
│   │       │   └── page.tsx       # /service-centers
│   │       │
│   │       └── admin/             # 🛡️ Protected Module
│   │           ├── layout.tsx     # Admin Layout
│   │           ├── page.tsx       # /admin (Login/Dashboard)
│   │           ├── activefarmers/
│   │           │   └── page.tsx   # /admin/activefarmers (Edit/View Farmers)
│   │           ├── applicationform/
│   │           │   └── page.tsx   # /admin/applicationform (Track Applications)
│   │           └── contact/
│   │               └── page.tsx   # /admin/contact (View Messages)
│   │
│   └── README.md                  # Frontend specific documentation
│
└── frontendapp/                   # (Placeholder) Future React Native App
```

## 🚀 Unified Quick Start

To run the full stack locally, you will need two terminal instances.

### Step 1: Start the Backend
1. Open a terminal in `/backend`.
2. Sync dependencies: `uv sync`
3. Run dev server: `uv run dev`
   > Server starts at `http://127.0.0.1:8000`

### Step 2: Start the Frontend
1. Open a terminal in `/frontendweb`.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
   > Website access at `http://localhost:3000`

## 🌟 Key Features

-   **Crop Prediction**: Advanced logic to suggest crops based on soil and location.
-   **Real-time Alerts**: Applications submitted via the web instantly notify administrators via Telegram.
-   **Farmer Database**: Centralized storage of farmer profiles with geolocation data.
-   **Responsive Design**: The web dashboard is fully optimized for mobile admin usage.

---
*Created by Khan Mujahid*
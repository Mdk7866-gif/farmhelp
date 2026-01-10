# FarmHelp Backend

The backend system for the FarmHelp application, built with **FastAPI** and **MongoDB**. This project uses **uv** for dependency management and scripts.

## 🚀 Features

- **Admin Management**: Secure endpoints for managing farmers and accessing restricted data.
- **Farmer Data**: Store and retrieve farmer profiles, including geolocation and crop history.
- **Public Forms**: API endpoints for submitting contact forms and application forms.
- **Crop Prediction**: 
  - **Demo Mode**: Simplified prediction logic for testing and demonstration.
  - **Actual Mode**: Integrated logic for real-world prediction (placeholder for advanced ML integration).
- **IoT & Sensors**: Integration points for sensor data ingestion.
- **Integrations**: 
  - **Twilio**: For SMS and automated calls (both demo and actual endpoints available).
  - **Cloudinary**: For media asset management.

## 🛠 Tech Stack

- **Language**: Python 3.13+
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using `motor` async driver)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **Servers**: Uvicorn (ASGI)

## 📂 Project Structure

```
backend/
├── app/
│   ├── db/            # Database connection logic
│   ├── models/        # Pydantic models (Schemas)
│   ├── routes/        # API route handlers
│   │   ├── admin*.py  # Admin-related routes
│   │   ├── actual*.py # Real implementation features
│   │   ├── demo*.py   # Demo implementation features
│   │   └── ...
│   ├── config.py      # App configuration & env vars
│   └── main.py        # Application entry point
├── .env               # Environment variables (gitignored)
├── pyproject.toml     # Project configuration & dependencies
├── uv.lock            # Lockfile for reproducible builds
└── run.py             # Entry script
```

## ⚡ Getting Started

### Prerequisites

- **Python 3.13** or higher.
- **uv** (An extremely fast Python package and project manager).
- **MongoDB** (Running locally or a cloud URI).

### installation

1. **Install `uv`** (if not already installed):
   ```bash
   pip install uv
   ```

2. **Sync Dependencies**:
   Navigate to the backend folder and run:
   ```bash
   uv sync
   ```
   This will create the virtual environment and install all required packages defined in `pyproject.toml`.

### Configuration

Create a `.env` file in the root of the `backend` directory. You can copy the template:

```bash
cp envexample.txt .env
```

**Required Variables**:
- `MONGODB_URI`: Your MongoDB connection string.
- `DATABASE_NAME`: Name of the database to use.
- `FRONTEND_URL`: URL of the frontend (for CORS/Auth).
- `ADMIN_PANEL_PASSWORD`: Password for protecting admin routes.
- **Cloudinary Keys**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Twilio Keys**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.
- **Telegram Keys**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

### ▶️ Running the Server

To start the development server with hot-reload enabled:

```bash
uv run dev
```

- **API URL**: `http://127.0.0.1:8000`
- **Interactive Docs**: `http://127.0.0.1:8000/docs`
- **Alternative Docs**: `http://127.0.0.1:8000/redoc`

> **Note**: The command `uv run dev` maps to `app.main:start` as defined in `pyproject.toml`.

## 📦 API Overview

The API is divided into several modules. Here is a high-level summary:

### Admin
- `/adminaddfarmerdata`: Add new farmer records.
- `/adminfarmerdata`: Retrieve farmer lists.
- `/adminapplicationfoamdata`: Manage submitted applications.
- `/admincontactfoamdata`: View contact form submissions.
- `/verifyadmin`: Verify admin credentials.

### Public/User
- `/submitapplicationfoamdata`: Submit a new application (triggers Telegram alert).
- `/submitcontactfoamdata`: Submit a contact query.

### features
- **Prediction**: `/democropprediction` / `/actualcropprediction`
- **Sensors**: `/demosenserdata` / `/actualsenserdata`
- **Communication**: `/demotwiliocall` / `/actualtwiliocall`

## 🤝 Development

To add new dependencies:
```bash
uv add <package_name>
```

To run linting/checks (if configured inside `pyproject.toml`):
```bash
uv run ruff check .
```

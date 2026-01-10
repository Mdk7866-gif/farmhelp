# FarmHelp Frontend

The modern, responsive frontend for the FarmHelp application, built with **Next.js 16** and **Tailwind CSS 4**. It provides an intuitive interface for farmers to access services and for administrators to manage the platform.

## 🚀 Features

### Public Interface
- **Responsive Design**: Fully responsive layout optimized for mobile and desktop.
- **Dark Mode**: Integrated dark mode support using `next-themes`.
- **Farmer Services**:
  - **Find Farms**: Search and view detailed farmer profiles.
  - **Crop Prediction**: Interactive tool to predict suitable crops based on farm data.
  - **Service Centers**: Locate nearby agricultural service centers.
  - **Forms**: User-friendly forms for contact and application submissions.

### Admin Panel (Restricted)
- **Dashboard**: Centralized hub for platform management.
- **Farmer Management**: 
  - Add new farmers.
  - View "Active Farmers" with advanced filtering and mobile number search.
  - Edit and manage farmer details.
- **Application Tracking**: View and manage submitted applications.
- **Query Management**: Review contact form submissions.
- **Security**: Protected routes requiring admin authentication.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Theme**: `next-themes`

## 📂 Project Structure

```
frontendweb/
├── src/
│   ├── app/
│   │   ├── admin/             # Restricted admin routes
│   │   │   ├── activefarmers/ # List of active farmers
│   │   │   ├── applicationform/ # Application submissions
│   │   │   └── contact/       # Contact queries
│   │   ├── farms/             # Public farm search
│   │   ├── service-centers/   # Service center locator
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── Admin*.tsx         # Admin-specific components
│   │   ├── PredictCrop.tsx    # Crop prediction modal/logic
│   │   └── ...
│   └── globals.css            # Global styles & Tailwind directives
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── .env                       # Environment variables
```

## ⚡ Getting Started

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **npm** or **pnpm** or **yarn** or **bun**

### Installation

1. **Install Dependencies**:
   Navigate to the `frontendweb` directory:
   ```bash
   npm install
   ```

2. **Configuration**:
   Create a `.env` file in the root of `frontendweb`:
   ```bash
   cp envexample.txt .env
   ```
   
   **Required Variable**:
   - `NEXT_PUBLIC_BACKEND_URL`: URL of your running backend API (e.g., `http://127.0.0.1:8000`).

### ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

- **Local URL**: `http://localhost:3000`

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 🎨 UI/UX Highlights

- **Dynamic Components**: Interactive cards, modals (Popups), and smooth transitions.
- **Pagination**: Custom pagination for navigating large datasets.
- **Toast Notifications**: User feedback for successful form submissions or errors.

## 🤝 Contribution

1. Ensure the **Backend** is running.
2. Check `eslint.config.mjs` for linting rules.
3. Run `npm run lint` before committing changes.

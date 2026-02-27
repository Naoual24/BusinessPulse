# BusinessPulse

BusinessPulse is a production-ready intelligent analytics SaaS platform designed for small and medium businesses. It transforms static Excel/CSV sales data into dynamic dashboards, accurate forecasts, and actionable business insights.

## 🚀 Key Features

- **JWT Authentication**: Secure signup and login flow.
- **Smart Data Upload**: Support for CSV and Excel files.
- **Dynamic Column Mapping**: Map your file columns to the system's fields seamlessly.
- **Adaptive Dashboard**: Interactive visualizations for sales trends, top products, and KPIs.
- **AI-Powered Forecasting**: Predictive analytics for the next 30 days using Linear Regression.
- **Intelligent Recommendations**: High-level business suggestions based on statistical analysis.

## 🛠️ Tech Stack

- **Backend**: Python FastAPI, SQLAlchemy, Pandas, Scikit-learn.
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Recharts.
- **Database**: PostgreSQL.
- **DevOps**: Docker & Docker Compose.

## 📦 Getting Started

### Prerequisites

- Docker and Docker Compose installed.

### Installation & Run

#### Option 1: Docker (Preferred)

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd pie-vampire
   ```

2. **Run with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

Or run `run.bat`.

#### Option 2: Local Run (No Docker)

If you don't have Docker, use the automated local setup:

1. Make sure **Python** and **Node.js** are installed.
2. Run `run_local.bat`.

This will set up the virtual environment, install all dependencies, and start both the backend and frontend servers. It uses **SQLite** automatically if PostgreSQL is not found.

1. **Access the platform**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure

```text
├── backend/            # FastAPI Backend
│   ├── app/
│   │   ├── api/        # Routes
│   │   ├── core/       # Config, Security, DB
│   │   ├── models/      # SQLAlchemy Models
│   │   ├── schemas/     # Pydantic Schemas
│   │   └── services/    # Business Logic (Pandas/Sklearn)
│   └── requirements.txt
├── frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages & Layouts
│   │   ├── components/ # Reusable UI
│   │   └── lib/        # API Client
│   └── tailwind.config.js
├── data/               # Example datasets
├── uploads/            # Secure file storage
└── docker-compose.yml
```

## 🔐 Environment Variables

The default development setup works out of the box with Docker. For production, update the environment variables in `docker-compose.yml`:

- `SECRET_KEY`: Long random string for JWT signing.
- `DATABASE_URL`: Connection string for PostgreSQL.

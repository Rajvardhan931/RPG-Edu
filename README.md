# SkillQuest - AI-Powered Adaptive Learning RPG

SkillQuest is an adaptive, skill-based education platform that converts learning into real-world capability using RPG mechanics.

## 🚀 Technology Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Flask (Python)
- **Database & Auth:** Supabase (Managed Postgres)
- **Communication:** REST API (JSON)

## 🏗️ High-Level Architecture

The project follows a decoupled full-stack architecture:
- **Experience Layer (Client):** Handles the RPG UI and Skill Tree visualizations.
- **Intelligence Layer (Server):** Manages the AI Navigator, Adaptive Engine, and XP logic.
- **Data Layer (Supabase):** Stores user profiles, skill ledgers, and content hierarchies.

## 📂 Directory Structure

```text
skillquest/
├── client/                # Next.js Frontend
│   ├── app/              # Pages & Layouts
│   ├── components/       # UI Components
│   └── lib/              # API Client
├── server/                # Flask Backend
│   ├── app/              # Core Logic
│   │   ├── api/          # Route Handlers
│   │   ├── services/     # Business Logic
│   │   ├── repositories/ # Data Access
│   │   ├── models/       # Data Schemas
│   │   └── utils/        # Configuration
│   ├── tests/            # Test Suite
│   └── run.py            # Entry Point
└── docs/                 # Architecture & Documentation
```

## 🛠️ How to Run (Skeletal)

### Backend
1. Navigate to `server/`
2. Create virtual environment: `python -m venv .venv`
3. Activate: `.venv\Scripts\activate` (Windows)
4. Install: `pip install -r requirements.txt`
5. Run: `python run.py`

### Frontend
1. Navigate to `client/`
2. Install: `npm install`
3. Run: `npm run dev`

## 🗺️ Future Implementation
Detailed implementation steps are defined in `architecture.txt`.

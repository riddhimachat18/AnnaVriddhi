# Farm Revenue Copilot

An AI-powered copilot that helps farmers maximise crop revenue through smart recommendations, scheme matching, and real-time monitoring.

---

## Project Structure

```
farm-revenue-copilot/
├── frontend/      React app (Vite)
├── backend/       Node/Express API server
├── shared/        Shared types & API contract schemas
├── docs/          Product spec, UI spec, API contract
└── scripts/       Seed & utility scripts
```

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A running PostgreSQL (or MongoDB) instance
- (Optional) Redis for job queuing

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd farm-revenue-copilot

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy each `.env.example` and fill in real values:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Seed demo data (optional — for pitch / dev)

```bash
node scripts/seed-demo-data.js
```

---

## Running locally

### Backend

```bash
cd backend
npm run dev        # starts Express server on PORT (default 4000)
```

### Frontend

```bash
cd frontend
npm run dev        # starts Vite dev server on http://localhost:5173
```

---

## Key scripts

| Location | Command | Purpose |
|---|---|---|
| `backend/` | `npm run dev` | Dev server with hot reload |
| `backend/` | `npm start` | Production server |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | Production build |
| `scripts/` | `node seed-demo-data.js` | Populate DB with demo data |

---

## Environment variables reference

See `docs/api-contract.md` for full API documentation and `.env.example` files for required variables.

# AI Project Architect

> Transform vague software ideas into AI-ready blueprints through an adaptive interview.

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — add your GOOGLE_API_KEY or OPENAI_API_KEY

pip install -r requirements.txt
# Ativar o ambiente virtual (Windows)
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### 3. Open http://localhost:5173 — register, create a project, start the interview!

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Groq API key (free at console.groq.com/keys) | — |
| `SECRET_KEY` | JWT signing secret | — |
| `DATABASE_URL` | SQLAlchemy DB URL | `sqlite+aiosqlite:///./dev.db` |
| `DEBUG` | Enable debug mode and /docs | `false` |

---

## Architecture

```
frontend/          React + Vite + Tailwind + Zustand
backend/
  api/             FastAPI routers (auth, projects, generation, websocket)
  services/        Business logic (interview, blueprint, prompts, analysis)
  ai/              LangChain chains (interview, blueprint, prompt, analysis, extraction)
  models/          SQLAlchemy ORM models
  schemas/         Pydantic schemas
  core/            Config, auth, database
```

## Features

- **AI Interview Engine** — adaptive conversation extracts your project requirements
- **Blueprint Generator** — full technical blueprint in Markdown (architecture, DB, roadmap)
- **Prompt Pipeline** — step-by-step prompts optimized for Claude Code, Cursor, Lovable, GPT
- **Complexity Analysis** — dev time estimates, team size, similar products, monetization ideas
- **WebSocket Streaming** — real-time token streaming for natural conversation feel

## Deployment

- **Backend**: Railway, Render, or Fly.io — `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend**: Vercel or Netlify — set `VITE_API_URL` and `VITE_WS_URL` env vars
- **Database**: Switch to PostgreSQL by changing `DATABASE_URL` to a Postgres connection string

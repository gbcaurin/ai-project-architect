# 🏗️ Curio AI

> Transforme ideias vagas de software em blueprints técnicos completos através de uma entrevista adaptativa com IA.

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-AI-1C3C3C?style=flat&logo=chainlink&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ O que é?

O **Curio AI** é uma aplicação full stack que conduz o usuário por uma **entrevista adaptativa com IA** para extrair os requisitos de um projeto de software e gerar automaticamente:

- 📄 **Blueprint técnico** em Markdown (arquitetura, banco de dados, roadmap)
- 🤖 **Prompts prontos** otimizados para Claude Code, Cursor, Lovable, GPT e Gemini
- 📊 **Análise de complexidade** com estimativa de tempo, tamanho de equipe, produtos similares e modelos de monetização

---

## 🚀 Stack

| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React · Vite · TypeScript · Tailwind CSS · Zustand |
| **Backend** | Python · FastAPI · LangChain · SQLAlchemy · Pydantic |
| **IA** | Groq API (LLaMA) · LangChain Chains |
| **Banco de Dados** | SQLite (dev) · compatível com PostgreSQL |
| **Comunicação** | REST API · WebSocket (streaming de tokens) |
| **Auth** | JWT |

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Python 3.12+
- Node.js 18+
- Chave da [Groq API](https://console.groq.com/keys) (gratuita)

---

### 1. Backend

```bash
cd backend
```

**Criar e ativar ambiente virtual**
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Mac/Linux
python -m venv venv
source venv/bin/activate
```

> ⚠️ Windows: se der erro de permissão, rode antes:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Instalar dependências**
```bash
pip install -r requirements.txt
```

**Configurar variáveis de ambiente**
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Abra o `.env` e preencha:
```env
GROQ_API_KEY=sua_chave_aqui
SECRET_KEY=qualquer-string-aleatoria
DATABASE_URL=sqlite+aiosqlite:///./dev.db
DEBUG=true
```

**Rodar o servidor**
```bash
uvicorn main:app --reload --port 8000
```

---

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # ou copy no Windows
npm run dev
```

Acesse **http://localhost:5173** — crie uma conta, abra um projeto e inicie a entrevista!

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|:-----------:|
| `GROQ_API_KEY` | Chave da API Groq — [obter aqui](https://console.groq.com/keys) | ✅ |
| `SECRET_KEY` | String aleatória para assinatura JWT | ✅ |
| `DATABASE_URL` | URL SQLAlchemy — padrão: SQLite local | ❌ |
| `DEBUG` | Ativa modo debug e rota `/docs` | ❌ |

---

## 🏗️ Arquitetura do Projeto

```
ai-project-architect/
├── frontend/               # React + Vite + Tailwind + Zustand
└── backend/
    ├── api/                # Rotas FastAPI (auth, projects, generation, websocket)
    ├── ai/                 # Chains LangChain (interview, blueprint, prompt, analysis)
    ├── models/             # Models SQLAlchemy
    ├── schemas/            # Schemas Pydantic
    └── core/               # Config, auth, database
```

---

## 🐛 Problemas Conhecidos

**Erro 429 — quota excedida (Groq)**
> Gere uma nova chave em https://console.groq.com/keys e atualize o `.env`.

**Warning `Core Pydantic V1 functionality isn't compatible with Python 3.14`**
> Apenas um aviso, não afeta o funcionamento. Use Python 3.12 para eliminar.

**`Extra inputs are not permitted` ao subir o backend (Windows)**
> Verifique se o arquivo `.env` foi criado corretamente e não contém espaços ao redor do `=`.

---

## 👨‍💻 Autor

**Gabriel Caurin de Souza**
**Gabriel Santucci de Novaes**
**Enrico Locateli Costa**

---

*Projeto desenvolvido como parte de Hackathon.*

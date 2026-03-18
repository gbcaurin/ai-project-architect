# AI Project Architect
> Transforme ideias vagas de software em blueprints técnicos completos através de uma entrevista adaptativa com IA.

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
```

**Criar o ambiente virtual com Python 3.12 (apenas na primeira vez)**
```bash
# Windows
python -m venv venv

# Mac/Linux
python -m venv venv
```

**Ativar o ambiente virtual**
```bash
# Windows
.\venv\Scripts\Activate.ps1

# Se der erro de permissão no Windows, rode antes:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Mac/Linux
source venv/bin/activate
```

**Instalar dependências (apenas na primeira vez)**
```bash
pip install -r requirements.txt
```

**Criar o arquivo .env**

Copie o arquivo de exemplo e preencha os valores:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Abra o `.env` no VSCode e preencha:
```env
GROQ_API_KEY=sua_chave_aqui
SECRET_KEY=qualquer-string-aleatoria-aqui
DATABASE_URL=sqlite+aiosqlite:///./dev.db
DEBUG=true
```

> Para obter sua `GROQ_API_KEY` gratuitamente: https://console.groq.com/keys

> ⚠️ **Windows**: Se após preencher o `.env` o backend não subir com erro de `Extra inputs are not permitted`, veja a seção de problemas conhecidos abaixo.
**Verificar se o .env foi criado corretamente**

**Rodar o servidor**
```bash
uvicorn main:app --reload --port 8000
```

---

### 2. Frontend
```bash
cd frontend
```

**Instalar dependências (apenas na primeira vez)**
```bash
npm install
```

**Criar o .env**
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Iniciar o servidor**
```bash
npm run dev
```

Abre em http://localhost:5173

---

### 3. Acesse http://localhost:5173 — crie uma conta, abra um projeto e inicie a entrevista!

---

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `GROQ_API_KEY` | Chave da API Groq (gratuita em console.groq.com/keys) | — |
| `SECRET_KEY` | Segredo para assinatura JWT — coloque qualquer string aleatória | — |
| `DATABASE_URL` | URL do banco SQLAlchemy | `sqlite+aiosqlite:///./dev.db` |
| `DEBUG` | Ativa modo debug e rota /docs | `false` |

---

## 🐛 Problemas Conhecidos e Soluções

### LLM retorna erro 429 — quota excedida
**Causa**: Cota gratuita do Groq atingida.
**Solução**: Gere uma nova chave em https://console.groq.com/keys e atualize o `.env`.

### Aviso `Core Pydantic V1 functionality isn't compatible with Python 3.14`
Apenas um warning, não quebra o funcionamento. Para eliminar definitivamente, use Python 3.12.

---

## 🏗️ Arquitetura
```
frontend/          React + Vite + Tailwind + Zustand
backend/
  api/             Rotas FastAPI (auth, projects, generation, websocket)
  ai/              Chains LangChain (interview, blueprint, prompt, analysis, extraction)
  models/          Models SQLAlchemy
  schemas/         Schemas Pydantic
  core/            Config, auth, database
```

---

## ✨ Features

- **Motor de Entrevista IA** — conversa adaptativa que extrai os requisitos do seu projeto
- **Gerador de Blueprint** — blueprint técnico completo em Markdown (arquitetura, DB, roadmap)
- **Pipeline de Prompts** — prompts passo a passo otimizados para Claude Code, Cursor, Lovable e GPT
- **Análise de Complexidade** — estimativa de tempo, tamanho de equipe, produtos similares e modelos de monetização
- **Streaming WebSocket** — streaming de tokens em tempo real para uma conversa natural

---

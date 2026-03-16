# AI Project Architect
> Transforme ideias vagas de software em blueprints técnicos completos através de uma entrevista adaptativa com IA.

---

## ⚠️ Requisitos

- **Python 3.12** — versões mais novas (3.13+) causam incompatibilidades com SQLAlchemy e Pydantic
- **Node.js 18+**

> Para verificar sua versão do Python: `python --version`
> Para baixar o Python 3.12: https://www.python.org/downloads/release/python-31210/

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
```

**Criar o ambiente virtual com Python 3.12 (apenas na primeira vez)**
```bash
# Windows
py -3.12 -m venv venv

# Mac/Linux
python3.12 -m venv venv
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

### Backend não sobe — erro no SQLAlchemy ou Pydantic
**Causa**: Python 3.13 ou 3.14 tem incompatibilidades com essas libs.
**Solução**: Use Python 3.12. Recrie o venv com `py -3.12 -m venv venv`.

### Erro `Extra inputs are not permitted` no Settings
**Causa**: O arquivo `.env` tem encoding errado ou falta quebra de linha entre variáveis — geralmente causado por copiar o arquivo de outra máquina.
**Solução**: Delete o `.env` e crie novamente pelo terminal PowerShell usando o comando `Out-File` mostrado acima.

### Erro `bcrypt` — `module has no attribute '__about__'`
**Causa**: Versão incompatível do bcrypt com passlib.
**Solução**:
```bash
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

### Erro CORS — `No 'Access-Control-Allow-Origin' header`
**Causa**: O `allow_origins=["*"]` com `allow_credentials=True` é inválido pelo padrão CORS.
**Solução**: Use a origem exata no `main.py`:
```python
allow_origins=["http://localhost:5173"]
```

### LLM retorna erro 429 — quota excedida
**Causa**: Cota gratuita do Groq atingida.
**Solução**: Gere uma nova chave em https://console.groq.com/keys e atualize o `.env`.

### LLM retorna `404 NOT_FOUND` para modelo Gemini
**Causa**: Modelo `gemini-1.5-flash` descontinuado.
**Solução**: Use `gemini-2.0-flash` no `ai/llm_factory.py` — ou mude para Groq conforme configurado neste projeto.

### Aviso `Core Pydantic V1 functionality isn't compatible with Python 3.14`
Apenas um warning, não quebra o funcionamento. Para eliminar definitivamente, use Python 3.12.

### Frontend — token perdido ao atualizar a página
O token é salvo no `localStorage` mas o objeto `user` some após refresh. Resolvido no `App.tsx` com chamada ao `/api/auth/me` na inicialização.

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

## 🚢 Deploy

- **Backend**: Railway, Render ou Fly.io — `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend**: Vercel ou Netlify — configure `VITE_API_URL` e `VITE_WS_URL` nas variáveis de ambiente
- **Banco de dados**: Troque para PostgreSQL alterando `DATABASE_URL` para uma connection string Postgres

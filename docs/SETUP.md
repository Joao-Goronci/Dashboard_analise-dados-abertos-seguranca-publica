# Setup - Guia de Configuração

## Requisitos

- Node.js: 18+ (LTS recomendado) — para o frontend
- npm: 9+ ou pnpm: 8+
- Python: 3.10+ — para o backend (FastAPI / uvicorn)
- Git: Para clonar o repositório

### Verificar Versões

```bash
node --version
npm --version
python --version
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd Dashboard_analise-dados-abertos-seguranca-publica
```

### 2. Instale as dependências

Frontend (Node):

```bash
npm install
```

Backend (Python):

```bash
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate

pip install -r packages/backend/requirements.txt
```

Alternativa com pnpm (frontend):

```bash
pnpm install
```

---

## Configuração de Ambiente

### Frontend

```bash
cd packages/frontend
copy .env.example .env.local    # Windows
# or
cp .env.example .env.local      # macOS / Linux
```

Valores típicos em `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Dashboard - Segurança Pública ES
VITE_ENVIRONMENT=development
```

### Backend (Python / FastAPI)

```bash
cd packages/backend
copy .env.example .env.local    # Windows
# or
cp .env.example .env.local      # macOS / Linux
```

Valores típicos em `.env.local`:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DATA_PATH=./src/data
LOG_LEVEL=info
```

---

## Iniciar o servidor de desenvolvimento

Opções para desenvolvimento local:

- Frontend apenas:

```bash
npm run dev:frontend
```

Acesse: http://localhost:5173

- Backend apenas:

```bash
npm run dev:backend
```

API: http://localhost:3001/api

- Frontend + Backend (duas janelas):

Abra dois terminais e rode os comandos acima separadamente.

- Frontend + Backend (um comando, usando `concurrently`):

```bash
npx concurrently "npm:dev:frontend" "npm:dev:backend"
```

> Observação: o repositório contém `concurrently` como devDependency na raiz; use `npx` se não quiser instalar globalmente.

---

## Verificação

- Health check do backend:

```bash
curl http://localhost:3001/api/health
```

Resposta esperada (exemplo):

```json
{ "status": "ok" }
```

- Abra o frontend e verifique chamadas a `/api/*` nas DevTools do navegador.

---

## Build para produção

- Frontend:

```bash
npm run build:frontend
```

Arquivos de build: `packages/frontend/dist/`

- Backend:

O backend é uma aplicação Python; não há build JavaScript — para produção execute com um ASGI server (uvicorn/gunicorn) apontando para `src.main:app`.

---

## Scripts úteis (raiz)

```bash
npm run dev              # Inicia frontend (Vite)
npm run dev:frontend    # Inicia apenas frontend
npm run dev:backend     # Inicia apenas backend (uvicorn)
npm run build           # Build de ambos (frontend)
npm run build:frontend  # Build do frontend
npm run build:backend   # Build do backend (placeholder)
```

---

## Troubleshooting

- Porta em uso: verifique processos e mate o PID ou altere `PORT` em `.env.local`.

- Backend não inicia: ative o ambiente virtual e instale `requirements.txt`.

- Frontend não conecta ao backend: confirme `VITE_API_BASE_URL` e `CORS_ORIGIN`.

- Windows: use caminhos e comandos conforme exemplos (copy / .\\.venv\\Scripts\\activate).

---

## Próximos passos

1. Ajustar `.env.local` conforme ambiente
2. Rodar frontend e backend e validar endpoints
3. Consultar `docs/API.md` para lista de endpoints disponíveis

---

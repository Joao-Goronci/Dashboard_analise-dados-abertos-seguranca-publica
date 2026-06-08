# Setup - Guia de Configuração

## Requisitos

- Node.js 18+ (LTS recomendado)
- npm 9+
- Python 3.10+
- Git

### Verificar versões

```bash
node --version
npm --version
python --version
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/LuizHelio-Fim/Dashboard_analise-dados-abertos-seguranca-publica
cd Dashboard_analise-dados-abertos-seguranca-publica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o backend

```bash
cd packages/backend
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env.local
```

### 4. Configure o frontend

```bash
cd ../../packages/frontend
npm install
```

> O frontend não depende de `.env.example` no repositório, mas usa `http://localhost:3001/api` como base padrão.

---

## Executar localmente

### Backend

```bash
cd packages/backend
npm run dev
```

ou

```bash
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 3001
```

### Frontend

```bash
cd packages/frontend
npm run dev
```

### Backend + Frontend

Abra dois terminais e execute:

- `npm run dev:backend`
- `npm run dev:frontend`

---

## Scripts úteis no workspace

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o frontend |
| `npm run dev:frontend` | Inicia o frontend |
| `npm run dev:backend` | Inicia o backend |
| `npm run build` | Build do frontend via workspaces |
| `npm run build:frontend` | Build do frontend |

> O backend é uma aplicação Python, por isso não há build JavaScript para ele.

---

## Verificação

- Health check:

```bash
curl http://localhost:3001/api/health
```

Resposta esperada:

```json
{ "status": "ok" }
```

- Frontend:

Abra `http://localhost:5173` no navegador.

---

## Troubleshooting

- Porta em uso: verifique processos nas portas `3001` ou `5173`.
- Backend não inicia: ative o ambiente virtual e confirme a instalação dos requisitos.
- Frontend não conecta: valide a API e o CORS na configuração do backend.
- Arquivo CSV ausente: verifique `packages/backend/src/data/processed/`.

---

## Observações para consulta

- O backend não faz filtros dinâmicos por query string; ele serve arquivos processados.
- Se for preciso ajustar dados, revise `packages/backend/src/data/preprocessing/load_data.py`.

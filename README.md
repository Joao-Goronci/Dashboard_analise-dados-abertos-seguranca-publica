# Dashboard de Segurança Pública — Espírito Santo 2025

Painel interativo para análise dos dados abertos da segurança pública do Espírito Santo. O repositório reúne frontend React/Vite, backend FastAPI e pipeline de dados em CSV.

## O que este projeto entrega
- Visualizações de indicadores de crime por município, período do dia e perfil de vítimas
- API local que retorna dados processados em JSON
- Pipeline de qualidade de dados para limpar e agrupar registros brutos
- Documentação para instalação, arquiteura e origem dos dados

## Estrutura do repositório
- `packages/frontend/` — aplicação React + Vite + Recharts
- `packages/backend/` — API FastAPI e serviço de dados em Python
- `packages/backend/src/data/raw/CSVs/` — dados brutos de origem
- `packages/backend/src/data/processed/` — artefatos CSV processados usados pela API
- `docs/` — documentação de uso, API, arquitetura e origem dos dados

## Documentação recomendada
- `docs/SETUP.md` — instruções de instalação e execução local
- `docs/API.md` — endpoints disponíveis e exemplos de consulta
- `docs/ARQUITETURA.md` — visão de arquitetura e pontos de extensão
- `docs/ORIGEM_DADOS.md` — origem dos dados, auditoria de qualidade e limitações

## Como iniciar rapidamente
```bash
git clone <repository-url>
cd Dashboard_analise-dados-abertos-seguranca-publica
npm install
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate
pip install -r packages/backend/requirements.txt
```

### Executar o backend
```bash
cd packages/backend
copy .env.example .env.local
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 3001
```

### Executar o frontend
```bash
cd packages/frontend
npm run dev
```

### Executar em paralelo
Abra dois terminais ou use os scripts do workspace:
```bash
npm run dev:backend
npm run dev:frontend
```

## Scripts principais
- `npm run dev` — inicia o frontend (`packages/frontend`)
- `npm run dev:frontend` — inicia o frontend
- `npm run dev:backend` — inicia o backend
- `npm run build` — build do frontend via workspaces
- `npm run build:frontend` — build do frontend

> O backend roda como aplicação Python/ASGI; não há etapa de "build" JavaScript para o backend.

## O que um time de consulta deve priorizar
1. `packages/backend/src/data/preprocessing/load_data.py` — lógica de limpeza e transformação de dados
2. `packages/backend/src/routes/dashboard_routes.py` — endpoints expostos pela API
3. `packages/backend/src/services/dashboard_data_service.py` — conexão entre CSVs processados e resposta JSON
4. `packages/frontend/src/utils/dashboardTransforms.js` — regras de agregação usadas pelos gráficos
5. `packages/frontend/src/pages/` — páginas que consomem as séries e montam as visualizações

## Notas importantes
- A API local está em `http://localhost:3001/api`
- O frontend local está em `http://localhost:5173`
- Dados brutos vêm de CSVs em `packages/backend/src/data/raw/CSVs/`
- Artefatos processados ficam em `packages/backend/src/data/processed/`
- Consulte `docs/ORIGEM_DADOS.md` antes de interpretar regras de exclusão ou qualidade

## Homenagem
Este projeto também presta homenagem ao Bernardo Augusto Lodi, lembraremos sempre de você, que descanse em paz.

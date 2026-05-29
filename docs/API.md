# API REST - Dashboard de Segurança Pública

## Base URL

```
http://localhost:3001/api
```

---

## Endpoints principais

- GET `/api/health`
  - Health check básico. Retorna `{ "status": "ok" }`.

- GET `/api/dashboard`
  - Bundle com dados principais do dashboard (KPIs, charts e resumos).

- GET `/api/kpis/home`
  - KPIs para a página inicial do dashboard.

- GET `/api/analytics/crimes-por-mes`
  - Série temporal de crimes por mês.

- GET `/api/analytics/crimes-por-municipio`
  - Distribuição de crimes por município.

- GET `/api/analytics/crimes-por-periodo`
  - Dados agregados por período (ex.: semestre/ano).

- GET `/api/analytics/top-bairros`
  - Lista de bairros com maior incidência.

- GET `/api/analytics/comparativo-furto-roubo`
  - Comparativo entre furtos e roubos (por período/região).

- GET `/api/analytics/objetos-mais-roubados`
  - Lista de objetos mais roubados/furtados.

- GET `/api/analytics/perfil-vitimas`
  - Perfil das vítimas (quando disponível nos dados).

- GET `/api/analytics/crimes-digitais-evolucao`
  - Evolução de crimes digitais ao longo do tempo.

- GET `/api/datasets/fact-ocorrencias`
  - Retorna o dataset de ocorrências (CSV carregado/transformado) em JSON.

---

## Exemplos com cURL

```bash
# Health
curl http://localhost:3001/api/health

# Dashboard bundle
curl http://localhost:3001/api/dashboard

# KPIs home
curl http://localhost:3001/api/kpis/home

# Crimes por mês
curl http://localhost:3001/api/analytics/crimes-por-mes

# Dataset de ocorrências
curl http://localhost:3001/api/datasets/fact-ocorrencias
```

---

## Notas

- O backend expõe um prefixo `/api` (via `APIRouter`).
- Os dados são carregados a partir de CSVs em `packages/backend/src/data/` e processados em memória (veja `services/dashboard_data_service.py`).
- Se precisar de endpoints adicionais (ex.: filtros por período/região), consulte e estenda `packages/backend/src/routes/dashboard_routes.py` e os services correspondentes.

---

## Erros e códigos HTTP

- `200 OK` — Sucesso
- `400 Bad Request` — Requisição inválida
- `404 Not Found` — Recurso não encontrado
- `500 Internal Server Error` — Erro do servidor

Formato de erro comum:

```json
{ "error": "Descrição do erro" }
```

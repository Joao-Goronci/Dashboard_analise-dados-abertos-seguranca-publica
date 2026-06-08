# API REST - Dashboard de Segurança Pública

## Base URL

```text
http://localhost:3001/api
```

---

## Endpoints principais

- `GET /api/health`
  - Retorna `{ "status": "ok" }`.

- `GET /api/dashboard`
  - Bundle completo com os principais dados do dashboard.
  - Retorna um objeto com chaves como `kpisHome`, `crimesPorMes`, `crimesPorMunicipio`, `perfilVitimas`, etc.

- `GET /api/kpis/home`
  - Retorna o primeiro registro de `kpis_home.csv`.

- `GET /api/analytics/crimes-por-mes`
  - Retorna a série mensal de crimes em `crimes_por_mes.csv`.

- `GET /api/analytics/crimes-por-municipio`
  - Retorna ranking de municípios em `crimes_por_municipio.csv`.

- `GET /api/analytics/crimes-por-periodo`
  - Retorna dados agregados por período do dia em `crimes_por_periodo.csv`.

- `GET /api/analytics/top-bairros`
  - Retorna top de bairros em `top_bairros.csv`.

- `GET /api/analytics/comparativo-furto-roubo`
  - Retorna comparativo de furtos e roubos em `comparativo_furto_roubo.csv`.

- `GET /api/analytics/objetos-mais-roubados`
  - Retorna objetos mais roubados/furtados em `objetos_mais_roubados.csv`.

- `GET /api/analytics/perfil-vitimas`
  - Retorna perfil de vítimas em `perfil_vitimas.csv`.

- `GET /api/analytics/crimes-digitais-evolucao`
  - Retorna evolução de crimes digitais em `crimes_digitais_evolucao.csv`.

- `GET /api/datasets/fact-ocorrencias`
  - Retorna o dataset processado completo de ocorrências em `fact_ocorrencias.csv`.

---

## Exemplos com cURL

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/dashboard
curl http://localhost:3001/api/kpis/home
curl http://localhost:3001/api/analytics/crimes-por-mes
curl http://localhost:3001/api/datasets/fact-ocorrencias
```

---

## Exemplo de resposta básica

`GET /api/dashboard` retorna um objeto com estrutura semelhante a:

```json
{
  "kpisHome": { "total_crimes_valid": 87710, "percentual_crimes_validos": 81.67, ... },
  "crimesPorMes": [ { "mes": "2025-01", "quantidade": 1234 }, ... ],
  "crimesPorMunicipio": [ { "municipio": "VITORIA", "quantidade": 345 }, ... ],
  "perfilVitimas": [ { "sexo": "FEMININO", "quantidade": 15464 }, ... ]
}
```

---

## Observações para o time de consulta

- As respostas são carregadas diretamente de CSVs processados.
- Não há lógica de filtro avançado no backend; novos filtros exigem alteração em `packages/backend/src/routes/dashboard_routes.py`.
- Para entender o esquema exato de cada endpoint, abra o CSV correspondente em `packages/backend/src/data/processed/`.

---

## Onde encontrar o código

- Rotas: `packages/backend/src/routes/dashboard_routes.py`
- Serviço de dados: `packages/backend/src/services/dashboard_data_service.py`
- Mapeamento de arquivos: `packages/backend/src/config/data_paths.py`
- Arquivos processados: `packages/backend/src/data/processed/`

---

## Códigos HTTP esperados

- `200 OK` — sucesso
- `400 Bad Request` — requisição inválida
- `404 Not Found` — recurso não encontrado
- `500 Internal Server Error` — erro interno

Formato de erro comum:

```json
{ "detail": "Descrição do erro" }
```

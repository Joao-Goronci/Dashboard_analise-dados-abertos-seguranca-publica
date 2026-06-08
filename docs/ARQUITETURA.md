# Arquitetura do Dashboard de Segurança Pública ES

## Visão geral

Este projeto usa uma arquitetura simples de monorepo com duas camadas:
- Backend Python/FastAPI que expõe dados processados a partir de CSVs.
- Frontend React/Vite que consome a API e apresenta visualizações.

O foco é permitir análise rápida e consulta de indicadores, não processamento em tempo real.

## Estrutura do repositório

```text
Dashboard_analise-dados-abertos-seguranca-publica/
├── packages/frontend/     # Aplicação web React + Vite
├── packages/backend/      # API FastAPI + pipeline de dados em CSV
└── docs/                  # Documentação técnica
```

## Fluxo de dados

1. Dados brutos em `packages/backend/src/data/raw/CSVs/`
2. Pipeline Python em `packages/backend/src/data/preprocessing/load_data.py`
3. Arquivos processados gerados em `packages/backend/src/data/processed/`
4. Backend FastAPI lê esses CSVs e expõe JSON
5. Frontend consome os endpoints e transforma os dados para gráficos
6. Visualização é exibida no navegador

## Backend

### Componentes principais

- `packages/backend/src/main.py`
  - Inicializa o FastAPI e configura CORS.

- `packages/backend/src/routes/dashboard_routes.py`
  - Define endpoints sob `/api`.

- `packages/backend/src/services/dashboard_data_service.py`
  - Lê arquivos processados e aplica cache.

- `packages/backend/src/config/data_paths.py`
  - Mapeia nomes de arquivos processados para uso no serviço.

### Observações

- O backend não usa banco de dados; cada rota retorna dados de um CSV processado.
- Adicionar nova fonte de dados exige adicionar arquivo em `processed/` e expor um endpoint.
- O serviço usa `@lru_cache(maxsize=1)` para evitar leituras repetidas.

## Frontend

### Componentes principais

- `packages/frontend/src/App.jsx`
  - Define a navegação e as rotas cliente.

- `packages/frontend/src/pages/`
  - Contém páginas como `HomePage.jsx`, `ViolenciaSocialPage.jsx`, `PatrimonialPage.jsx`, `DigitalPage.jsx` e `ObjetosPage.jsx`.

- `packages/frontend/src/components/dashboard/`
  - Componentes reutilizáveis como `KpiCard.jsx`, `ChartCard.jsx` e `SectionTitle.jsx`.

- `packages/frontend/src/utils/dashboardTransforms.js`
  - Converte dados da API em séries e categorias de gráfico.

### Onde ajustar análises

- Agregação e filtros do cliente: `dashboardTransforms.js`
- Layout e estrutura dos dashboards: `src/pages/`
- Estilos e responsividade: `src/App.css` e `src/styles/`

## Pontos de integração importantes

- `packages/backend/src/data/processed/` é a fonte de verdade dos dados do dashboard.
- Se um novo gráfico precisar de dados diferentes, verifique primeiro se o CSV processado existe.
- A API atual não suporta query strings para filtros; a maior parte da lógica de categoria e limite ocorre no frontend.

## Recomendações para o time de consulta

- Comece por `packages/backend/src/data/preprocessing/load_data.py` para entender como os dados são limpos.
- Use `packages/backend/src/routes/dashboard_routes.py` para encontrar endpoints disponíveis.
- Use `packages/frontend/src/utils/dashboardTransforms.js` para seguir como os dados são transformados em visualizações.
- Para alterações rápidas, adicione um novo arquivo em `processed/` e exponha pelo backend.

## Responsabilidades de cada camada

| Camada | Responsabilidade |
|---|---|
| Backend | Expor dados processados a partir de CSVs |
| Pipeline | Limpar, padronizar e gerar artefatos em CSV |
| Frontend | Consumir API, agregar dados e exibir gráficos |

## Onde começar quando for consultar o sistema

- Se o problema for dado incorreto: revise o pipeline em `load_data.py`.
- Se o problema for endpoint faltando: veja `dashboard_routes.py`.
- Se o problema for gráfico errado: veja `dashboardTransforms.js` e a página correspondente.

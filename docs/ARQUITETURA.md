# Arquitetura do Dashboard de Segurança Pública ES

## 📋 Visão Geral

Dashboard interativo e responsivo para análise de dados de segurança pública do Espírito Santo 2025. Arquitetura monorepo com backend FastAPI e frontend React/Vite.

## 🏗️ Estrutura do Projeto

```
├── packages/
│   ├── frontend/          # React + Vite + Recharts
│   └── backend/           # FastAPI + Pandas
├── docs/                  # Documentação
├── package.json           # Root workspace
└── NEXT_STEPS.md         # Roadmap
```

## 🔄 Fluxo de Dados

```
CSV Data Files
    ↓
Backend Processing (Pandas)
    ↓
FastAPI Endpoints
    ↓
Frontend API Client
    ↓
Data Transformations (normalizeKey, aggregations)
    ↓
React Components (HomePage, ViolenciaSocialPage, etc)
    ↓
Recharts Visualizations
    ↓
User Browser (Responsive Design)
```

## 🛠️ Backend (FastAPI)

### Estrutura
- `src/main.py` - Aplicação FastAPI + CORS middleware
- `src/routes/dashboard_routes.py` - Endpoints da API
- `src/services/dashboard_data_service.py` - Carregamento e cache de dados
- `src/config/data_paths.py` - Configuração de caminhos de arquivos

### Endpoints Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/dashboard` | GET | Bundle completo de dados |
| `/api/kpis/home` | GET | KPIs da página inicial |
| `/api/analytics/crimes-por-mes` | GET | Séries mensais |
| `/api/analytics/crimes-por-municipio` | GET | Ranking de municípios |
| `/api/analytics/crimes-por-periodo` | GET | Distribuição por período |
| `/api/analytics/top-bairros` | GET | Top 10 bairros |
| `/api/analytics/comparativo-furto-roubo` | GET | Furto vs Roubo |
| `/api/analytics/objetos-mais-roubados` | GET | Objetos frequentes |

### Camada de Cache
- `@lru_cache(maxsize=1)` em funções de dados
- Dados carregados uma vez e reutilizados
- Ideal para dados estáticos processados

### Tratamento de Erros
- `FileNotFoundError` → HTTP 503 com mensagem descritiva
- CORS habilitado para desenvolvimento (allow_origins=['*'])
- Validação automática FastAPI

## 🎨 Frontend (React + Vite)

### Estrutura

```
src/
├── pages/
│   ├── HomePage.jsx          # Visão geral consolidada
│   ├── ViolenciaSocialPage.jsx
│   ├── PatrimonialPage.jsx
│   ├── DigitalPage.jsx
│   └── ObjetosPage.jsx
├── components/dashboard/
│   ├── KpiCard.jsx          # Card de métrica
│   ├── ChartCard.jsx        # Wrapper para gráficos
│   └── SectionTitle.jsx     # Títulos de seção
├── utils/
│   └── dashboardTransforms.js  # Transformações de dados
├── App.jsx                  # Router principal
└── styles
    ├── App.css             # Estilos gerais
    └── Dashboard.css       # Estilos do dashboard
```

### Componentes

#### KpiCard
Exibe métrica com label, valor e nota.
```jsx
<KpiCard
  label="Total de Ocorrências"
  value="45.230"
  note="Base consolidada do período"
/>
```

#### ChartCard
Wrapper responsivo para gráficos Recharts.
```jsx
<ChartCard title="Evolução mensal" subtitle="Dados históricos">
  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={data}>
      {/* chart content */}
    </LineChart>
  </ResponsiveContainer>
</ChartCard>
```

### Transformações de Dados

Funções em `dashboardTransforms.js`:

| Função | Entrada | Saída | Uso |
|--------|---------|-------|-----|
| `normalizeKey` | string | UPPERCASE sem acentos | Comparações |
| `aggregateCategoryMonthlySeries` | raw data | séries por mês/categoria | LineChart |
| `aggregateMunicipalitySeries` | raw data | top N municípios | BarChart |
| `aggregateTopNeighborhoods` | raw data | top N bairros | BarChart |
| `aggregatePeriodSeries` | raw data | distribuição períodos | StackedBar |
| `formatCompactNumber` | number | "1.234" (pt-BR) | Exibição |

### Páginas

1. **HomePage**
   - KPIs: total, cidade crítica, horário crítico, crime dominante
   - Gráficos: evolução mensal, crimes por município, distribuição por período, top bairros

2. **ViolenciaSocialPage**
   - Filtrado para categoria "violencia_social"
   - Mesmos gráficos base

3. **PatrimonialPage**
   - Filtrado para categoria "patrimonial"
   - Adiciona comparativo furto vs roubo

4. **DigitalPage**
   - Filtrado para crimes digitais
   - Dados específicos de evolução

5. **ObjetosPage**
   - Foco em objetos roubados/furtados
   - Comparativo de quantidades

## 📊 Gráficos Utilizados

Todos utilizam `ResponsiveContainer` do Recharts para adaptação a diferentes tamanhos.

### LineChart
- Evolução mensal com múltiplas linhas (categorias)
- Com pontos de dados e legenda
- Altura responsiva: 150px (mobile) → 320px (desktop)

### BarChart
- Horizontal: Municípios, bairros (altura do grid adapta)
- Vertical: Períodos do dia, objetos
- Stacked: Distribuição de categorias por período

### Componentes Recharts
- `ResponsiveContainer` - Adaptação automática
- `CartesianGrid` - Grade visual
- `XAxis/YAxis` - Eixos com labels responsivos
- `Tooltip` - Hover com formatação
- `Legend` - Legenda das séries
- `Bar/Line/Pie` - Tipos de visualização

## 🎨 Design e Responsividade

### Breakpoints CSS
- **Mobile**: < 640px
  - 1 coluna (KPIs, gráficos)
  - Padding: 10px
  - Font: reduzidas
  
- **Tablet**: 640px - 1024px
  - 2 colunas (KPIs, alguns gráficos)
  - Padding: 14px
  - Font: intermediárias
  
- **Desktop**: ≥ 1024px
  - 4 colunas (KPIs)
  - Grid charts: 1.4fr 1fr ou 1fr 1fr
  - Padding: 18px
  - Font: normais

### Grid Layouts

```css
/* Mobile */
.kpi-grid { grid-template-columns: 1fr; }
.chart-grid-primary { grid-template-columns: 1fr; }

/* Tablet (640px+) */
.kpi-grid { grid-template-columns: repeat(2, 1fr); }
.chart-grid-primary { grid-template-columns: 1fr; }

/* Desktop (1024px+) */
.kpi-grid { grid-template-columns: repeat(4, 1fr); }
.chart-grid-primary { grid-template-columns: 1.4fr 1fr; }
```

### Estilos Principais

#### App.css
- `.app-container` - Padding responsivo
- `.app-header` - Navegação principal
- `.app-nav-button` - Botões de navegação (flex-wrap)

#### Dashboard.css
- `.dashboard-shell` - Container principal
- `.kpi-grid` / `.chart-grid` - Grids responsivos
- `.chart-card` - Cards com gráficos
- Media queries: 640px, 768px, 1024px

## 🔐 Segurança

- ✅ CORS configurado (desenvolvimento)
- ✅ Input validation FastAPI
- ✅ Sem dados sensíveis em resposta
- ✅ CSV files em diretório processado (não raw)

## ⚡ Performance

### Backend
- LRU Cache (1 slot) em todas as funções
- Carregamento único de CSV via pandas
- Lazy loading de dados

### Frontend
- Code splitting automático (Vite)
- Memoização em `useMemo` para transformações
- ResponsiveContainer otimizado

## 📱 Testado Em

- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (768x1024, 834x1194)
- ✅ Mobile (375x667, 414x896)

## 🚀 Deployment

### Backend
```bash
cd packages/backend
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd packages/frontend
npm install
npm run build
npm run dev
```

## 📝 Próximos Passos

1. ✅ Responsividade e acabamento visual
2. ✅ Validação de dados e gráficos
3. Refatoração de nomes e padronizações
4. Documentação arquitetural (atual)

## 📚 Referências

- Recharts: https://recharts.org/
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/

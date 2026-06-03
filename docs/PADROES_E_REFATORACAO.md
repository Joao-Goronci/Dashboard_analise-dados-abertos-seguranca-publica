# Padronizações e Refatoração - Dashboard Segurança Pública

## 📋 Convenções Adotadas

### Backend (Python)

#### Nomenclatura
- **Funções**: `snake_case` ✅ 
  - `get_crimes_por_mes()`
  - `get_dashboard_bundle()`
  
- **Variáveis**: `snake_case` ✅
  - `processed_data_dir`
  - `grouped_data`
  
- **Constantes**: `UPPER_SNAKE_CASE` ✅
  - `PROCESSED_DATA_DIR`
  - `PROCESSED_FILES`

- **Rotas API**: kebab-case ✅
  - `/api/dashboard`
  - `/api/analytics/crimes-por-mes`
  - `/api/datasets/fact-ocorrencias`

#### Response Keys: camelCase ✅
- `kpisHome` (não `kpis_home`)
- `crimesPorMes` (não `crimes_por_mes`)
- `crimesPorMunicipio`
- `crimesPorPeriodo`
- `topBairros`
- `comparativoFurtoRoubo`
- `objetosMaisRoubados`
- `perfilVitimas`
- `crimesDigitaisEvolucao`

### Frontend (JavaScript/React)

#### Nomenclatura
- **Componentes**: PascalCase ✅
  - `HomePage.jsx`
  - `ViolenciaSocialPage.jsx`
  - `KpiCard.jsx`
  - `ChartCard.jsx`
  
- **Funções/Utils**: camelCase ✅
  - `formatCompactNumber()`
  - `aggregateCategoryMonthlySeries()`
  - `normalizeKey()`
  
- **Variáveis**: camelCase ✅
  - `monthlySeries`
  - `municipalitySeries`
  - `kpis`
  
- **Constantes**: UPPER_SNAKE_CASE ✅
  - `CATEGORY_COLORS`
  - `CATEGORY_LABELS`
  - `CATEGORY_ORDER`
  - `PERIOD_ORDER`

#### CSS Classes: kebab-case ✅
- `.app-container`
- `.app-header`
- `.app-nav`
- `.dashboard-shell`
- `.kpi-grid`
- `.chart-grid`
- `.chart-card`
- `.chart-card-header`
- `.chart-card-body`

#### File Naming
- **Pages**: `PageName.jsx` + `PageName.css`
  - `HomePage.jsx` + CSS não necessário (usa Dashboard.css)
  - `ViolenciaSocialPage.jsx`
  
- **Components**: `ComponentName.jsx`
  - Sem arquivo CSS separado (estilos inline ou em arquivos gerais)
  
- **Utils**: `camelCase.js`
  - `dashboardTransforms.js`

### Dados (CSV)

#### Coluna Nomenclatura
- `data_mes` - Data em formato YYYY-MM
- `categoria_macro` - Categoria (patrimonial, violencia_social, digital, objetos)
- `municipio` - Nome do município
- `bairro` - Nome do bairro
- `periodo_dia` - Período (MADRUGADA, MANHA, TARDE, NOITE, SEM_HORARIO_INFORMADO)
- `quantidade` - Contagem de ocorrências
- `fonte_dados` - Tipo de crime ou ação

## ✅ Mapeamento de Transformações

### Categorias
```javascript
const CATEGORY_LABELS = {
  patrimonial: 'Patrimonial',
  violencia_social: 'Violência social',
  digital: 'Digital',
  objetos: 'Objetos',
}
```

### Períodos do Dia
```javascript
const PERIOD_ORDER = [
  'MADRUGADA',
  'MANHA',
  'TARDE',
  'NOITE',
  'SEM_HORARIO_INFORMADO'
]
```

### Cores
```javascript
const CATEGORY_COLORS = {
  patrimonial: '#111827',           // Preto
  violencia_social: '#475569',      // Cinza
  digital: '#2563eb',               // Azul
  objetos: '#94a3b8',               // Cinza-claro
}
```

## 🔄 Fluxo de Normalização

1. **Raw Data** (CSV com acentos, maiúsculas variadas)
2. **normalizeKey()** - Remove acentos, converte UPPERCASE
3. **toTitleCase()** - Converte para Title Case para exibição
4. **Agregações** - Groupby, soma, ranking

```
"São Mateus" → normalize → "SAO MATEUS" → titleCase → "São Mateus"
```

## 🛠️ Refatorações Propostas (Futuras)

### Componentes
- [ ] Extrair `Period Selector` em componente reutilizável
- [ ] Extrair `Time Range Picker` para períodos customizados
- [ ] Criar `DataExportButton` para exportação CSV
- [ ] Criar hook `useChartData()` para lógica de gráficos

### API
- [ ] Adicionar endpoint `/api/export/{format}` (CSV, JSON)
- [ ] Adicionar filtros dinâmicos: `/api/analytics?startDate=X&endDate=Y`
- [ ] Versionamento: `/api/v1/dashboard` vs `/api/v2/dashboard`

### Performance
- [ ] Lazy load de páginas com React.lazy()
- [ ] Implementar paginação em tabelas
- [ ] Cache strategy (SWR, React Query)

### Testing
- [ ] Unit tests para transformações (Jest)
- [ ] E2E tests para fluxos principais (Cypress/Playwright)
- [ ] Testes da API (pytest)

## 📊 Estrutura de Resposta Padronizada

### Sucesso
```json
{
  "kpisHome": {
    "total_crimes": 12345,
    "cidade_critica": "Vitória",
    "horario_critico": "NOITE",
    "percentual_com_horario": 85,
    "crime_dominante": "Roubos"
  },
  "crimesPorMes": [
    {
      "data_mes": "2025-01",
      "categoria_macro": "patrimonial",
      "quantidade": 456
    }
  ]
}
```

### Erro
```json
{
  "error": "Arquivo nao encontrado: /path/to/file.csv",
  "status": 503
}
```

## 🎯 Checklist de Qualidade

### Backend
- ✅ Type hints em todas as funções
- ✅ Docstrings para funções públicas
- ✅ LRU Cache implementado
- ✅ CORS configurado
- ✅ Error handling centralizado
- ✅ Response keys em camelCase

### Frontend
- ✅ Componentes funcionais (hooks)
- ✅ PropTypes ou TypeScript
- ✅ useMemo para otimização
- ✅ Nomes descritivos de variáveis
- ✅ CSS responsivo com media queries
- ✅ Sem console.logs em produção

### Dados
- ✅ CSV preprocessado (sem dados raw)
- ✅ Valores nulos tratados
- ✅ Consistência de tipos (string/number)
- ✅ Sem duplicatas nas agregações

## 📌 Regras de Ouro

1. **Nomes significativos**: `municipalitySeries` é melhor que `data`
2. **Funções pequenas**: Máximo 50 linhas
3. **DRY (Don't Repeat Yourself)**: Utils em `dashboardTransforms.js`
4. **Responsividade**: Sempre teste em 3 breakpoints
5. **Acessibilidade**: Labels em todos os inputs
6. **Performance**: Memoize transformações de dados

## 📚 Referências

- [PEP 8 - Python Style Guide](https://pep8.org/)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [React Naming Conventions](https://reactjs.org/docs/faq-structure.html)

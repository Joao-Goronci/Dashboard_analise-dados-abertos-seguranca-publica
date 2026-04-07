# Arquitetura do Projeto

## Visão Geral

O projeto é estruturado como um **monorepo** com frontend React e backend Express, permitindo desenvolvimento sincronizado de ambas as camadas e compartilhamento de ferramentas e configurações.

## Estrutura do Monorepo

```
/
├── packages/
│   ├── frontend/          # Aplicação React + Vite
│   └── backend/           # API Express.js
├── docs/                  # Documentação do projeto
└── package.json           # Configuração do monorepo (npm workspaces)
```

## Frontend (`packages/frontend`)

### Estrutura de Diretórios

```
packages/frontend/src/
├── pages/                 # Páginas/rotas principais
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   └── ChatPage/
│       ├── Chat.jsx
│       └── Chat.css
│
├── components/            # Componentes reutilizáveis
│   ├── ui/                # Componentes primitivos (Shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (componentes de biblioteca de UI)
│   ├── common/            # Componentes comuns
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   └── dashboard/         # Componentes específicos do dashboard
│       ├── StatCard.jsx
│       └── CrimeMetrics.jsx
│
├── services/              # Camada de integração com API
│   ├── api.js             # Configuração base (axios/fetch)
│   ├── dashboardService.js
│   └── chatService.js
│
├── contexts/              # Context API para estado global
│   ├── ThemeContext.jsx
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
│
├── hooks/                 # Hooks customizados
│   ├── useApi.js          # Hook para chamadas HTTP
│   ├── useLocalStorage.js
│   └── useMobile.ts
│
├── lib/                   # Utilitários e helpers
│   ├── utils.ts           # Funções utilitárias
│   ├── constants.js       # Constantes da aplicação
│   ├── formatters.js      # Formatação de dados
│   └── validators.js      # Validações
│
├── assets/                # Imagens, ícones, fontes
│   ├── images/
│   └── icons/
│
└── styles/
    ├── globals.css        # Estilos globais
    └── variables.css      # CSS variables para temas
```

### Fluxo de Dados no Frontend

1. **Componentes** renderizam UI
2. **Hooks** (`useApi`, `useLocalStorage`) gerenciam lógica
3. **Services** fazem requisições HTTP à API backend
4. **Contexts** compartilham estado global
5. **Formatadores** e validadores processam dados

### Exemplo: Carregamento de Dashboard

```jsx
// pages/Dashboard/Dashboard.jsx
import { useDashboardData } from './hooks/useDashboardData'

export function Dashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBoundary error={error} />

  return (
    <div>
      <StatCard data={data.stats} />
      <CrimeMetrics data={data.crimes} />
    </div>
  )
}
```

```js
// pages/Dashboard/hooks/useDashboardData.js
import { useState, useEffect } from 'react'
import { dashboardService } from '../../../services/dashboardService'

export function useDashboardData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    dashboardService
      .fetchStats()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
```

```js
// services/dashboardService.js
import { api } from './api'

export const dashboardService = {
  fetchStats: () => api.get('/graphics/stats'),
  fetchTimeline: () => api.get('/graphics/timeline'),
  fetchRegions: () => api.get('/graphics/regions')
}
```

## Backend (`packages/backend`)

### Estrutura de Diretórios

```
packages/backend/src/
├── config/                # Configurações
│   ├── database.js
│   └── env.js
│
├── middleware/            # Middlewares Express
│   ├── errorHandler.js    # Tratamento de erros
│   ├── logging.js         # Log de requisições
│   ├── auth.js            # Autenticação (futuro)
│   └── cors.js            # CORS (configurado em app.js)
│
├── routes/                # Definição de endpoints
│   ├── graphics.js        # GET /api/graphics
│   ├── chat.js            # POST /api/chat
│   ├── crimes.js          # GET /api/crimes
│   └── analytics.js       # GET /api/analytics (futuro)
│
├── controllers/           # Lógica de requisição/resposta
│   ├── graphicsController.js
│   ├── chatController.js
│   └── crimeController.js
│
├── services/              # Lógica de negócio
│   ├── graphicsService.js    # Processa dados de gráficos
│   ├── chatService.js        # Processamento de chat
│   └── crimeDataService.js   # Carrega e processa CSVs
│
├── utils/                 # Utilitários
│   ├── logger.js
│   ├── helpers.js
│   └── validators.js
│
├── data/                  # Dados da aplicação
│   ├── raw/               # CSVs brutos
│   │   ├── crimes/
│   │   │   ├── homicidios.csv
│   │   │   ├── roubos.csv
│   │   │   ├── furtos.csv
│   │   │   └── metadata.json
│   │   └── (dados em CSVs)
│   │
│   └── processed/         # Cache de dados processados
│       └── aggregated.json
│
└── app.js                 # Aplicação Express principal
```

### Fluxo de uma Requisição

```
1. Cliente (Frontend)
   └─> GET /api/graphics/stats

2. Express Middleware
   └─> requestLogger
   └─> cors
   └─> json parser

3. Router
   └─> router.get('/stats', handler)

4. Handler/Controller
   └─> graphicsController.getStats()

5. Service Layer
   └─> graphicsService.aggregateData()
   └─> crimeDataService.loadCSV()

6. Data Processing
   └─> Parse CSV
   └─> Filter/aggregate
   └─> Format response

7. Return
   └─> JSON Response
   └─> requestLogger (log)
   └─> Client receives data
```

### Exemplo: Endpoint de Crimes

```js
// routes/crimes.js
router.get('/', (req, res) => {
  const { type, period, region } = req.query

  const data = crimeService.getCrimes({ type, period, region })
  res.json(data)
})

// services/crimesService.js
export const crimesService = {
  getCrimes: (filters) => {
    const rawData = loadCSV('crimes.csv')
    return filterAndAggregate(rawData, filters)
  }
}

// Response
{
  "filters": { "type": "all", "period": "2024" },
  "data": [
    {
      "name": "Homicídio Doloso",
      "count": 342,
      "rate": 3.2,
      "trend": -2.1
    },
    ...
  ],
  "total": 10924
}
```

## Integração Frontend-Backend

### Configuração de Proxy (Vite)

O Vite automaticamente redireciona chamadas `/api/*` para `http://localhost:5000`:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Chamada de API no Frontend

```js
// Service layer
const response = await fetch('/api/graphics/stats')
const data = await response.json()

// Backend recebe em
// GET http://localhost:5000/api/graphics/stats
```

## Estado Global

### Context API para Tema

```jsx
// contexts/ThemeContext.jsx
export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Usage
const { theme } = useContext(ThemeContext)
```

## Componentes Compartilhados

### UI Components (Shadcn/ui)

Localizados em `components/ui/`:

- `button.tsx` - Botões
- `card.tsx` - Cards
- `dialog.tsx` - Modais
- `input.tsx` - Inputs
- `select.tsx` - Selects
- `tabs.tsx` - Abas
- E muitos outros...

### Common Components

Componentes reutilizáveis:

```
components/common/
├── LoadingSpinner.jsx
├── ErrorBoundary.jsx
├── Modal.jsx
└── Notification.jsx
```

## Convenções de Código

### Nomes de Arquivos

- Componentes React: `PascalCase.jsx`
- Funções e variáveis: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Diretórios: `kebab-case` ou `camelCase`

### Estrutura de Componentes

```jsx
// Imports
import { useState } from 'react'
import { Button } from '@components/ui/button'

// Component
export function ExampleComponent({ prop }) {
  const [state, setState] = useState()

  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// Exports
export default ExampleComponent
```

## Scripts Disponíveis

### Root

```bash
npm run dev             # Iniciar apenas frontend (Vite)
npm run dev:all        # Iniciar frontend + backend com concurrently
npm run dev:frontend   # Iniciar frontend
npm run dev:backend    # Iniciar backend
npm run build          # Build de ambos (frontend e backend)
npm run lint           # Lint de ambos
npm run test           # Testes
```

### Frontend

```bash
npm run dev            # Vite dev server
npm run build          # Vite build
npm run preview        # Preview do build
```

### Backend

```bash
npm run dev            # Nodemon (watch mode)
npm run start          # Node direto
npm run lint           # ESLint
```

## Padrões de Desenvolvimento

### Service Layer

Sempre use a camada de service para requisições HTTP:

```js
// ❌ Ruim - Chamando API diretamente no componente
function Component() {
  useEffect(() => {
    fetch('/api/data').then(...)
  }, [])
}

// ✅ Bom - Usando service
function Component() {
  const { data } = useApi(apiService.getData)
}
```

### Error Handling

```js
// services/api.js
export const api = {
  get: async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
```

## Próximas Fases

1. **Autenticação**: Adicionar JWT + AuthContext
2. **Banco de Dados**: Migrar CSVs para PostgreSQL/MongoDB
3. **Cache**: Redis para dados agregados
4. **Testes**: Jest + Testing Library (Frontend), Jest (Backend)
5. **CI/CD**: GitHub Actions
6. **GraphQL**: Considerar GraphQL como alternativa a REST

## Referências

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

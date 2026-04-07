# Setup - Guia de Configuração

## Requisitos

- **Node.js**: 18+ (LTS recomendado)
- **npm**: 9+ ou **pnpm**: 8+
- **Git**: Para clonar o repositório

### Verificar Versões

```bash
node --version    # v18.0.0 ou superior
npm --version     # 9.0.0 ou superior
```

Caso precise instalar, visite [nodejs.org](https://nodejs.org)

---

## Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd Dashboard_analise-dados-abertos-seguranca-publica
```

### 2. Instale as Dependências

```bash
npm install
```

Isso instalará dependências do monorepo e de ambos `packages/frontend` e `packages/backend`.

#### Alternativa com pnpm (mais rápido)

```bash
pnpm install
```

---

## Configuração de Ambiente

### Frontend

1. Navegue até o diretório frontend:

```bash
cd packages/frontend
```

2. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

3. Edite `.env.local` (opcional - valores padrão funcionam localmente):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Dashboard - Segurança Pública ES
VITE_ENVIRONMENT=development
```

### Backend

1. Navegue até o diretório backend:

```bash
cd packages/backend
```

2. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

3. Edite `.env.local` (opcional - valores padrão funcionam localmente):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATA_PATH=./src/data
LOG_LEVEL=info
```

---

## Iniciar o Servidor de Desenvolvimento

### Opção 1: Frontend Apenas

```bash
npm run dev:frontend
```

Acesse: **http://localhost:5173**

### Opção 2: Backend Apenas

```bash
npm run dev:backend
```

Acesse API: **http://localhost:5000/api/health**

### Opção 3: Frontend + Backend Simultaneamente ⭐ Recomendado

```bash
npm run dev:all
```

Isso inicia:
- Frontend: **http://localhost:5173**
- Backend: **http://localhost:5000/api**

#### Dependência: Instalar `concurrently`

Se receber erro, instale globalmente:

```bash
npm install -g concurrently
```

Ou instale como devDependency (já está feito):

```bash
npm install --save-dev concurrently
```

---

## Verificação

### 1. Verifique o Frontend

1. Abra http://localhost:5173 no navegador
2. Você deve ver o Dashboard carregando
3. Verifique o console (F12) para erros

### 2. Verifique o Backend

```bash
curl http://localhost:5000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-04-07T19:45:30.123Z"
}
```

### 3. Verifique a Integração

1. Abra http://localhost:5173 no navegador
2. Interaja com o Dashboard
3. Abra DevTools (F12) → Network
4. Verifique as requisições para `/api/*`

---

## Build para Produção

### Frontend

```bash
npm run build:frontend
```

Gera arquivos otimizados em `packages/frontend/dist/`

### Backend

```bash
npm run build:backend
```

(Atualmente apenas linting, backend não precisa build)

### Ambos

```bash
npm run build
```

---

## Scripts Disponíveis

### Root (`Dashboard_analise-dados-abertos-seguranca-publica/`)

```bash
npm run dev              # Inicia frontend (Vite)
npm run dev:all         # Inicia frontend + backend com concurrently ⭐
npm run dev:frontend    # Inicia apenas frontend
npm run dev:backend     # Inicia apenas backend
npm run build           # Build de ambos
npm run build:frontend  # Build do frontend
npm run build:backend   # Build do backend (lint)
npm run test            # Testes (quando implementado)
npm run lint            # Lint (quando implementado)
npm run lint:fix        # Fix lint (quando implementado)
```

### Frontend (`packages/frontend/`)

```bash
npm run dev      # Vite dev server
npm run build    # Build do projeto
npm run preview  # Preview do build
```

### Backend (`packages/backend/`)

```bash
npm run dev     # Nodemon (watch mode)
npm run start   # Node direto (produção)
npm run lint    # ESLint
npm run lint:fix # Fix ESLint
```

---

## Estrutura de Diretórios

```
.
├── packages/
│   ├── frontend/                    # React + Vite
│   │   ├── src/
│   │   │   ├── pages/               # Dashboard e Chat
│   │   │   ├── components/          # UI Components e business components
│   │   │   ├── services/            # Integração com API
│   │   │   ├── contexts/            # Estado global
│   │   │   ├── hooks/               # Custom hooks
│   │   │   ├── lib/                 # Utilitários
│   │   │   ├── styles/              # CSS global
│   │   │   └── assets/              # Imagens, ícones
│   │   ├── vite.config.js           # Configuração Vite
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── backend/                     # Express.js
│       ├── src/
│       │   ├── routes/              # Endpoints API
│       │   ├── middleware/          # Express middleware
│       │   ├── services/            # Lógica de negócio
│       │   ├── data/                # CSVs e dados
│       │   └── app.js               # App principal
│       ├── package.json
│       └── .env.example
│
├── docs/                            # Documentação
│   ├── ARCHITECTURE.md              # Arquitetura detalhada
│   ├── API.md                       # Documentação da API
│   └── SETUP.md                     # Este arquivo
│
├── package.json                     # Root workspace config
└── README.md                        # Documentação geral
```

---

## Troubleshooting

### Erro: "Port 5000 is already in use"

O backend não consegue iniciar porque a porta está em uso.

**Solução:**

Opção 1: Matar o processo usando a porta
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Opção 2: Usar porta diferente no `.env.local`:
```env
PORT=5001
```

### Erro: "Cannot find module 'express'"

Dependências não foram instaladas.

**Solução:**

```bash
cd packages/backend
npm install
```

### Erro: "CORS policy: No 'Access-Control-Allow-Origin'"

Backend CORS não está configurado corretamente.

**Solução:**

1. Verifique `packages/backend/.env.local`:
```env
CORS_ORIGIN=http://localhost:5173
```

2. Reinicie o backend:
```bash
npm run dev:backend
```

### Frontend não consegue conectar ao Backend

**Debug:**

1. Verifique se backend está rodando:
```bash
curl http://localhost:5000/api/health
```

2. Verifique console do navegador (F12)

3. Verifique se a URL de API está correta em `packages/frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Nodemon não encontrado

**Solução:**

```bash
npm install --save-dev nodemon
```

### concurrently não encontrado

**Solução:**

```bash
npm install --save-dev concurrently
```

---

## IDE Setup

### VS Code

#### Extensões Recomendadas

- **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Prettier** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Rest Client** (humao.rest-client) - Para testar API

#### Settings JSON (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### WebStorm / IntelliJ IDEA

- Reconhece automaticamente monorepo
- Use run configurations para `npm run dev:all`

---

## Próximos Passos

1. **Desenvolver** - Abra código em seu editor favorito
2. **Consultar** - Leia `docs/ARCHITECTURE.md` para entender estrutura
3. **Testar API** - Consulte `docs/API.md` para endpoints
4. **Contribuir** - Siga `CONTRIBUTING.md` (quando criado)

---

## Docker (Futuro)

Suporte a Docker será adicionado em versão futura.

```dockerfile
# Será adicionado docker-compose.yml
# Para facilitar setup em diferentes ambientes
```

---

## Suporte

Tem dúvidas?

1. Consulte `docs/ARCHITECTURE.md`
2. Consulte `docs/API.md`
3. Abra uma issue no GitHub
4. Verifique logs do terminal

---

## Referências

- [Node.js Docs](https://nodejs.org/docs/)
- [npm Docs](https://docs.npmjs.com/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Docs](https://react.dev)
- [Express API](https://expressjs.com/api.html)
- [Tailwind CSS](https://tailwindcss.com)

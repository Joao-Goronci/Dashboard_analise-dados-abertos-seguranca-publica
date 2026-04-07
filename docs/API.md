# API REST - Dashboard de Segurança Pública

## Base URL

```
http://localhost:5000/api
```

## Health Check

### GET `/health`

Verifica se o servidor está funcionando.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-04-07T19:45:30.123Z"
}
```

---

## Graphics (Gráficos)

### GET `/graphics`

Lista endpoints disponíveis de gráficos.

**Response (200 OK):**
```json
{
  "message": "Endpoint de gráficos",
  "available": ["/stats", "/timeline", "/regions"]
}
```

### GET `/graphics/stats`

Retorna estatísticas gerais de crimes.

**Response (200 OK):**
```json
{
  "data": {
    "total_crimes": 15420,
    "homicides": 342,
    "robberies": 1205,
    "thefts": 8932
  }
}
```

**Descrição dos Campos:**
- `total_crimes`: Total de crimes registrados
- `homicides`: Homicídios dolosos
- `robberies`: Roubos (residência + comércio)
- `thefts`: Furtos

### GET `/graphics/timeline`

Retorna série temporal de crimes por mês.

**Response (200 OK):**
```json
{
  "data": [
    {"month": "Jan", "crimes": 1205},
    {"month": "Feb", "crimes": 1398},
    {"month": "Mar", "crimes": 9800},
    {"month": "Apr", "crimes": 3908},
    {"month": "May", "crimes": 4800},
    {"month": "Jun", "crimes": 3800}
  ]
}
```

**Uso:** Renderizar gráfico de linha/área com evolução mensal.

### GET `/graphics/regions`

Retorna distribuição de crimes por região geográfica.

**Response (200 OK):**
```json
{
  "data": [
    {
      "region": "Região Central",
      "crimes": 4532,
      "percentage": 29.4
    },
    {
      "region": "Litoral",
      "crimes": 3210,
      "percentage": 20.8
    },
    {
      "region": "Interior",
      "crimes": 7678,
      "percentage": 49.8
    }
  ]
}
```

**Uso:** Renderizar gráfico de pizza/donut com distribuição regional.

---

## Crimes

### GET `/crimes`

Retorna lista de tipos de crimes com estatísticas.

**Query Params:**
```
?type=all       # Tipo de crime: 'all', 'homicide', 'robbery', 'theft'
?period=2024    # Período: '2024', '2023', etc
?region=all     # Região: 'all', 'central', 'coastal', 'interior'
```

**Response (200 OK):**
```json
{
  "filters": {
    "type": "all",
    "period": "2024",
    "region": "all"
  },
  "data": [
    {
      "id": 1,
      "name": "Homicídio Doloso",
      "count": 342,
      "rate": 3.2,
      "trend": -2.1,
      "regions": {
        "central": 85,
        "coastal": 120,
        "interior": 137
      }
    },
    {
      "id": 2,
      "name": "Roubo a Residência",
      "count": 1205,
      "rate": 11.2,
      "trend": 5.3,
      "regions": {
        "central": 450,
        "coastal": 280,
        "interior": 475
      }
    },
    {
      "id": 3,
      "name": "Furto",
      "count": 8932,
      "rate": 83.4,
      "trend": -1.2,
      "regions": {
        "central": 3200,
        "coastal": 2100,
        "interior": 3632
      }
    }
  ],
  "total": 10924,
  "updated_at": "2024-04-07T19:45:30.123Z"
}
```

**Descrição dos Campos:**
- `count`: Número total de ocorrências
- `rate`: Taxa por 100k habitantes
- `trend`: Variação percentual vs período anterior
- `regions`: Distribuição por região

**Exemplos de Requisições:**

```bash
# Todos os crimes em 2024
GET /api/crimes?period=2024

# Apenas homicídios
GET /api/crimes?type=homicide

# Crimes na região litoral
GET /api/crimes?region=coastal

# Combinado
GET /api/crimes?type=robbery&period=2024&region=interior
```

### GET `/crimes/{id}`

Retorna detalhes de um crime específico.

**Parametros:**
- `id` (path param): ID do tipo de crime

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Homicídio Doloso",
  "description": "Morte provocada intencionalmente com dolo",
  "statistics": {
    "monthly": [
      {"month": "Jan", "count": 95},
      {"month": "Feb", "count": 112},
      {"month": "Mar", "count": 128}
    ],
    "byRegion": [
      {"region": "Central", "count": 85, "percentage": 32.1},
      {"region": "Coastal", "count": 120, "percentage": 45.3},
      {"region": "Interior", "count": 60, "percentage": 22.6}
    ]
  }
}
```

**Exemplo:**
```bash
GET /api/crimes/1
```

---

## Chat

### POST `/chat`

Processa mensagem do usuário e retorna resposta contextualizada.

**Request Body:**
```json
{
  "message": "Qual é o crime mais frequente?"
}
```

**Response (200 OK):**
```json
{
  "message": "Qual é o crime mais frequente?",
  "response": "Segundo os dados de 2024, o crime mais frequente identificado é roubo a residência.",
  "timestamp": "2024-04-07T19:45:30.123Z"
}
```

**Exemplos de Perguntas Suportadas:**

```bash
# Pergunta sobre tipos de crimes
POST /api/chat
{
  "message": "Quais são os tipos de crime mais comuns?"
}
# Response: "Segundo os dados..."

# Pergunta sobre regiões
POST /api/chat
{
  "message": "Qual região tem mais crimes?"
}
# Response: "A região com maior incidência..."

# Pergunta genérica
POST /api/chat
{
  "message": "Oi"
}
# Response: "Estou aqui para ajudar com análise de dados..."
```

**Erros Possíveis:**

```json
{
  "error": "Mensagem é obrigatória"
}
```

---

## Analytics (Futuro)

### GET `/analytics/dashboard`

Retorna dados agregados para apresentação no dashboard.

**Planejado para:**
```json
{
  "summary": {
    "total_crimes": 15420,
    "crime_rate": 144.2,
    "trend": -2.1,
    "most_common": "Furto"
  },
  "top_crimes": [...],
  "regional_comparison": [...],
  "monthly_evolution": [...]
}
```

---

## Tratamento de Erros

### HTTP Status Codes

- `200 OK` - Sucesso
- `400 Bad Request` - Requisição inválida
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

### Formato de Erro

```json
{
  "error": "Descrição do erro"
}
```

### Exemplos

```bash
# Erro 404
GET /api/invalid-endpoint
# Response (404):
{
  "error": "Rota não encontrada"
}

# Erro 400
POST /api/chat
# Body: {} (sem message)
# Response (400):
{
  "error": "Mensagem é obrigatória"
}

# Erro 500
GET /api/crimes (erro ao processar)
# Response (500):
{
  "error": "Erro interno do servidor"
}
```

---

## Rate Limiting

**Não implementado ainda.** Planejado para fases futuras.

---

## Autenticação

**Não implementada ainda.** Planejado para fases futuras com JWT.

---

## CORS

O backend aceita requisições de:

```
http://localhost:5173    # Frontend local
```

Configurado em `.env`:
```
CORS_ORIGIN=http://localhost:5173
```

---

## Testing

### Exemplos com cURL

```bash
# Verificar saúde
curl http://localhost:5000/api/health

# Get stats
curl http://localhost:5000/api/graphics/stats

# Get crimes
curl "http://localhost:5000/api/crimes?type=homicide"

# Post chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Qual crime é mais frequente?"}'
```

### Exemplos com Fetch (Frontend)

```javascript
// GET
const stats = await fetch('/api/graphics/stats')
  .then(r => r.json())

// POST
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Quais são os crimes?' })
})
  .then(r => r.json())
```

### Exemplos com Axios (Frontend Service)

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// GET
const stats = await api.get('/graphics/stats')

// POST
const chat = await api.post('/chat', {
  message: 'Qual é o crime mais frequente?'
})
```

---

## Documentação de Dados

### Estrutura de CSV

Os dados são armazenados em CSV e carregados na memória:

```
packages/backend/src/data/raw/
├── crimes/
│   ├── homicidios.csv
│   ├── roubos.csv
│   ├── furtos.csv
│   └── metadata.json
```

### Formato Esperado

```csv
data,regiao,numero_ocorrencias,taxa_por_100mil
2024-01-15,Central,45,12.3
2024-01-15,Litoral,32,8.9
2024-01-15,Interior,67,18.2
```

### Metadata

```json
{
  "source": "Secretaria de Segurança Pública ES",
  "updated": "2024-04-07",
  "regions": ["Central", "Litoral", "Interior"],
  "crimes": ["Homicídio", "Roubo", "Furto"]
}
```

---

## Roadmap

### v1.0 (Atual)
- ✅ Endpoints básicos
- ✅ CORS configurado
- ✅ Logging de requisições

### v1.1 (Próximo)
- 🔄 Processamento de CSV completo
- 🔄 Cache de dados
- 🔄 Filtros avançados

### v2.0 (Futuro)
- ❌ Autenticação JWT
- ❌ Banco de dados (PostgreSQL)
- ❌ Endpoints de Analytics
- ❌ WebSockets para chat em tempo real
- ❌ Rate limiting

---

## Suporte

Para dúvidas ou bugs, abra uma issue no GitHub ou consulte `docs/SETUP.md`.

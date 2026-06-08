# Origem dos Dados e Auditoria de Qualidade

## 1. Origem dos arquivos brutos

Os dados originais foram carregados a partir de arquivos CSV em:

- `packages/backend/src/data/raw/CSVs/`

Os arquivos utilizados no pipeline são:

- `CRIMES_INFORMATICOS_2025.csv`
- `ESTELIONATOS_2025.csv`
- `FURTOS_2025.csv`
- `HOMICIDIOS_DOLOSOS_2025.csv`
- `OBJETOS_FURTADOS_E_ROUBADOS_2025.csv`
- `ROUBOS_2025.csv`
- `VIOLENCIA_DOMESTICA_2025.csv`

Esses CSVs mantêm os dados brutos de ocorrências e servem como base para toda a transformação do dashboard.

## 2. Pipeline de processamento

O script principal de ETL é:

- `packages/backend/src/data/preprocessing/load_data.py`

Ele realiza as seguintes etapas:

1. leitura com fallback de codificação (`utf-8`, `utf-8-sig`, `latin1`, `cp1252`);
2. renomeação das colunas com base em alias comuns;
3. remoção de colunas irrelevantes (`_id`, `numero_ocorrencia`, `logradouro`);
4. normalização de texto e padronização de valores;
5. criação de colunas derivadas para data, hora, período do dia, faixa etária e categoria macro;
6. geração da `fact_ocorrencias.csv` e de tabelas agregadas para o dashboard.

## 3. Problemas de qualidade identificados

- `VIOLENCIA_DOMESTICA_2025.csv` contém 13.816 registros com campos principais totalmente ausentes:
  - `DATA DO FATO`
  - `HORA DO FATO`
  - `MUNICÍPIO`
  - `BAIRRO`
  - `TIPO DE INCIDENTE`
  - `SEXO`
  - `IDADE`

- Os arquivos de outros datasets apresentam altos percentuais de `BAIRRO` genérico:
  - `CRIMES_INFORMATICOS`: 14,27% de bairros inválidos
  - `ESTELIONATOS`: 14,14% de bairros inválidos
  - `FURTOS`: 4,34% de bairros inválidos
  - `HOMICIDIOS_DOLOSOS`: 6,3% de bairros inválidos
  - `OBJETOS_FURTADOS_E_ROUBADOS`: 3,25% de bairros inválidos
  - `ROUBOS`: 2,11% de bairros inválidos
  - `VIOLENCIA_DOMESTICA`: 3,92% de bairros inválidos

- Categorias genéricas recorrentes encontradas:
  - `OUTRO LOCAL`
  - `ZONA RURAL`
  - `BAIRRO_NAO_INFORMADO`
  - `MUNICIPIO_NAO_INFORMADO`
  - `UF_NAO_INFORMADA`
  - `IGNORADO`
  - `DESCONHECIDO`
  - `SEM INFORMACAO`
  - `INDETERMINADA`
  - `S I` / `S/I`

## 4. Correções aplicadas no pipeline

- remoção de linhas completamente vazias antes da limpeza;
- tratamento de valores genéricos e padronização de categorias inválidas;
- criação de validações específicas para registros analíticos válidos:
  - localidade válida (`municipio` e `bairro` confiáveis);
  - data e hora válidas;
  - tipo de ocorrência válido;
  - perfil da vítima válido;
  - objetos válidos.
- os indicadores estratégicos agora usam apenas registros confiáveis:
  - municípios críticos, bairros críticos e tendências não podem ser influenciados por valores genéricos;
  - registros genéricos permanecem apenas em métricas de qualidade.

## 5. Resultados após a limpeza

Após a execução do pipeline atualizado, a fact table passou de `121.215` para `107.399` registros.

- `total_crimes_valid`: `87.710`
- `percentual_crimes_validos`: `81,67%`

Os dashboards agora refletem apenas dados com:

- município válido;
- bairro válido;
- data verificável;
- horário válido;
- tipo de ocorrência confiável.

## 6. Arquivos de saída gerados

Os arquivos processados estão em:

- `packages/backend/src/data/processed/`

Os principais artefatos são:

- `fact_ocorrencias.csv`
- `kpis_home.csv`
- `crimes_por_municipio.csv`
- `top_bairros.csv`
- `crimes_por_mes.csv`
- `crimes_por_periodo.csv`
- `crimes_digitais_evolucao.csv`
- `objetos_mais_roubados.csv`
- `perfil_vitimas.csv`
- `qualidade_dados_localidade.csv`

## 7. Impacto na confiabilidade do dashboard

- existe uma limitação importante em `VIOLENCIA_DOMESTICA` devido a 40,17% de registros sem data/hora na origem;
- mesmo após a limpeza, 8,57% dos registros faturados ainda não possuem bairro válido para análise de bairro crítico.

Essas limitações devem ser consideradas ao interpretar rankings e KPIs, especialmente quando se trata de decisões de gestão pública.

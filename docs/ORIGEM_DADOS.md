# Origem dos Dados e Auditoria de Qualidade

Este documento fornece um guia para equipes que precisam compreender a origem dos dados, as decisões de limpeza e as limitações do dashboard.

## 1. Objetivo

- Documentar as fontes de dados originais.
- Explicar o pipeline de transformação.
- Listar problemas de qualidade e correções aplicadas.
- Ajudar na interpretação dos indicadores gerados.

## 2. Fonte dos dados brutos

Os dados originais são arquivos CSV em:

- `packages/backend/src/data/raw/CSVs/`

Arquivos utilizados:

- `CRIMES_INFORMATICOS_2025.csv`
- `ESTELIONATOS_2025.csv`
- `FURTOS_2025.csv`
- `HOMICIDIOS_DOLOSOS_2025.csv`
- `OBJETOS_FURTADOS_E_ROUBADOS_2025.csv`
- `ROUBOS_2025.csv`
- `VIOLENCIA_DOMESTICA_2025.csv`

Esses arquivos representam a base bruta das ocorrências antes de qualquer limpeza.

## 3. Pipeline de processamento

Arquivo principal:

- `packages/backend/src/data/preprocessing/load_data.py`

Etapas principais do pipeline:

1. Leitura de CSV com suporte a múltiplas codificações (`utf-8`, `utf-8-sig`, `latin1`, `cp1252`).
2. Renomeação e unificação de colunas por alias.
3. Remoção de campos não utilizados para análise.
4. Normalização de valores textuais e padronização de categorias.
5. Criação de colunas derivadas como data, hora, período do dia, faixa etária e categoria macro.
6. Geração de arquivos processados em `packages/backend/src/data/processed/`.

## 4. Problemas de qualidade detectados

### Registros incompletos

- `VIOLENCIA_DOMESTICA_2025.csv` possui 13.816 registros com campos essenciais ausentes:
  - `DATA DO FATO`
  - `HORA DO FATO`
  - `MUNICÍPIO`
  - `BAIRRO`
  - `TIPO DE INCIDENTE`
  - `SEXO`
  - `IDADE`

### Localidade inconsistente

Percentual de bairros inválidos por arquivo:

- `CRIMES_INFORMATICOS`: 14,27%
- `ESTELIONATOS`: 14,14%
- `FURTOS`: 4,34%
- `HOMICIDIOS_DOLOSOS`: 6,3%
- `OBJETOS_FURTADOS_E_ROUBADOS`: 3,25%
- `ROUBOS`: 2,11%
- `VIOLENCIA_DOMESTICA`: 3,92%

### Categorias genéricas e ruído

Valores recorrentes que exigiram tratamento:

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

## 5. Correções aplicadas

O pipeline foi ajustado para:

- remover linhas vazias antes da limpeza;
- padronizar e agrupar valores genéricos;
- validar registros com localidade, data e hora confiáveis;
- preservar perfis de vítimas válidos;
- manter objetos válidos apenas quando houver dados significativos.

Critérios de validade do pipeline:

- `municipio` confiável
- `bairro` confiável
- `data_fato` e `hora_fato` válidos
- `tipo_incidente` reconhecido
- `sexo` e `idade` válidos quando presentes

## 6. Resultados da limpeza

Após o processamento, o arquivo `fact_ocorrencias.csv` contém cerca de `107.399` registros.

Dos dados processados:

- `total_crimes_valid`: `87.710`
- `percentual_crimes_validos`: `81,67%`

Esses números mostram que o dashboard trabalha com a maior parte dos dados, caso em que 18% foram excluídos ou marcados como não confiáveis.

## 7. Artefatos processados

Arquivos gerados em `packages/backend/src/data/processed/`:

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

## 8. Limitações e alertas

- `VIOLENCIA_DOMESTICA` tem limitação significativa devido à falta de data/hora em muitos registros.
- Métricas de bairro e município podem ser afetadas por registros genéricos ou de baixa qualidade.
- A interpretação dos KPIs deve considerar que apenas dados confiáveis foram usados nas análises principais.

## 9. Como usar este documento

- Consulte antes de extrair conclusões ou gerar relatórios.
- Use os arquivos processados como referência para os números exibidos.
- Valide qualquer novo indicador com o pipeline de ETL em `load_data.py`.

## 10. Recomendações para consultas futuras

- Registre qualquer alteração no pipeline ou nas regras de exclusão.
- Evite usar diretamente registros brutos sem passar pelo processo de limpeza.
- Se precisar de um novo filtro ou dimensão, primeiro verifique se o dado existe nos CSVs brutos e se ele permanece válido após a transformação.

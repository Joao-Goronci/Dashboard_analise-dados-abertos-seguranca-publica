import pandas as pd
import os
from pathlib import Path

root = Path(__file__).resolve().parent
raw = root / 'raw' / 'CSVs'
proc = root / 'processed'
files = ['CRIMES_INFORMATICOS_2025.csv', 'ESTELIONATOS_2025.csv', 'FURTOS_2025.csv', 'HOMICIDIOS_DOLOSOS_2025.csv', 'OBJETOS_FURTADOS_E_ROUBADOS_2025.csv', 'ROUBOS_2025.csv', 'VIOLENCIA_DOMESTICA_2025.csv']


def read(path):
    for enc in ['utf-8', 'utf-8-sig', 'latin1', 'cp1252']:
        try:
            return pd.read_csv(path, sep=',', encoding=enc)
        except Exception:
            pass
    return pd.read_csv(path, sep=',', encoding='latin1')

import sys

def inspect_raw():
    for fn in files:
        p = raw / fn
        df = read(p)
        print('RAW', fn, 'rows', len(df), 'cols', len(df.columns))
        print(df.columns.tolist()[:20])
        print('---')


def inspect_processed():
    print('\nPROCESSED summary')
    for fn in sorted(os.listdir(proc)):
        p = proc / fn
        df = read(p)
        print('PROC', fn, 'rows', len(df), 'cols', len(df.columns))
        print(df.columns.tolist()[:20])
        if fn in ['fact_ocorrencias.csv', 'perfil_vitimas.csv', 'objetos_mais_roubados.csv', 'crimes_por_periodo.csv']:
            print(df.head(2).to_string(index=False))
        print('nulls', df.isna().sum().to_dict())
        print('---')


import unicodedata

def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize('NFKD', text or '')
    return ''.join(ch for ch in normalized if not unicodedata.combining(ch))


def canonicalize_text(series: pd.Series) -> pd.Series:
    cleaned = series.astype('string').str.strip().replace('', pd.NA)
    cleaned = cleaned.apply(lambda x: strip_accents(str(x)) if pd.notna(x) else x)
    cleaned = cleaned.str.upper().str.replace(r"[^A-Z0-9 ]+", ' ', regex=True).str.replace(r'\s+', ' ', regex=True).str.strip()
    return cleaned


def deep_stats():
    def summary(name, series):
        cleaned = canonicalize_text(series).replace('', pd.NA)
        total = len(series)
        missing = cleaned.isna().sum()
        uniq = cleaned.dropna().nunique()
        top = cleaned.dropna().value_counts().head(10).to_dict()
        print(f' {name}: total={total} missing={missing} unique={uniq}')
        print(f' top {name}', top)
        return cleaned

    for fn in files:
        p = raw / fn
        df = read(p)
        print('RAW', fn)
        if 'MUNICÍPIO' in df.columns:
            summary('municipio', df['MUNICÍPIO'])
        if 'BAIRRO' in df.columns:
            summary('bairro', df['BAIRRO'])
        if 'HORA DO FATO' in df.columns:
            summary('hora_fato', df['HORA DO FATO'])
        if 'TIPO OBJETO' in df.columns:
            summary('tipo_objeto', df['TIPO OBJETO'])
            summary('acao_objeto', df['AÇÃO OBJETO'] if 'AÇÃO OBJETO' in df.columns else df['ACAO OBJETO'])
        if 'GENERO' in df.columns or 'SEXO' in df.columns:
            if 'GENERO' in df.columns:
                summary('genero', df['GENERO'])
            if 'SEXO' in df.columns:
                summary('sexo', df['SEXO'])
            if 'COR' in df.columns:
                summary('cor', df['COR'])
            if 'CÚTIS' in df.columns:
                summary('cutis', df['CÚTIS'])
        print('---')


def generic_values():
    pattern = r'^(OUTRO LOCAL|ZONA RURAL|NAO INFORMADO|N[AO]O INFORMADO|IGNORADO|DESCONHECIDO|SEM INFORMACAO|SEM INFORMACAO|INDETERMINADA|S I|S I)$'
    for fn in files:
        p = raw / fn
        df = read(p)
        if 'BAIRRO' not in df.columns:
            continue
        bairro = df['BAIRRO'].astype(str).str.strip().replace('', pd.NA).replace({'nan': pd.NA})
        matches = bairro[bairro.str.upper().str.replace('Ç','C', regex=False).str.match(pattern, na=False)]
        print('RAW', fn, 'generic bairro rows', len(matches))
        print(matches.value_counts().head(20).to_dict())
        print('---')


def stats():
    for fn in files:
        p = raw / fn
        df = read(p)
        print('RAW', fn)
        print(' rows', len(df))
        if 'DATA DO FATO' in df.columns:
            data = df['DATA DO FATO'].astype(str).str.strip().replace('', pd.NA)
            data = data.replace({'nan': pd.NA})
            print(' missing data_fato', data.isna().sum())
            print(' unique data_fato top', data.dropna().value_counts().head(10).to_dict())
        if 'MUNICÍPIO' in df.columns:
            muni = df['MUNICÍPIO'].astype(str).str.strip().replace('', pd.NA).replace({'nan': pd.NA})
            print(' missing municipio', muni.isna().sum())
            print(' municipio unique top', muni.dropna().value_counts().head(10).to_dict())
            print(' municipio blank/na', muni.isna().sum())
        if 'BAIRRO' in df.columns:
            bairro = df['BAIRRO'].astype(str).str.strip().replace('', pd.NA).replace({'nan': pd.NA})
            print(' missing bairro', bairro.isna().sum())
            print(' bairro generic top', bairro.dropna().value_counts().head(15).to_dict())
        if 'HORA DO FATO' in df.columns:
            hrs = df['HORA DO FATO'].astype(str).str.strip().replace('', pd.NA).replace({'nan': pd.NA})
            print(' missing hora_fato', hrs.isna().sum())
            print(' hora unique top', hrs.dropna().value_counts().head(15).to_dict())
        print('---')

if len(sys.argv) > 1 and sys.argv[1] == 'deep':
    deep_stats()
elif len(sys.argv) > 1 and sys.argv[1] == 'generic':
    generic_values()
elif len(sys.argv) > 1 and sys.argv[1] == 'stats':
    stats()
else:
    inspect_raw()
    inspect_processed()

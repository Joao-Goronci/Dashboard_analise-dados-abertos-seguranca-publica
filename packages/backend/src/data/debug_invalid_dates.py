import sys
import pandas as pd
from pathlib import Path

raw = Path(__file__).resolve().parent / 'raw' / 'CSVs'
processed = Path(__file__).resolve().parent / 'processed'
raw_df = pd.read_csv(raw / 'CRIMES_INFORMATICOS_2025.csv', encoding='latin1')
print('RAW columns', raw_df.columns.tolist())
print('RAW rows', len(raw_df))
raw_dates = raw_df['DATA DO FATO'].astype(str)
print('raw missing data_fato', raw_dates.str.strip().replace('', pd.NA).isna().sum())
print('raw nan strings', (raw_dates.str.strip().str.lower() == 'nan').sum())
print('raw unique date sample values including possible bad formats')
print(raw_dates.str.strip().str.lower().value_counts().head(30).to_string())
bad = raw_df[~raw_dates.str.match(r'\d{2}/\d{2}/\d{4}|\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4}|\d{2}/\d{2}/\d{2}', na=False)]
print('bad pattern count', len(bad))
print(bad[['DATA DO FATO']].drop_duplicates().head(20).to_string(index=False))

proc_df = pd.read_csv(processed / 'crimes_informaticos_clean.csv', encoding='utf-8-sig')
print('PROCESSED rows', len(proc_df))
print('processed data_fato null', proc_df['data_fato'].isna().sum())
missing_idx = proc_df.loc[proc_df['data_fato'].isna()].index
if missing_idx.empty:
    print('No processed rows with missing data_fato.')
    sys.exit(0)
idx = missing_idx[0]
print('first missing index', idx)
print(proc_df.loc[idx, ['hora_fato', 'municipio', 'bairro', 'data_fato']].to_dict())
print('raw row at same index:')
print(raw_df.iloc[idx].to_dict())

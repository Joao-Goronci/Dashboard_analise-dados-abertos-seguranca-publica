"""Preprocessamento e geração de datasets analiticos para o dashboard.

O objetivo deste script e transformar os CSVs brutos em:
- tabelas limpas por origem;
- fact table unificada;
- tabelas agregadas para o dashboard;
- KPIs iniciais para a pagina Home.
"""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import pandas as pd


RAW_DIR = Path(__file__).resolve().parent.parent / "raw" / "CSVs"
PROCESSED_DIR = Path(__file__).resolve().parent.parent / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


DATASETS = {
    "crimes_informaticos": {"file_name": "CRIMES_INFORMATICOS_2025.csv", "category": "digital"},
    "estelionatos": {"file_name": "ESTELIONATOS_2025.csv", "category": "patrimonial"},
    "furtos": {"file_name": "FURTOS_2025.csv", "category": "patrimonial"},
    "homicidios": {"file_name": "HOMICIDIOS_DOLOSOS_2025.csv", "category": "violencia_social"},
    "objetos": {"file_name": "OBJETOS_FURTADOS_E_ROUBADOS_2025.csv", "category": "objetos"},
    "roubos": {"file_name": "ROUBOS_2025.csv", "category": "patrimonial"},
    "violencia_domestica": {"file_name": "VIOLENCIA_DOMESTICA_2025.csv", "category": "violencia_social"},
}


COLUMN_ALIASES = {
    "_id": "_id",
    "Nº OCORRÊNCIA": "numero_ocorrencia",
    "Nº OCORRENCIA": "numero_ocorrencia",
    "DATA DO FATO": "data_fato",
    "HORA DO FATO": "hora_fato",
    "GRUPO DE INCIDENTE": "grupo_incidente",
    "TIPO DE INCIDENTE": "tipo_incidente",
    "UF": "uf",
    "MUNICÍPIO": "municipio",
    "MUNICIPIO": "municipio",
    "BAIRRO": "bairro",
    "LOGRADOURO": "logradouro",
    "TIPO DE LOCAL": "tipo_local",
    "TIPO LOCAL": "tipo_local",
    "TIPO OBJETO": "tipo_objeto",
    "AÇÃO OBJETO": "acao_objeto",
    "TIPO DE BOLETIM": "tipo_boletim",
    "TIPO DE ENVOLVIMENTO": "tipo_envolvimento",
    "IDADE": "idade",
    "SEXO": "sexo",
    "GENERO": "genero",
    "GÊNERO": "genero",
    "COR": "cor",
    "CÚTIS": "cutis",
    "COTIS": "cutis",
    "CÓD. INCIDENTE": "cod_incidente",
    "COR VEÍCULO": "cor_veiculo",
    "COR VEICULO": "cor_veiculo",
    "TIPO": "tipo",
    "MARCA": "marca",
    "MODELO": "modelo",
}


DROP_COLUMNS = {"_id", "numero_ocorrencia", "logradouro"}

MONTHS_PT = {1: "JAN", 2: "FEV", 3: "MAR", 4: "ABR", 5: "MAI", 6: "JUN", 7: "JUL", 8: "AGO", 9: "SET", 10: "OUT", 11: "NOV", 12: "DEZ"}
WEEKDAYS_PT = {0: "SEG", 1: "TER", 2: "QUA", 3: "QUI", 4: "SEX", 5: "SAB", 6: "DOM"}


def canonicalize(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", str(text))
    without_accents = "".join(char for char in normalized if not unicodedata.combining(char))
    without_accents = without_accents.upper().strip()
    return re.sub(r"[^A-Z0-9]+", "_", without_accents).strip("_")


def read_csv_with_fallback(path: Path) -> pd.DataFrame:
    for encoding in ("utf-8", "utf-8-sig", "latin1", "cp1252"):
        try:
            return pd.read_csv(path, sep=",", encoding=encoding)
        except UnicodeDecodeError:
            continue
    return pd.read_csv(path, sep=",", encoding="latin1")


def resolve_dataset_path(file_name: str) -> Path:
    path = RAW_DIR / file_name

    if path.exists():
        return path

    if file_name.endswith(".csv.csv"):
        alternate = RAW_DIR / file_name.removesuffix(".csv")
        if alternate.exists():
            return alternate

    alternate = RAW_DIR / f"{file_name}.csv"

    if alternate.exists():
        return alternate

    return path


def rename_by_aliases(df: pd.DataFrame) -> pd.DataFrame:
    lookup = {canonicalize(column): column for column in df.columns}
    rename_map = {}

    for source_name, target_name in COLUMN_ALIASES.items():
        matched_column = lookup.get(canonicalize(source_name))

        if matched_column and matched_column not in rename_map:
            rename_map[matched_column] = target_name

    return df.rename(columns=rename_map)


def clean_text_series(series: pd.Series) -> pd.Series:
    return (
        series.astype("string")
        .str.normalize("NFKC")
        .str.upper()
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
    )


def parse_time_to_hour(series: pd.Series) -> pd.Series:
    cleaned = series.astype("string").str.strip()
    parsed = pd.to_datetime(cleaned, format="%H:%M:%S", errors="coerce")
    missing = parsed.isna()
    
    if missing.any():
        parsed.loc[missing] = pd.to_datetime(cleaned.loc[missing], format="%H:%M", errors="coerce")
    return parsed.dt.hour


def get_period_of_day(hour: float | int | pd.NA) -> str | pd.NA:
    if pd.isna(hour):
        return pd.NA
    hour_int = int(hour)
    if 0 <= hour_int <= 5:
        return "MADRUGADA"
    if 6 <= hour_int <= 11:
        return "MANHA"
    if 12 <= hour_int <= 17:
        return "TARDE"
    return "NOITE"


def add_derived_columns(df: pd.DataFrame, source_name: str, category: str) -> pd.DataFrame:
    df = df.copy()
    df["fonte_dados"] = source_name
    df["categoria_macro"] = category

    if "municipio" in df.columns:
        df["municipio"] = clean_text_series(df["municipio"])
    if "bairro" in df.columns:
        df["bairro"] = clean_text_series(df["bairro"])
    if "uf" in df.columns:
        df["uf"] = clean_text_series(df["uf"])

    if "data_fato" in df.columns:
        df["data_fato"] = pd.to_datetime(df["data_fato"], dayfirst=True, errors="coerce")
        df["ano"] = df["data_fato"].dt.year
        df["mes"] = df["data_fato"].dt.month
        df["mes_nome"] = df["mes"].map(MONTHS_PT)
        df["data_mes"] = df["data_fato"].dt.to_period("M").dt.to_timestamp()
        df["dia_da_semana_num"] = df["data_fato"].dt.dayofweek
        df["dia_da_semana"] = df["dia_da_semana_num"].map(WEEKDAYS_PT)
        df["fim_de_semana"] = df["dia_da_semana_num"].isin([5, 6])

    if "hora_fato" in df.columns:
        df["hora_num"] = parse_time_to_hour(df["hora_fato"])
        df["periodo_dia"] = df["hora_num"].apply(get_period_of_day)
        df["hora_fato"] = df["hora_fato"].astype("string").str.strip()

    if "idade" in df.columns:
        idade = pd.to_numeric(df["idade"], errors="coerce")
        df["idade"] = idade
        df["faixa_etaria"] = pd.cut(
            idade,
            bins=[-1, 14, 17, 24, 34, 44, 54, 64, 200],
            labels=["0_14", "15_17", "18_24", "25_34", "35_44", "45_54", "55_64", "65_PLUS"],
        )

    for column in ("sexo", "genero", "cor", "cutis", "tipo_incidente", "grupo_incidente", "tipo_local", "tipo_boletim", "tipo_envolvimento", "acao_objeto", "tipo_objeto", "marca", "modelo", "cor_veiculo", "tipo"):
        if column in df.columns:
            df[column] = clean_text_series(df[column])

    return df


def clean_dataset(source_name: str, config: dict) -> pd.DataFrame:
    path = resolve_dataset_path(config["file_name"])
    df = read_csv_with_fallback(path)
    df = rename_by_aliases(df)

    existing_drop_columns = [column for column in DROP_COLUMNS if column in df.columns]
    if existing_drop_columns:
        df = df.drop(columns=existing_drop_columns)

    df = add_derived_columns(df, source_name, config["category"])
    df = df.dropna(subset=[column for column in ["data_fato", "municipio"] if column in df.columns])

    output_path = PROCESSED_DIR / f"{source_name}_clean.csv"
    df.to_csv(output_path, index=False, encoding="utf-8-sig")
    return df


def build_fact_table(cleaned_frames: dict[str, pd.DataFrame]) -> pd.DataFrame:
    fact_table = pd.concat(cleaned_frames.values(), ignore_index=True, sort=False)
    fact_table.to_csv(PROCESSED_DIR / "fact_ocorrencias.csv", index=False, encoding="utf-8-sig")
    return fact_table


def build_dimension_tables(fact_table: pd.DataFrame) -> None:
    time_columns = [column for column in ["data_fato", "ano", "mes", "mes_nome", "data_mes", "dia_da_semana_num", "dia_da_semana", "periodo_dia", "fim_de_semana"] if column in fact_table.columns]
    if time_columns:
        fact_table[time_columns].drop_duplicates().to_csv(PROCESSED_DIR / "dim_tempo.csv", index=False, encoding="utf-8-sig")

    location_columns = [column for column in ["uf", "municipio", "bairro", "categoria_macro"] if column in fact_table.columns]
    if location_columns:
        fact_table[location_columns].drop_duplicates().to_csv(PROCESSED_DIR / "dim_localidade.csv", index=False, encoding="utf-8-sig")


def build_kpis_home(fact_table: pd.DataFrame) -> pd.DataFrame:
    valid = fact_table.dropna(subset=[column for column in ["data_fato", "municipio", "tipo_incidente"] if column in fact_table.columns])

    total_crimes = int(len(valid))
    cidade_critica = valid["municipio"].value_counts().idxmax() if "municipio" in valid.columns and not valid.empty else pd.NA
    horario_critico = valid["periodo_dia"].value_counts().idxmax() if "periodo_dia" in valid.columns and not valid.empty else pd.NA
    crime_dominante = valid["tipo_incidente"].value_counts().idxmax() if "tipo_incidente" in valid.columns and not valid.empty else pd.NA

    kpis = pd.DataFrame([
        {"total_crimes": total_crimes, "cidade_critica": cidade_critica, "horario_critico": horario_critico, "crime_dominante": crime_dominante}
    ])
    kpis.to_csv(PROCESSED_DIR / "kpis_home.csv", index=False, encoding="utf-8-sig")
    return kpis


def build_analytics(fact_table: pd.DataFrame, cleaned_frames: dict[str, pd.DataFrame]) -> dict[str, pd.DataFrame]:
    analytics: dict[str, pd.DataFrame] = {}

    crimes_por_mes = (
        fact_table.dropna(subset=["data_mes"]).groupby(["data_mes", "categoria_macro"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["data_mes", "categoria_macro"])
    )
    crimes_por_mes.to_csv(PROCESSED_DIR / "crimes_por_mes.csv", index=False, encoding="utf-8-sig")
    analytics["crimes_por_mes"] = crimes_por_mes

    crimes_por_municipio = (
        fact_table.groupby(["municipio", "categoria_macro"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["quantidade", "municipio"], ascending=[False, True])
    )
    crimes_por_municipio.to_csv(PROCESSED_DIR / "crimes_por_municipio.csv", index=False, encoding="utf-8-sig")
    analytics["crimes_por_municipio"] = crimes_por_municipio

    crimes_por_periodo = (
        fact_table.dropna(subset=["periodo_dia"]).groupby(["periodo_dia", "categoria_macro"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["quantidade", "periodo_dia"], ascending=[False, True])
    )
    crimes_por_periodo.to_csv(PROCESSED_DIR / "crimes_por_periodo.csv", index=False, encoding="utf-8-sig")
    analytics["crimes_por_periodo"] = crimes_por_periodo

    top_bairros = (
        fact_table.dropna(subset=["bairro"]).groupby(["municipio", "bairro", "categoria_macro"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["quantidade", "municipio", "bairro"], ascending=[False, True, True])
    )
    top_bairros.to_csv(PROCESSED_DIR / "top_bairros.csv", index=False, encoding="utf-8-sig")
    analytics["top_bairros"] = top_bairros

    comparativo_furto_roubo = fact_table[fact_table["fonte_dados"].isin(["furtos", "roubos"])]
    comparativo_furto_roubo = (
        comparativo_furto_roubo.dropna(subset=["data_mes"]).groupby(["data_mes", "fonte_dados"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["data_mes", "fonte_dados"])
    )
    comparativo_furto_roubo.to_csv(PROCESSED_DIR / "comparativo_furto_roubo.csv", index=False, encoding="utf-8-sig")
    analytics["comparativo_furto_roubo"] = comparativo_furto_roubo

    objetos = cleaned_frames.get("objetos")
    if objetos is not None and "tipo_objeto" in objetos.columns:
        objetos_mais_roubados = (
            objetos.dropna(subset=["tipo_objeto"]).groupby(["tipo_objeto", "acao_objeto"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["quantidade", "tipo_objeto"], ascending=[False, True])
        )
    else:
        objetos_mais_roubados = pd.DataFrame(columns=["tipo_objeto", "acao_objeto", "quantidade"])
    objetos_mais_roubados.to_csv(PROCESSED_DIR / "objetos_mais_roubados.csv", index=False, encoding="utf-8-sig")
    analytics["objetos_mais_roubados"] = objetos_mais_roubados

    perfil_frames = []
    for dataset_name in ("homicidios", "violencia_domestica"):
        frame = cleaned_frames.get(dataset_name)
        if frame is None:
            continue
        columns = [column for column in ["fonte_dados", "categoria_macro", "sexo", "genero", "cutis", "cor", "idade", "faixa_etaria", "municipio", "bairro"] if column in frame.columns]
        if columns:
            perfil_frames.append(frame[columns])

    perfil_vitimas = pd.concat(perfil_frames, ignore_index=True, sort=False) if perfil_frames else pd.DataFrame()
    perfil_vitimas.to_csv(PROCESSED_DIR / "perfil_vitimas.csv", index=False, encoding="utf-8-sig")
    analytics["perfil_vitimas"] = perfil_vitimas

    crimes_digitais_evolucao = fact_table[fact_table["categoria_macro"] == "digital"]
    crimes_digitais_evolucao = (
        crimes_digitais_evolucao.dropna(subset=["data_mes"]).groupby(["data_mes", "municipio"], as_index=False).size().rename(columns={"size": "quantidade"}).sort_values(["data_mes", "quantidade"], ascending=[True, False])
    )
    crimes_digitais_evolucao.to_csv(PROCESSED_DIR / "crimes_digitais_evolucao.csv", index=False, encoding="utf-8-sig")
    analytics["crimes_digitais_evolucao"] = crimes_digitais_evolucao

    return analytics


def main() -> None:
    cleaned_frames = {}
    for source_name, config in DATASETS.items():
        cleaned_frames[source_name] = clean_dataset(source_name, config)

    fact_table = build_fact_table(cleaned_frames)
    build_dimension_tables(fact_table)
    build_kpis_home(fact_table)
    build_analytics(fact_table, cleaned_frames)

    print(f"Arquivos processados em: {PROCESSED_DIR}")
    print(f"Linhas consolidadas na fact table: {len(fact_table)}")


if __name__ == "__main__":
    main()

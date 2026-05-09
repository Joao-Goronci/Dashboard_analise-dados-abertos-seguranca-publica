from fastapi import APIRouter

from src.services.dashboard_data_service import (
    get_comparativo_furto_roubo,
    get_crimes_digitais_evolucao,
    get_crimes_por_mes,
    get_crimes_por_municipio,
    get_crimes_por_periodo,
    get_dashboard_bundle,
    get_fact_ocorrencias,
    get_kpis_home,
    get_objetos_mais_roubados,
    get_perfil_vitimas,
    get_top_bairros,
)


router = APIRouter(prefix='/api', tags=['dashboard'])


@router.get('/health')
def health_check() -> dict:
    return {'status': 'ok'}


@router.get('/dashboard')
def dashboard_bundle() -> dict:
    return get_dashboard_bundle()


@router.get('/kpis/home')
def kpis_home() -> dict:
    return get_kpis_home()


@router.get('/analytics/crimes-por-mes')
def crimes_por_mes() -> list[dict]:
    return get_crimes_por_mes()


@router.get('/analytics/crimes-por-municipio')
def crimes_por_municipio() -> list[dict]:
    return get_crimes_por_municipio()


@router.get('/analytics/crimes-por-periodo')
def crimes_por_periodo() -> list[dict]:
    return get_crimes_por_periodo()


@router.get('/analytics/top-bairros')
def top_bairros() -> list[dict]:
    return get_top_bairros()


@router.get('/analytics/comparativo-furto-roubo')
def comparativo_furto_roubo() -> list[dict]:
    return get_comparativo_furto_roubo()


@router.get('/analytics/objetos-mais-roubados')
def objetos_mais_roubados() -> list[dict]:
    return get_objetos_mais_roubados()


@router.get('/analytics/perfil-vitimas')
def perfil_vitimas() -> list[dict]:
    return get_perfil_vitimas()


@router.get('/analytics/crimes-digitais-evolucao')
def crimes_digitais_evolucao() -> list[dict]:
    return get_crimes_digitais_evolucao()


@router.get('/datasets/fact-ocorrencias')
def fact_ocorrencias() -> list[dict]:
    return get_fact_ocorrencias()

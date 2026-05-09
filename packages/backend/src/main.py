from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.routes.dashboard_routes import router as dashboard_router


app = FastAPI(title='Seguranca Publica ES API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(dashboard_router)


@app.exception_handler(FileNotFoundError)
async def file_not_found_handler(_request, exc: FileNotFoundError):
    return JSONResponse(
        status_code=503,
        content={
            'error': str(exc),
        },
    )


@app.get('/')
def root() -> dict:
    return {
        'name': 'seguranca-publica-backend',
        'status': 'running',
        'framework': 'FastAPI',
    }

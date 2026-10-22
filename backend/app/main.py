import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.api.v1.router import api_v1_router
from app.data.canonical_store import canonical_store

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nexora.backend")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup and shutdown lifecycle management."""
    logger.info("Initializing NEXORA Analytical Backend v%s", settings.VERSION)
    logger.info("Environment: %s | AI Provider: %s", settings.ENVIRONMENT, settings.AI_PROVIDER)
    
    # Run canonical synthetic integrity check on startup
    violations = canonical_store.validate_referential_integrity()
    if violations:
        logger.warning("Canonical store referential integrity warnings detected:")
        for v in violations:
            logger.warning("  - %s", v)
    else:
        counts = canonical_store.get_summary_counts()
        logger.info(
            "Canonical synthetic store verified: %d cases, %d entities, %d evidence records, %d relationships.",
            counts["cases_count"],
            counts["entities_count"],
            counts["evidence_count"],
            counts["relationships_count"]
        )

    yield

    logger.info("Shutting down NEXORA Analytical Backend.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Evidence-first intelligence analysis and relationship platform backend.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


from app.api.v1.endpoints.health import get_system_health


@app.get("/health", tags=["Health & Diagnostics"])
async def root_health():
    """Root health endpoint for container health probes and diagnostic monitors."""
    return await get_system_health()


@app.get("/", tags=["Root"])
async def root():
    """Root info endpoint providing service descriptor and documentation links."""
    return {
        "service": "NEXORA Intelligence Platform API",
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "operational",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": f"{settings.API_V1_PREFIX}/openapi.json"
        },
        "health": f"{settings.API_V1_PREFIX}/health"
    }



# Global Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTP_EXCEPTION",
                "message": exc.detail,
                "status": exc.status_code,
                "path": str(request.url.path)
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request payload failed schema validation.",
                "status": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "details": exc.errors()
            }
        }
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception processing request to %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing the analytical request.",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR
            }
        }
    )

import json
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.routing import iter_route_contexts
from loguru import logger
from starlette.responses import JSONResponse

from base.error_code import ErrorCode
from base.response import ServiceResponse
from config.app_config import get_app_config
from config.db_config import get_db_config
from config.logging_config import configure_logging, get_logging_config
from db.resources import build_pool
from exception.definition import ServiceError
from harness.runtime.checkpointer import build_checkpointer
from harness.runtime.store import build_store
from routers.agent import agent_router

load_dotenv()


async def print_routes(app: FastAPI):
    route_infos = []
    for route_context in iter_route_contexts(app.routes):
        route_infos.append(
            {
                "path": route_context.path,
                "name": route_context.name,
                "methods": (
                    sorted(route_context.methods) if route_context.methods else []
                ),
            }
        )
    logger.info("Registered routes:")
    for route_info in route_infos:
        logger.info(json.dumps(route_info, ensure_ascii=False))


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging(get_logging_config())
    await print_routes(app)

    pool = await build_pool(get_db_config())
    checkpointer = await build_checkpointer(pool)
    store = await build_store(pool)

    app.state.checkpointer = checkpointer
    app.state.store = store

    logger.info(f"Resources ready: checkpointer=yes")
    try:
        yield
    finally:
        await pool.close()
        logger.info("Resources released")


def include_routers(app: FastAPI):
    app.include_router(agent_router)


def create_app():
    app = FastAPI(lifespan=lifespan)
    include_routers(app)

    @app.exception_handler(RequestValidationError)
    def validation_exception_handler(_request: Request, exc: RequestValidationError):
        error_details = [
            f"field: {'.'.join(map(str, err['loc']))}, message: {err['msg']}"
            for err in exc.errors()
        ]
        service_response = ServiceResponse(
            code=ErrorCode.ParameterInvalid,
            message=f"Request parameter error: {error_details}",
        )

        return JSONResponse(content=service_response.model_dump())

    @app.exception_handler(ServiceError)
    def service_error_handler(_request: Request, exc: ServiceError) -> JSONResponse:
        return JSONResponse(content=exc.to_response().model_dump())

    return app


if __name__ == '__main__':
    app_config = get_app_config()
    uvicorn.run("main:create_app",
                host="0.0.0.0",
                port=app_config.service_port,
                reload=False,
                log_level=app_config.log_level)

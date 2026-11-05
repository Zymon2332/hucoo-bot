from typing import Any

from langgraph.store.base import BaseStore
from langgraph.store.postgres import AsyncPostgresStore
from loguru import logger
from psycopg_pool import AsyncConnectionPool


async def build_store(pool: AsyncConnectionPool[Any]) -> BaseStore:
    store = AsyncPostgresStore(pool)
    # Auto create table
    await store.setup()
    logger.info("Store initialized")
    return store
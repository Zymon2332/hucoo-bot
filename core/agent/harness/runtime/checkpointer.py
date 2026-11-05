from typing import Any

from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from loguru import logger
from psycopg_pool import AsyncConnectionPool


# _checkpointer: BaseCheckpointSaver | None = None
# _checkpointer_lock = threading.Lock()

async def build_checkpointer(pool: AsyncConnectionPool[Any]) -> BaseCheckpointSaver:
    checkpointer = AsyncPostgresSaver(pool)
    # Auto create table
    await checkpointer.setup()
    logger.info("Checkpoint initialized")
    return checkpointer


# def get_checkpointer() -> BaseCheckpointSaver:
#     global _checkpointer, _checkpointer_lock
#     with _checkpointer_lock:
#         if _checkpointer is not None:
#             return _checkpointer
#         _checkpointer = build_checkpointer(pool)
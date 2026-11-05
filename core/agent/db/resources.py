from typing import Any

from psycopg_pool import AsyncConnectionPool

from config.db_config import DBConfig


async def build_pool(cfg: DBConfig) -> AsyncConnectionPool[Any]:
    if not cfg.url:
        raise ValueError("DB_URL is required for postgres backend")
    from psycopg.rows import dict_row
    from psycopg_pool import AsyncConnectionPool

    pool = AsyncConnectionPool(
        conninfo=cfg.url,
        min_size=cfg.pool_min_size,
        max_size=cfg.pool_max_size,
        open=False,
        kwargs={"autocommit": True, "prepare_threshold": 0, "row_factory": dict_row},
    )
    await pool.open()
    return pool

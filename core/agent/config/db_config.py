from functools import lru_cache

from pydantic import Field
from pydantic_settings import SettingsConfigDict

from config.base import BaseConfig


class DBConfig(BaseConfig):
    model_config = SettingsConfigDict(extra="ignore", env_prefix="DB_")

    url: str = Field(..., description="Database backend connection address")

    pool_min_size: int = Field(default=1, description="Minimum connection pool size")

    pool_max_size: int = Field(default=10, description="Maximum connection pool size")


@lru_cache(maxsize=1)
def get_db_config():
    return DBConfig()

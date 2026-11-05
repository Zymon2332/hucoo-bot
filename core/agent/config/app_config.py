from functools import lru_cache

from pydantic import Field
from pydantic_settings import SettingsConfigDict

from config.base import BaseConfig


class AppConfig(BaseConfig):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", env_prefix="APP_")

    service_port: int = Field(default=2000, description="Service port number")

    workers: int = Field(default=1, description="Number of workers")

    log_level: str = Field(default="info", description="Web application log level")


@lru_cache(maxsize=1)
def get_app_config() -> AppConfig:
    return AppConfig()

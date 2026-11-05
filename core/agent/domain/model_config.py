from typing import Any

from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from loguru import logger
from pydantic import BaseModel, Field, HttpUrl


class ModelConfig(BaseModel):
    """Model Configuration"""
    model_name: str = Field(...,
                            description="The model name can use a provider prefix to omit the `model_provider` field, for example, `openai:gpt-5.5`.")

    model_provider: str | None = Field(description="Model Provider Name")

    api_key: str = Field(..., description="Model service api key")

    base_url: HttpUrl = Field(..., description="Custom API endpoint URL.")

    temperature: float | None = Field(default=None, description="Model temperature for controlling randomness.")

    max_tokens: int | None = Field(default=None, description="Maximum number of retry attempts for failed requests.")

    timeout: float | None = Field(default=None, description="Maximum time (in seconds) to wait for a response.")

    extra: dict[str, Any] | None = Field(default=None,
                                         description="Provider-specific parameters or extended parameters")

    def build_chat_model(self) -> BaseChatModel | None:
        options: dict[str, Any] = self.model_dump(
            exclude_none=True,
            exclude={"model_name", "model_provider", "extra"}
        )
        options["base_url"] = str(self.base_url)
        options.update(self.extra or {})
        if self.model_provider:
            options["model_provider"] = self.model_provider
        try:
            return init_chat_model(
                model=self.model_name,
                **options
            )
        except Exception as e:
            logger.warning(f"Failed to initialize chat model={self.model_name} (provider={self.model_provider}): {e}")
            return None

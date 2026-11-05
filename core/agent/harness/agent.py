from typing import Any

from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import AgentMiddleware
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.store.base import BaseStore
from loguru import logger
from pydantic import BaseModel

from domain.model_config import ModelConfig
from harness.tools.tools import get_available_tools

PROMPT_TEMPLATE = """You are a helpful assistant."""

class RuntimeContext(BaseModel):
    pass

class RuntimeState(AgentState):
    pass

def _build_middlewares() -> list[AgentMiddleware]:
    return []

def create_lead_agent(model_conf: ModelConfig,
                      *,
                      checkpointer: BaseCheckpointSaver[Any],
                      store: BaseStore,
                      agent_name: str | None = None):
    model = model_conf.build_chat_model()
    if not model:
        logger.error(f"Create agent failed, cause Model init failed")
        return None
    logger.info(f"Model Profile: {model.profile}")

    return create_agent(
        name=agent_name,
        model=model,
        tools=get_available_tools(),
        system_prompt=PROMPT_TEMPLATE,
        checkpointer=checkpointer,
        store=store,
        middleware=_build_middlewares(),
        state_schema=RuntimeState,
        context_schema=RuntimeContext,
    )

from typing import Any, Annotated

from fastapi import Request, Depends
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.store.base import BaseStore


def get_checkpointer(request: Request) -> BaseCheckpointSaver[Any]:
    return request.app.state.checkpointer

def get_store(request: Request) -> BaseStore:
    return request.app.state.store

CheckpointerDep = Annotated[BaseCheckpointSaver, Depends(get_checkpointer)]
StoreDep = Annotated[BaseStore, Depends(get_store)]
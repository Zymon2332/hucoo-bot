from typing import Optional, Any

from pydantic import BaseModel

from base.error_code import ErrorCode


class ServiceResponse(BaseModel):
    code: int
    message: str
    data: Optional[Any] = None

    def __init__(self, code: ErrorCode, message: Optional[str] = None, data: Optional[Any] = None,
                 **kwargs: Any) -> None:
        super().__init__(
            code=code.code,
            message=message if message is not None else code.msg,
            data=data,
            **kwargs,
        )

    def is_success(self):
        return self.code == ErrorCode.Success.code


def success(data: Any = None) -> ServiceResponse:
    return ServiceResponse(code=ErrorCode.Success, data=data)


def failure(code: ErrorCode, message: str) -> ServiceResponse:
    return ServiceResponse(code=code, message=message)

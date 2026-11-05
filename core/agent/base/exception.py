from base.response import ServiceResponse
from base.error_code import ErrorCode


class BaseError(Exception):
    def __init__(self, code: ErrorCode, message: str) -> None:
        self.code = code
        self.message = message

    def to_response(self) -> ServiceResponse:
        """转换为统一响应信封。"""
        return ServiceResponse(code=self.code, message=self.message)

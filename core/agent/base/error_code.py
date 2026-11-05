from enum import Enum


class ErrorCode(Enum):
    Success = (0, 'Success')

    ParameterInvalid = (1001, 'ParameterInvalid')

    @property
    def code(self):
        return self.value[0]

    @property
    def msg(self):
        return self.value[1]

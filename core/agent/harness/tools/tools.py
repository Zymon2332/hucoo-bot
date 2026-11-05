from langchain_core.tools import BaseTool

from test.test import get_weather
from harness.tools.builtin import get_weather_stream


def get_available_tools() -> list[BaseTool]:
    # TODO 将内置和基于配置的 tool 汇总打包
    return [get_weather_stream]
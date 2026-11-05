"""Built-in Agent toolset"""
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime


# 1.内置工具集
# 2.可根据任务动态使用部分工具 -> Middleware，如根据权限，任务类型
# 3.支持动态增删工具集中的工具，例如用户可自由选择启用哪些工具
# 4.（这个需求待考量）工具自创建，通过 llm 对话创建工具，并启用，工具集新增该工具

# ToolRuntime.emit_output_deltas 是对应工具的流式输出结果
# ToolRuntime.stream_writer 或 get_stream_writer 需要配合 CustomTransformer 以及消费方消费 .custom 事件使用
# 两者的使用场景：
# 前者是工具调用的流式结果，会自动绑定上工具的 tool_call_id，与工具的执行声明周期绑定，工具执行结束通道关闭
# 后者是不绑定工具调用，节点与任务级别，写入自定义事件，没有生命周期绑定，一般用于中间状态的更新、UI 指令、进度提示等

# @tool
# def get_weather(city: str, runtime: ToolRuntime) -> str:
#     """Get weather for a given city"""
#     return f"It's always sunny in {city}"

@tool
def get_weather_stream(city: str, runtime: ToolRuntime) -> str:
    """Get weather for a given city"""
    output_mock = f"It's always sunny in {city}"
    for delta in output_mock.split():
        runtime.emit_output_delta(delta)

    # 最终还是要返回工具结果，否则消费方的工具结果为空
    return output_mock

from uuid import uuid7

from langchain.agents import create_agent, AgentState
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import UsageMetadataCallbackHandler
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import InMemorySaver
from pydantic import BaseModel


def get_weather(city: str) -> str:
    """Get weather for a given city"""
    return f"It's always sunny in {city}"


other_model_kwargs = {
    "api_key": "sk-e6be137b5b344aa39cac4985b0d635d1",
    "base_url": "https://api.deepseek.com",
    # 模型请求的速率限制器
    # "rate_limiter": InMemoryRateLimiter()
}

model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    # 该配置意思是哪些模型配置可以在运行时指定
    # 设置为 None 表示所有配置不可在运行时指定，按当前初始化模型时配置的来
    # 如果是 'any' 表示所有配置都可以在运行时指定，覆盖初始化模型时的配置
    # 所谓运行时配置，指的是通过 create_agent 拿到的 agent 实例，在 invoke 时传入的 config 字典的 configurable 里面的参数
    # 后续可通过 get_config().get('configurable', {})['param'] 拿到对应参数
    configurable_fields=None,
    # 该配置在单应用中配置多个模型时有用，可以指定配置前缀来进行区分
    # 这样在 configurable_fields 中的配置只要加上前缀，后续通过 config["configurable"]["{config_prefix}_{param}"] 即可拿到
    config_prefix=None,
    # 其他模型参数，例如 api_key、base_url、temperature 等
    # 除了在构建 model 时传入外，也可以通过调用模型时动态传入，例如 `model.invoke("hello", reasoning_effort="high")`
    **other_model_kwargs
)

# 模型的信息，本质上是基于 models.dev 的数据拿到的
print(f"Model Profile: {model.profile}")


# model.invoke 模型异常分类
# ModelAuthenticationError: 缺少、无效或过期的 API 密钥（无法重试）
# ModelPermissionDeniedError: 凭证缺乏权限（无法重试）
# ModelInvalidRequestError: 提供商拒绝了该请求（无法重试）
# ModelNotFoundError: 请求的模型未找到（无法重试）
# ModelRateLimitError: 提供者的最大请求数已超出（可重试）
# ModelApiError: 提供商服务器故障（可重试）
# ModelConnectionError: 无法连接到提供者（可重试）
# ModelTimeoutError: 请求超市（可重试）
# ContextOverflowError: 输入内容超出了模型的上下文限制（无法重试）

class CustomAgentState(AgentState):
    user_id: str
    call_count: int


class RuntimeContext(BaseModel):
    user_id: str


agent = create_agent(
    model=model,
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
    # Agent 状态，运行时可修改
    # 自定义 AgentState，继承 AgentState 即可，后续 middleware 每个钩子函数都能拿到
    # 另外 middleware 返回的 AgentState 也能自定义，在后续整个 middleware 执行链上会进行合并
    state_schema=CustomAgentState,
    # 存储 agent 执行期间的每个 step，通常就是短期记忆
    checkpointer=InMemorySaver(),
    # Agent 运行上下文，调用 agent 时必须显式传递
    context_schema=RuntimeContext,
)

# UsageMetadataCallbackHandler 这个回调可以跟踪模型的 token 用量
# 或者使用 get_usage_metadata_callback() 函数，基于上下文管理器监控也可
# with get_usage_metadata_callback() as cb:
#     model_1.invoke("Hello")
#     model_2.invoke("Hello")
#     print(cb.usage_metadata)
usage_callback = UsageMetadataCallbackHandler()

config: RunnableConfig = {
    # 用于区分每次调用的标签，包含本次调用以及子调用
    # 大概功能上就是可以在 callback 中拿到对应 tag 用来过滤的
    # "tags": [],
    # 元数据
    # "metadata": {},
    # 本地调用的执行名称
    # "run_name": "",
    # 要进行的最大并行调用数。如果未提供，则默认为 `ThreadPoolExecutor` 的默认值。
    # "max_concurrency": None,
    # 整个 agent 递归调用次数，默认 25
    # "recursion_limit": 25,
    # 本次执行的唯一 id，不指定默认生成一个 UUID
    "run_id": uuid7(),
    "configurable": {
        "thread_id": str(uuid7()),
    },
    # llm 调用期间的回调函数
    "callbacks": [usage_callback]
}

# 非流式传输 None-Streaming
# result = agent.invoke(
#     input={
#         "messages": [
#             {
#                 "role": "user",
#                 "content": "What's the weather in San Francisca?"
#             }
#         ]
#     },
#     config=config,
#     context=RuntimeContext(user_id="user-123"),
# )
#
# print(result["messages"][-1].content_blocks)

# 流式传输 使用最新的事件流处理

# stream = agent.stream_events(
#     input={"messages": [{"role": "user", "content": "What's the weather in San Francisca?"}]},
#     config=config,
#     version="v3",
#     # 可自定义投影
#     # transformers=
# )

# stream.values 是完整快照
# for snapshot in stream.values:
#     latest_message = snapshot["messages"][-1]
#     if latest_message.content:
#         if isinstance(latest_message, HumanMessage):
#             print(f"User: {latest_message.content}")
#         elif isinstance(latest_message, AIMessage):
#             print(f"Agent: {latest_message.content}")
#     elif latest_message.tool_calls:
#         print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")

# 消息
# ToolMessage 表示工具调用结果消息，其中属性 artifact 不会发送给模型，可以用来放一些下游处理的数据，例如前端可以拿来渲染，这个在 RAG 场景比较有用
# 每个消息的 content 字段可以是字符串也可以是列表，每个列表对应原生的消息格式，例如：
# [
#     {"type": "text", "text": "Hello, how are you?"},
#     {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
# ]
# content_blocks 字段是标准的消息格式，例如 OpenAI 与 Anthropic 的思考字段是不同的，content_blocks 可以将其转为统一的 ReasoningContentBlock 表示形式：
# [
#     {"type": "text", "text": "Hello, how are you?"},
#     {"type": "image", "url": "https://example.com/image.jpg"},
# ]
# 序列化消息 dumpd() load()

# @dynamic_prompt 装饰器可以用来实现动态提示词

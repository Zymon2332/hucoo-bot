import type { MessageBlock } from "@/fixtures/types";
import { TextBlock } from "./text-block";
import { TaskBlock } from "./task-block";
import { OutcomeBlock } from "./outcome-block";
import { AttentionBlock } from "./attention-block";
import { ErrorBlock } from "./error-block";
import { MemoryBlock } from "./memory-block";

export function BlockRenderer({ block }: { block: MessageBlock }) {
  switch (block.kind) {
    case "text":
      return <TextBlock text={block.text} />;
    case "task":
      return <TaskBlock taskId={block.taskId} />;
    case "outcome":
      return <OutcomeBlock taskId={block.taskId} />;
    case "attention":
      return <AttentionBlock taskId={block.taskId} />;
    case "error":
      return (
        <ErrorBlock
          taskId={block.taskId}
          code={block.code}
          message={block.message}
          retryable={block.retryable}
        />
      );
    case "memory":
      return <MemoryBlock memoryId={block.memoryId} quote={block.quote} />;
    default:
      return null;
  }
}

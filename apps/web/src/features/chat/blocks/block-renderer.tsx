import type { MessageBlock } from "@/fixtures/types";
import { TextBlock } from "./text-block";
import { PlanBlock } from "./plan-block";
import { OutcomeBlock } from "./outcome-block";
import { AttentionBlock } from "./attention-block";
import { ErrorBlock } from "./error-block";
import { MemoryBlock } from "./memory-block";

export function BlockRenderer({ block }: { block: MessageBlock }) {
  switch (block.kind) {
    case "text":
      return <TextBlock text={block.text} />;
    case "plan":
      return <PlanBlock workItemId={block.workItemId} />;
    case "outcome":
      return <OutcomeBlock workItemId={block.workItemId} />;
    case "attention":
      return <AttentionBlock workItemId={block.workItemId} />;
    case "error":
      return (
        <ErrorBlock
          workItemId={block.workItemId}
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

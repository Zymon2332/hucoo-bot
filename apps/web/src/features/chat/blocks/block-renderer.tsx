import type { MessageBlock } from "@/fixtures/types";
import { TextBlock } from "./text-block";
import { PlanBlock } from "./plan-block";
import { ResultBlock } from "./result-block";
import { AttentionBlock } from "./attention-block";
import { ReviewBlock } from "./review-block";
import { ErrorBlock } from "./error-block";
import { CandidateBlock } from "./candidate-block";
import { MemoryBlock } from "./memory-block";

export function BlockRenderer({ block }: { block: MessageBlock }) {
  switch (block.kind) {
    case "text":
      return <TextBlock text={block.text} />;
    case "plan":
      return <PlanBlock taskId={block.taskId} />;
    case "result":
      return <ResultBlock taskId={block.taskId} summary={block.summary} />;
    case "attention":
      return <AttentionBlock taskId={block.taskId} />;
    case "review":
      return <ReviewBlock taskId={block.taskId} />;
    case "error":
      return (
        <ErrorBlock
          taskId={block.taskId}
          code={block.code}
          message={block.message}
          retryable={block.retryable}
        />
      );
    case "candidate":
      return <CandidateBlock candidateId={block.candidateId} />;
    case "memory":
      return (
        <MemoryBlock memoryId={block.memoryId} quote={block.quote} />
      );
    default:
      return null;
  }
}

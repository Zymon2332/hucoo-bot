import { MarkdownRenderer } from "@/features/artifacts/renderers/markdown-renderer";

export function TextBlock({ text }: { text: string }) {
  return <MarkdownRenderer content={text} />;
}

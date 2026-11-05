export function HtmlRenderer({ content }: { content: string }) {
  return (
    <iframe
      title="产物预览"
      sandbox=""
      srcDoc={content}
      className="h-full min-h-[420px] w-full rounded-[12px] border border-border bg-white"
    />
  );
}

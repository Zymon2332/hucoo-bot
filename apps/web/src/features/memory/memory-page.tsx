import { useMemo, useState } from "react";
import {
  Brain,
  Check,
  MagnifyingGlass,
  PencilSimple,
  PushPin,
  Trash,
  X,
} from "@phosphor-icons/react";
import { cn } from "@hucoo/ui";
import { Button } from "@hucoo/ui/components/button";
import { Input } from "@hucoo/ui/components/input";
import { Textarea } from "@hucoo/ui/components/textarea";
import { Switch } from "@hucoo/ui/components/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hucoo/ui/components/dialog";
import { MEMORY_CATEGORY_LABEL } from "@/display/labels";
import type { Memory, MemoryCategory } from "@/fixtures/types";
import { useDemoStore } from "@/stores/demo-store";
import { SectionHeading } from "@/components/primitives";

const CATEGORIES: Array<{ id: MemoryCategory | "all"; label: string }> = [
  { id: "all", label: "全部" },
  { id: "preference", label: "偏好" },
  { id: "about", label: "关于我" },
  { id: "project", label: "项目" },
  { id: "relationship", label: "关系" },
  { id: "routine", label: "习惯" },
];

export function MemoryPage({ focusId }: { focusId?: string }) {
  const memories = useDemoStore((state) => state.memories);
  const togglePin = useDemoStore((state) => state.toggleMemoryPin);
  const removeMemory = useDemoStore((state) => state.removeMemory);
  const acceptSuggestion = useDemoStore((state) => state.acceptSuggestion);
  const dismissSuggestion = useDemoStore((state) => state.dismissSuggestion);
  const updateMemory = useDemoStore((state) => state.updateMemory);
  const updateCategory = useDemoStore((state) => state.updateMemoryCategory);
  const memoryEnabled = useDemoStore((state) => state.profile.memoryEnabled);
  const updateProfile = useDemoStore((state) => state.updateProfile);

  const [category, setCategory] = useState<MemoryCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Memory | null>(
    focusId ? (memories.find((memory) => memory.id === focusId) ?? null) : null,
  );
  const [editContent, setEditContent] = useState(editing?.content ?? "");
  const [editCategory, setEditCategory] = useState<MemoryCategory>(
    editing?.category ?? "preference",
  );
  const [editPinned, setEditPinned] = useState(Boolean(editing?.pinned));

  const suggested = memories.filter((memory) => memory.suggested);
  const filtered = useMemo(
    () =>
      memories.filter((memory) => {
        if (memory.suggested) return false;
        if (category !== "all" && memory.category !== category) return false;
        if (query.trim() && !memory.content.includes(query.trim())) return false;
        return true;
      }),
    [memories, category, query],
  );

  function openEditor(memory: Memory) {
    setEditing(memory);
    setEditContent(memory.content);
    setEditCategory(memory.category);
    setEditPinned(Boolean(memory.pinned));
  }

  function saveEditor() {
    if (!editing) return;
    updateMemory(editing.id, {
      content: editContent.trim(),
      pinned: editPinned,
    });
    updateCategory(editing.id, editCategory);
    setEditing(null);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-16 pt-6 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] tracking-tight">记忆</h1>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              小满记住的关于你的事。你可以随时查看、修改或删除。
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">
              {memoryEnabled ? "记忆已开启" : "记忆已关闭"}
            </span>
            <Switch
              checked={memoryEnabled}
              aria-label="记忆开关"
              onCheckedChange={(checked) => {
                updateProfile({ memoryEnabled: checked });
              }}
            />
          </div>
        </header>

        {suggested.length > 0 && (
          <section className="mt-7">
            <SectionHeading>待确认</SectionHeading>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {suggested.map((memory) => (
                <div
                  key={memory.id}
                  className="rounded-[14px] border border-dashed border-clay/30 bg-accent/25 px-3.5 py-3"
                >
                  <p className="text-[12.5px] leading-relaxed">{memory.content}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Button
                      size="xs"
                      onClick={() => acceptSuggestion(memory.id)}
                    >
                      <Check size={11} />
                      记住
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => dismissSuggestion(memory.id)}
                      className="text-muted-foreground"
                    >
                      <X size={11} />
                      忽略
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)]">
          <aside>
            <h2 className="px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-section-label">
              分类
            </h2>
            <div className="mt-1 space-y-0.5">
              {CATEGORIES.map((item) => {
                const count =
                  item.id === "all"
                    ? memories.filter((memory) => !memory.suggested).length
                    : memories.filter(
                        (memory) =>
                          !memory.suggested && memory.category === item.id,
                      ).length;
                const active = category === item.id;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant={active ? "secondary" : "ghost"}
                    onClick={() => setCategory(item.id)}
                    className={cn(
                      "h-8 w-full justify-between px-2 text-[12px] font-normal",
                      !active && "text-muted-foreground",
                    )}
                  >
                    {item.label}
                    <span className="text-[10px] text-muted-foreground/70">
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="relative">
              <MagnifyingGlass
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索记忆内容"
                className="h-9 pl-8"
              />
            </div>

            <div className="mt-3 space-y-2">
              {filtered.map((memory) => (
                <article
                  key={memory.id}
                  className="group rounded-[14px] border border-border bg-card/70 px-3.5 py-3 transition-colors hover:border-clay/25"
                >
                  <div className="flex items-start gap-2">
                    <Brain size={14} className="mt-0.5 shrink-0 text-clay/60" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] leading-relaxed">
                        {memory.content}
                      </p>
                      <p className="mt-1 text-[10.5px] text-muted-foreground">
                        {MEMORY_CATEGORY_LABEL[memory.category]}
                        {memory.source ? ` · 来自${memory.source}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={memory.pinned ? "取消固定" : "固定"}
                        onClick={() => togglePin(memory.id)}
                        className={cn(
                          "text-muted-foreground",
                          memory.pinned && "text-clay",
                        )}
                      >
                        <PushPin size={12} weight={memory.pinned ? "fill" : "regular"} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="编辑"
                        onClick={() => openEditor(memory)}
                        className="text-muted-foreground"
                      >
                        <PencilSimple size={12} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="删除"
                        onClick={() => removeMemory(memory.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-[14px] border border-dashed border-border px-4 py-10 text-center">
                  <p className="text-sm">没有匹配的记忆</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    换个分类或关键词试试。
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑记忆</DialogTitle>
            <DialogDescription>
              修改后，小满之后会按新的内容理解你。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows={3}
              className="min-h-20 resize-none"
            />
            <div>
              <p className="mb-1.5 text-[11px] text-muted-foreground">分类</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.filter((item) => item.id !== "all").map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    size="xs"
                    variant={
                      editCategory === item.id ? "secondary" : "outline"
                    }
                    onClick={() => setEditCategory(item.id as MemoryCategory)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2">
              <span className="text-[12px]">固定在记忆顶部</span>
              <Switch
                checked={editPinned}
                aria-label="固定记忆"
                onCheckedChange={setEditPinned}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(null)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={saveEditor}
              disabled={!editContent.trim()}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

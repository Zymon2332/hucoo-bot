export interface ContainerInfo {
  status: "online" | "offline";
  os: string;
  cpu: string;
  memory: string;
  uptime: string;
  workspace: string;
}

export const CONTAINER: ContainerInfo = {
  status: "online",
  os: "Ubuntu 24.04",
  cpu: "2 vCPU",
  memory: "4 GB",
  uptime: "12 分 41 秒",
  workspace: "/home/agent/workspace",
};

export const TERMINAL_LINES = [
  "$ cd /home/agent/workspace",
  "$ git status --short",
  "  M apps/web/src/auth/session.ts",
  "  M apps/web/src/auth/login.tsx",
  "$ bun test auth",
  "  ✓ login (9)",
  "  ✓ permissions (7)",
  "  ✓ session (5)",
  "  24 passed, 0 failed",
  "$ git diff --stat",
  "  apps/web/src/auth/session.ts | 83 ++++++++++++++++-----",
  "  apps/web/src/auth/login.tsx  | 12 +++++",
  "  2 files changed, 61 insertions(+), 34 deletions(-)",
];

export const WORKSPACE_FILES = [
  { path: "apps/web/src/auth/session.ts", status: "modified" },
  { path: "apps/web/src/auth/login.tsx", status: "modified" },
  { path: "apps/web/src/auth/session.test.ts", status: "added" },
  { path: "apps/web/src/auth/permissions.test.ts", status: "added" },
  { path: "docs/auth-refactor.md", status: "added" },
  { path: "package.json", status: "clean" },
];

export const PROCESSES = [
  { name: "claude-code", detail: "session 6a21 · 重构登录模块", cpu: "12%", memory: "286 MB" },
  { name: "bun test", detail: "auth · 24 tests", cpu: "4%", memory: "92 MB" },
  { name: "codex", detail: "session 3c1d · 已结束", cpu: "0%", memory: "0 MB" },
];

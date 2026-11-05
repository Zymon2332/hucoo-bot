import type { Memory } from "./types";

export const MEMORIES: Memory[] = [
  {
    id: "m-tone",
    category: "preference",
    content: "喜欢简洁、直接的回复，不需要客套和总结段落。",
    source: "与「整理本周产品周报」的对话",
    pinned: true,
  },
  {
    id: "m-morning",
    category: "routine",
    content: "工作日早上 9 点前希望看到当天日程与三件最重要的事。",
    source: "与「早间简报」的对话",
    pinned: true,
  },
  {
    id: "m-role",
    category: "about",
    content: "负责产品设计，同时参与前端实现，经常需要在设计与代码之间切换。",
    source: "与「个人助理 onboarding」的对话",
  },
  {
    id: "m-project",
    category: "project",
    content: "当前主项目是 Hucoo 个人助理，目标是把工作台收敛成对话式界面。",
    source: "与「本周产品周报」的对话",
    pinned: true,
  },
  {
    id: "m-review",
    category: "preference",
    content: "评审安排在工作日的 11:00–16:00，避免周一上午和周五下午。",
    source: "与「安排下周行程」的对话",
  },
  {
    id: "m-dentist",
    category: "about",
    content: "牙医预约每三个月一次，通常安排在周三下午。",
    source: "与「安排下周行程」的对话",
  },
  {
    id: "m-team",
    category: "relationship",
    content: "设计团队有 4 人，周会固定在周一 10:00；后端对接人是阿哲。",
    source: "手动添加",
  },
  {
    id: "m-writing",
    category: "preference",
    content: "周报偏好「进展 / 风险 / 下周计划」三段式，控制在 1500 字以内。",
    source: "与「本周产品周报」的对话",
  },
  {
    id: "m-coffee",
    category: "preference",
    content: "下午更倾向安排需要专注的工作，会议尽量集中在上午。",
    suggested: true,
  },
  {
    id: "m-travel",
    category: "about",
    content: "旅行偏好步行可达、安静、有本地小店的地方，不喜欢赶景点。",
    suggested: true,
  },
];

export function getMemory(id: string): Memory | undefined {
  return MEMORIES.find((memory) => memory.id === id);
}

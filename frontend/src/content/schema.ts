/**
 * [INPUT]: 无运行时依赖；仅描述作者手写内容的形状
 * [OUTPUT]: 导出 WorkSource、WorkMedia、WorkCategoryKey 类型与 WORK_CATEGORIES 常量
 * [POS]: content 模块的作者契约。works/*.ts 按它书写，api/static.ts 把它映射为 evidentfolio 的 Project。
 *        它刻意比 Project 精简：作者只写「问题 → 决策 → 贡献 → 证据」，其余字段由适配器补齐。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ────────────────────────── 分类 ────────────────────────── */

export const WORK_CATEGORIES = {
  eval: { name: 'AI 评测', description: '为模型和 Agent 定一把可复核的尺子。' },
  agent: { name: 'Agent 系统', description: '多 Agent 编排、人在回路与流程自动化。' },
  app: { name: 'AI 应用', description: '面向真实用户的 AI 产品，从 PRD 到上线。' },
  infra: { name: '个人 AI 基建', description: '记忆、知识与上下文：给自己用的 AI 底座。' },
  tool: { name: '效率工具', description: '把重复劳动交给脚本与 Skill。' },
} as const

export type WorkCategoryKey = keyof typeof WORK_CATEGORIES

/* ────────────────────────── 素材 ────────────────────────── */

/** 一张静态图片。src 是 public/ 下的绝对路径，宽高用于预留版面、避免跳动。 */
export interface WorkMedia {
  src: string
  width: number
  height: number
  caption?: string
}

/* ────────────────────────── 作品 ────────────────────────── */

export interface WorkSource {
  /** 路由标识，同时作为 Project.uuid */
  slug: string
  /** published 公开；draft 归属待确认，仅本地核对时可见；archived 本人主动下架，永不公开 */
  status: 'published' | 'draft' | 'archived'
  /** 首页「精选」列表 */
  featured: boolean
  /** 排序：数字越小越靠前 */
  order: number
  category: WorkCategoryKey
  /** resume：简历所列项目；personal：简历外的个人项目 */
  origin: 'resume' | 'personal'
  title: string
  /** 一句话定位：它是什么，给谁用 */
  subtitle: string
  /** 产品原则关键词，首页章节与案例页眉使用 */
  principle?: string
  role: string
  team?: number
  /** YYYY-MM；只知道年份时写 YYYY */
  start: string
  end?: string
  /** 成熟度：已发布 / 可用 / Demo / 技术验证版 */
  state: string
  /** 获奖或参赛背景，映射为 Certificate */
  award?: { name: string; issuer: string; date: string }
  /** 案例页导语：一段话讲清价值 */
  summary: string
  /** Markdown：用户与问题 */
  problem: string
  /** 关键产品决策：title 是决定本身，why 是取舍理由 */
  decisions: Array<{ title: string; why: string }>
  /** 本人做了什么（团队项目必须如实区分） */
  contributions: string[]
  /** 可验证成果：每条都应能指回证据 */
  outcomes: string[]
  metrics: Array<{ value: string; label: string; source?: string }>
  stack: string[]
  tags: string[]
  links: Array<{ label: string; url: string }>
  cover?: WorkMedia
  gallery?: WorkMedia[]
  /** 额外的 Markdown 段落，例如排名表 */
  notes?: Array<{ title: string; body: string }>
  reflection?: string
}

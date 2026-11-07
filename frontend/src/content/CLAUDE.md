# content/

L2 | 父级: /CLAUDE.md

作品集的数据源。作者手写 TypeScript，编译期即校验形状；没有后台，也没有数据库。
数据流向单一：`works/*.ts` → `works/index.ts`（WORKS）→ `api/static.ts`（映射为 Project）→ `publicApi` → 主题页面。
主题只认 evidentfolio 的 Project 契约，不直接读 WorkSource；例外是 `HOME` 与 `PROFILE`，它们是本站专属叙事，由 cosmo 视图直接读取。

## 真实性约束

- 每个数字都写出处：`metrics[].source` 指向 README 段落、文档路径或线上地址。
- 团队项目在 `role` 与 `contributions` 中只写本人部分，并注明队友负责的部分。
- 本人角色未确认的作品写 `status: 'draft'`。草稿不进入任何公开响应；`VITE_SHOW_DRAFTS=1` 时本地可见。
- 首页演示中的对话与草稿是示意文案，`home.ts` 头部已声明，不冒充真实用户数据。

## 作品状态

- `published`：进入公开列表、详情与总数。
- `draft`：归属待确认。默认不公开，`VITE_SHOW_DRAFTS=1` 时本地可见。
- `archived`：本人主动下架。任何模式都不公开，数据保留以便恢复。
- 首页章节与演示引用的作品必须仍是 `published`。下架作品若被引用，同步替换出处。

## 成员清单

index.ts: 模块唯一出口，再导出 WORKS、SITE、PROFILE、HOME 与作者类型；外部只写 `@/content`
schema.ts: 作者契约 WorkSource，问题 → 决策 → 贡献 → 证据四段式；WORK_CATEGORIES 定义 eval / agent / app / infra / tool 五个分类
site.ts: assetUrl() 是 public/ 资源路径的唯一出口，给路径加 vite base 前缀且幂等；CONTACTS 是联系方式唯一数据源（五项，2026-11-06 核对自 bixiaoyang.pages.dev）；SITE 由它生成 contact_methods；PROFILE 是关于页履历
home.ts: 首页叙事 HOME，序章 + 五条产品原则 + 精选 + 结语；每章 `work` 字段绑定一件作品的 slug
content.test.ts: 守门测试，校验 slug 唯一、素材存在于 public/、首页引用可解析、四段式不缺段、草稿不外露

## works/ 成员清单

括号里的数字是 order。公开列表按 order 升序；2–5 固定为 personal-memory → second-brain → obsidian-quick-capture → reading-coach。
works/index.ts: WORKS 数组，按 order 升序；新增作品必须在此登记
works/agent-benchmark.ts: personal-agent-benchmark（1，精选），首页 02 立标准
works/memory.ts: personal-memory（2，精选）与 second-brain（3），个人 AI 基建。两件都有设计理念附注（出处见文件头）与脱敏源码包（public/downloads/，只含运行时脚本与工具地图，排除记忆正文、审计数据和测试用例）
works/tools.ts: obsidian-quick-capture（4）、html-trio（13，links 指向 public/downloads/html-trio.zip）、kb（16，archived）、resume-pipeline（17，archived）、model-release-radar（18，archived）
works/agents.ts: reading-coach（5，阅读陪练）、lvbangpt（12，简历项目，获奖）、morning-brief（14，archived）
works/insightflow.ts: insightflow（6，简历项目，获奖），首页 01 定问题；技术实现由队友主导
works/yushengsheng.ts: yushengsheng（7），首页 03 留给人；技术验证版，尚无试用数据
works/content-pipeline.ts: content-pipeline（8），首页 05 回流
works/jingzhun.ts: jingzhun（9），电商视觉质检 Demo
works/dsh-plugins.ts: dsh-plugins（10，archived，待打磨后恢复），DeepSeek Harness 插件组
works/campus.ts: campus-club-match（11，已上线）与 workstation（15，archived）
works/drafts.ts: g-exo（19）与 finassistant（20），status 为 draft，待本人确认角色后发布

## 新增一件作品

1. 在 `works/` 新建文件或追加到同类文件，导出一个 WorkSource。
2. 在 `works/index.ts` 登记。
3. 截图放入 `public/works/{slug}/`，在 `cover` / `gallery` 写明宽高。
4. 运行 `npx vitest run src/content`。
5. 更新本文件的成员清单。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md

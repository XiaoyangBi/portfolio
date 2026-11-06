/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 personalMemory、secondBrain 两个作品数据
 * [POS]: content/works 的成员，「个人 AI 基建」分类的两件主作品。
 *        二者有明确边界：second-brain 只产出候选，写入 personal-memory 必须经本人确认。
 *        数据来源：~/personal-memory 提交记录；~/second-brain/CLAUDE.md 与 Vault「开始这里.md」。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const personalMemory: WorkSource = {
  slug: 'personal-memory',
  status: 'published',
  featured: true,
  order: 6,
  category: 'infra',
  origin: 'personal',
  title: 'personal-memory',
  subtitle: '不绑定任何 AI 工具的个人记忆层：WorkBuddy、CodeBuddy、Claude Code、Codex 共读一份。',
  principle: '克制',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  end: '2026-11',
  state: '自用中',
  summary:
    '每个 AI 工具都在维护自己的「记忆」，彼此割裂、互相冲突，还会无节制地塞满上下文。personal-memory 把记忆从工具里拿出来，变成一份我拥有的、有预算、有审批的文件。',
  problem: `我同时用四个 AI 工具。每个工具都有一份关于我的记忆：

- 同一条偏好，在 A 里是新的，在 B 里是旧的；
- 工具自动写入的「记忆」，我不知道它写了什么；
- 记忆越多，召回越多，上下文越乱。

问题不是「记不住」，而是「记得太随意」。`,
  decisions: [
    {
      title: '五层两级结构，冲突时高权重优先，最终由本人裁决',
      why: '记忆有不同的稳定性：身份事实、长期偏好、项目上下文、临时状态不能同权。权重 W1–W5 给出默认裁决顺序。',
    },
    {
      title: '召回有硬预算：8000 字符，分层配额',
      why: '预算是对上下文污染的硬约束。检索先用 BM25；向量检索等真实遗漏证明有必要时再加。',
    },
    {
      title: '写入必须经本人确认',
      why: '经 curator 流程写入；被替代的记忆用 supersede 留痕，带生命周期字段。AI 可以提议，不能直接改写「我是谁」。',
    },
    {
      title: '数据不足时，不新增层级',
      why: '用访问回执（ack）记录每条记忆是否真的被用到。证据不足以支撑 procedural 层，就明确决定先不加。',
    },
  ],
  contributions: [
    '设计五层两级的记忆模型与权重规则。',
    '实现召回打包、编译、访问回执与写入门禁的运行时脚本。',
    '实现长任务状态记录（NOTES / HISTORY），支持跨会话续做。',
    '建立回归测试，持续迭代约一个月。',
  ],
  outcomes: [
    '四个 AI 工具共读同一份记忆。',
    '回归测试 53 项全部通过（提交记录）。',
    '约 36 次提交，2026-10-03 至 11-04 持续迭代。',
  ],
  metrics: [
    { value: '8,000', label: '字符召回硬预算' },
    { value: '4', label: '个 AI 工具共读一份记忆' },
    { value: '53', label: '项回归测试全绿' },
    { value: 'W1–W5', label: '五级权重裁决冲突' },
  ],
  stack: ['Markdown + frontmatter', 'Python', 'BM25'],
  tags: ['记忆', '上下文工程', '人在回路', '工具无关'],
  links: [],
  reflection:
    '做记忆系统，最难的不是「多记一点」，而是决定什么不记、什么不召回。这和我在评测集里测「克制」是同一个问题。',
}

export const secondBrain: WorkSource = {
  slug: 'second-brain',
  status: 'published',
  featured: false,
  order: 7,
  category: 'infra',
  origin: 'personal',
  title: 'second-brain',
  subtitle: '把收藏夹变成可追溯的 Obsidian 知识库：小红书、知乎、公众号、YouTube、B 站。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-11',
  end: '2026-11',
  state: '自用中',
  summary:
    '收藏了不看；AI 摘要会丢信息、会编造；个人判断和原文混在一起。second-brain 把各平台内容转成本地笔记，原文留底，摘要不覆盖原文，新概念等我确认后才建立双链。',
  problem: `收藏夹是知识的墓地。即使用 AI 做摘要，也有三个问题：

1. 长视频只总结了前半段；
2. 摘要里混进了原文没有的内容；
3. 我的批注和原文混在一起，重跑一次就被覆盖。`,
  decisions: [
    {
      title: '图片和音频只在本机处理',
      why: '收藏内容常含个人信息。转写用 faster-whisper，OCR 用 macOS Vision，模型用本地 Ollama。',
    },
    {
      title: '切片并留底，保证「读到最后一分钟」',
      why: '音频每 10 分钟切一片，文本每 8000 字切一段，原始记录全部保留。摘要可以重跑，原文不会丢。',
    },
    {
      title: '新概念先进待确认区',
      why: '本人打勾后才 promote 并建立双链。批注不会被重跑覆盖。',
    },
    {
      title: '与 personal-memory 划清边界',
      why: 'reflect 只读记忆；distill 只产出候选，不直接写入。知识库和记忆库各管一件事。',
    },
  ],
  contributions: [
    '设计 ingest / promote / reflect / distill / doctor 五个命令。',
    '实现转写、OCR、清洗、分析、Vault 写入等 14 个模块。',
    '编写 7 个测试文件。',
  ],
  outcomes: ['Vault 已入库 36 篇原始笔记，含 21 条历史链接。'],
  metrics: [
    { value: '5', label: '个平台来源' },
    { value: '14', label: '个处理模块' },
    { value: '10 min', label: '音频切片粒度，原文全部留底' },
  ],
  stack: ['Python', 'faster-whisper', 'yt-dlp', 'macOS Vision', 'Ollama', 'Obsidian'],
  tags: ['知识管理', '本地优先', '可追溯'],
  links: [],
}

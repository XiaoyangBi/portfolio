/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 insightflow 作品数据
 * [POS]: content/works 的成员，简历项目。首页「01 / 定问题」章节引用它。
 *        角色口径：本人负责需求与方法论设计，技术实现由队友主导，文案必须保持这一区分。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const insightflow: WorkSource = {
  slug: 'insightflow',
  status: 'published',
  featured: true,
  order: 6,
  category: 'agent',
  origin: 'resume',
  title: 'InsightFlow',
  subtitle: '竞品分析 Multi-Agent 系统：从一句「想调研一下」，到可执行的结论。',
  principle: '定问题',
  role: '产品经理 · 需求与方法论设计（技术实现由队友主导）',
  start: '2026-05',
  end: '2026-07',
  state: '可用',
  award: { name: '2026 字节跳动 AI 全栈挑战赛 · 优秀项目奖', issuer: '字节跳动', date: '2026-07-04' },
  summary:
    'InsightFlow 面向产品经理与行研。它要回答的不是「竞品做了什么」，而是「这对我有什么用」。系统先用对话把模糊意图收敛成结构化配置，再由多个 Agent 采集、分析、写作与审查；审查不过时，决定权交还给人。',
  problem: `传统竞品分析常停在信息罗列。来源说不清，结论落不到决策上。

用户的起点往往只是一句话：「想调研一下 xx」。直接让 Agent 去搜，产出会「不可信、不可控」——搜到什么写什么，错了也没人拦。

我们给合格线下了定义：**答不全「五问」的分析，就算不合格。**`,
  decisions: [
    {
      title: '方法论先于 AI',
      why: '先写清三步框架（定义 → 拆解 → 结论）、五类竞品（核心 / 标杆 / 潜力 / 替代 / 避坑）和「五问」合格线。Agent 按标准执行，而不是自由发挥。',
    },
    {
      title: '访谈 Agent 放在流水线之外',
      why: '多轮流式对话先把「想调研一下」收敛为目标产品、关注维度、竞品集合，再进入采集 → 分析 → 报告 → 审查的 DAG。需求没问清楚，后面跑得越快，错得越远。',
    },
    {
      title: '审查有硬门槛，失败能归因',
      why: 'ReviewAgent 打分 ≥ 70 且「证据」「竞品有效性」两道硬门槛都过，才放行。硬门槛不过，分数封顶 60 并回跳采集节点。缺来源回采集，缺产物回分析，只是表达问题回报告。',
    },
    {
      title: 'Human-in-the-Loop：不过关就暂停，交给人决定',
      why: '审查不达标时，工作流暂停并生成结构化决策请求。用户可以回退重做、替换竞品、移除竞品、强制通过或中止；最多修订 3 次。这是效率与可靠之间的核心取舍。',
    },
    {
      title: '过程面板讲「系统在做什么」，不刷 token 流',
      why: '用户需要知道进度与原因，不需要看模型逐字输出。每次重试用独立的执行批次隔离，新旧数据不混。',
    },
  ],
  contributions: [
    '设计竞品分析方法论：三步框架、五类竞品、「五问」合格线。',
    '拆分访谈、采集、分析、报告、审查五类 Agent，定义职责边界。',
    '设计 Human-in-the-Loop 决策机制与 ReviewAgent 审查维度。',
    '设计访谈 Agent 的追问策略，把模糊意图收敛为结构化配置。',
  ],
  outcomes: [
    '获 2026 字节跳动 AI 全栈挑战赛优秀项目奖（团队「DAGents 竞析组」）。',
    'CHANGELOG 记录 20 条迭代（2026-05-25 至 06-03）。',
    '本地可跑通「访谈 → 分析 → 审查 → 人工决策 → 报告」完整流程。',
  ],
  metrics: [
    { value: '5', label: '类核心 Agent 分工' },
    { value: '≥ 70', label: '审查放行分数线，另有 2 道硬门槛' },
    { value: '3', label: '次修订上限，超限交给人' },
    { value: '20', label: '条迭代记录（CHANGELOG）' },
  ],
  stack: ['LangGraph', 'FastAPI', 'PostgreSQL', 'Next.js', 'React Flow', 'Tavily'],
  tags: ['Multi-Agent', 'Human-in-the-Loop', '竞品分析', '方法论'],
  links: [{ label: 'GitHub', url: 'https://github.com/tling4/InsightFlowX' }],
  cover: { src: '/works/insightflow/cover.jpg', width: 1080, height: 1440, caption: '获奖复盘封面：从朴素 SWOT 被打回，到「五问」合格线与自动化流水线。' },
  reflection:
    '第一版是朴素的 SWOT，被打回了。之后我先改的不是 Prompt，而是合格线：标准先于模型。',
}

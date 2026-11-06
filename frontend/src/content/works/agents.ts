/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 lvbangpt、morningBrief、readingCoach 三个作品数据
 * [POS]: content/works 的成员，「Agent 系统」分类中体量较小的三件作品。
 *        lvbangpt 是简历项目，文案只使用简历已写明的事实。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const lvbangpt: WorkSource = {
  slug: 'lvbangpt',
  status: 'published',
  featured: false,
  order: 12,
  category: 'agent',
  origin: 'resume',
  title: 'LvBanGPT',
  subtitle: '多 Agent 旅行智能助手：行程规划、即时问答与内容生成。',
  role: '核心成员 · 多 Agent 产品架构设计',
  start: '2024',
  state: '已开源',
  award: { name: '2024 科大讯飞星火杯 · 优秀奖', issuer: '科大讯飞', date: '2024' },
  summary:
    '面向 C 端的 AI 旅行规划与问答产品。基于多 Agent 架构与 RAG，覆盖行程规划、即时问答与内容生成三类核心场景，提升用户决策效率与信息可靠性。',
  problem: `旅行决策的信息又多又散：攻略、地图、天气、门票，散落在不同 App。

通用大模型能写出一份像样的行程，但信息常常过期，也无法回答「明天下雨怎么办」这类实时问题。`,
  decisions: [
    {
      title: '按旅行全流程拆分三类 Agent',
      why: '规划、问答、内容生成三类 Agent 各司其职，按用户意图路由与协同，而不是让一个大 Prompt 包办一切。',
    },
    {
      title: 'RAG 作为可选流程，配合实时工具调用',
      why: '问答场景引入可选 RAG，结合地图、天气、旅行搜索等外部 API，获取实时信息，减少过期与编造。',
    },
  ],
  contributions: ['从用户旅行全流程出发，拆分规划 / 问答 / 内容生成三类 Agent。', '设计意图路由与 Agent 协同方式。', '推动 RAG 与外部工具调用在问答场景落地。'],
  outcomes: ['获 2024 科大讯飞星火杯优秀奖。', 'GitHub 222 Stars。'],
  metrics: [
    { value: '222', label: 'GitHub Stars' },
    { value: '3', label: '类核心 Agent' },
  ],
  stack: ['多 Agent', 'RAG', '讯飞星火', '地图 / 天气 API'],
  tags: ['C 端', '旅行', 'RAG', '工具调用'],
  links: [{ label: 'GitHub', url: 'https://github.com/yaosenJ/LvBanGPT' }],
}

export const morningBrief: WorkSource = {
  slug: 'morning-brief',
  status: 'archived',
  featured: false,
  order: 14,
  category: 'agent',
  origin: 'personal',
  title: '投研晨报 Agent',
  subtitle: '每天 10:00 自动生成一份七节结构的个人投研晨报，每个观点都标注出处。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  end: '2026-11',
  state: '每日运行',
  summary:
    '每天手工看收评、播客和研报很费时间，引用来源也容易混乱。这个定时 Agent 从三层材料源取数，按时效分档引用，缺什么就在报告里写明缺什么。',
  problem: `我每天早上要读的材料来自三个地方：知识库、券商研报、本地笔记。

手工整理有两个问题：耗时，以及「这个观点是谁说的、哪天说的」很快就记不清了。`,
  decisions: [
    {
      title: '材料源分三层，任一层不可用时降级而不中断',
      why: '主数据源不可用时，输出简版报告，并写明缺了哪部分。用户知道自己看的是不完整的报告。',
    },
    {
      title: '按发布日期分档引用',
      why: '实测发现检索结果不按时间排序。7 天内可直接引用；7–30 天只作背景并标日期；超过 30 天不采用。',
    },
    {
      title: '刻意不接入「AI 模拟分析师」',
      why: '一是耗时 60–300 秒；二是它会污染「观点标注出处」的引用链。',
    },
    {
      title: '合规红线写死',
      why: '不给买卖或仓位建议，不用 BUY / SELL 作结论。',
    },
  ],
  contributions: ['设计七节报告结构与引用规则。', '配置 WorkBuddy 定时任务与 MCP 数据源。', '迭代掉旧方案：行情脚本 + LLM 输出过于简单、部署门槛高。'],
  outcomes: ['2026-10-18 至 11-05 连续产出 17 份晨报。'],
  metrics: [
    { value: '17', label: '份连续产出的晨报' },
    { value: '3', label: '层材料源，逐级降级' },
    { value: '7 / 30', label: '天：直接引用 / 背景引用的时效线' },
  ],
  stack: ['WorkBuddy 自动化', 'MCP', 'Python', 'HTML'],
  tags: ['定时 Agent', '引用溯源', '降级策略'],
  links: [],
}

export const readingCoach: WorkSource = {
  slug: 'reading-coach',
  status: 'published',
  featured: false,
  order: 5,
  category: 'agent',
  origin: 'personal',
  title: '阅读陪练 Agent',
  subtitle: '书由你选，Agent 只做三件事：提问、记录、到点提醒。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  end: '2026-10',
  state: 'Demo',
  summary:
    '用 AI 读书，很容易变成「伪掌握」：划过线不等于理解了。阅读陪练 Agent 把教练和裁判拆成两个角色，题目必须挂在原文锚点上。',
  problem: '划线、摘抄、AI 总结，都让人「感觉学会了」。但一周后，能复述出来的寥寥无几。',
  decisions: [
    {
      title: '教练和裁判分开，各自使用全新上下文',
      why: '如果教练知道判分历史，就会不自觉地放水。',
    },
    {
      title: '题目必须挂原文锚点',
      why: '优先考察没有划线的核心概念。划线处往往是「已经觉得懂了」的地方。',
    },
    {
      title: '风险控制靠「不暴露 + 可撤销」，不靠弹窗',
      why: '确认弹窗会被习惯性点掉。调度器跑完即退，账本兼作信箱。',
    },
  ],
  contributions: ['撰写 Agent 设计文档。', '实现 CLI 陪练、掌握度账本与间隔重复。', '接入微信读书划线，拿不到时降级到本地。'],
  outcomes: ['完成 v1 → v2 迭代；每天 20:00 推送复习。'],
  metrics: [
    { value: '3', label: '档交互：闪卡 · 陪练 · 深挖' },
    { value: '2', label: '个隔离角色：教练与裁判' },
  ],
  stack: ['Python', 'DeepSeek', 'SQLite', 'launchd'],
  tags: ['学习', '角色隔离', '间隔重复'],
  links: [],
}

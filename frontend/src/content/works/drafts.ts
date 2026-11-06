/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 gexo、finAssistant 两个草稿作品
 * [POS]: content/works 的待确认区。status 为 draft，公开列表不展示。
 *        原因：两者的 Git 远程都不是本人账号，本人角色尚未确认。确认角色后改 status 为 published，
 *        并按真实分工改写 role 与 contributions。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const gexo: WorkSource = {
  slug: 'g-exo',
  status: 'draft',
  featured: false,
  order: 19,
  category: 'app',
  origin: 'personal',
  title: 'G-Exo 消费级下肢外骨骼',
  subtitle: 'Physical AI 黑客松作品：四自由度主动式外骨骼，板载 Agent 语音控制。',
  role: '团队项目（本人角色待确认）',
  start: '2026-08',
  state: 'Demo',
  summary:
    '现有消费级外骨骼只做髋关节单方向助力，医疗与工业款又太贵。G-Exo 把差异化放在「膝关节主动 + 冠状面被动跟随」，BOM 约 ¥4,611。板载 Agent 遵循一条原则：LLM 不碰电机。',
  problem: '消费级户外助力市场有空白：轻量、价格可接受、能适应徒步地形的产品还不存在。',
  decisions: [
    { title: '差异化：膝关节主动 + 冠状面被动跟随', why: '主动自由度定为 4 个，整机重量控制在 4 kg 以内。' },
    { title: '价格锚定消费电子', why: 'BOM 约 ¥4,611，目标零售价不超过 5,000 元。' },
    {
      title: 'LLM 不碰电机',
      why: '本地小模型只输出 4 种意图；安全守卫独立于提示词，按钮和 LLM 走同一个校验入口；模式切换需二次确认；超时直接判失败，不自动重试。',
    },
  ],
  contributions: ['待本人确认后填写。'],
  outcomes: ['板载 Web Agent 的 176 个测试用例通过。', '设计、仿真、软件链路跑通；样机尚未组装。'],
  metrics: [
    { value: '¥4,611', label: 'BOM 成本' },
    { value: '4', label: '个主动自由度' },
    { value: '176', label: '个 Agent 测试用例通过' },
  ],
  stack: ['ROS2', 'MuJoCo', 'PPO', 'llama.cpp', 'FastAPI', 'React'],
  tags: ['Physical AI', '安全边界', '硬件'],
  links: [{ label: 'GitHub', url: 'https://github.com/Lain-Ego0/G-Exo' }],
  cover: { src: '/works/gexo/render.jpg', width: 876, height: 1500, caption: 'G-Exo 产品渲染图。' },
}

export const finAssistant: WorkSource = {
  slug: 'finassistant',
  status: 'draft',
  featured: false,
  order: 20,
  category: 'agent',
  origin: 'personal',
  title: 'FinAssistant',
  subtitle: 'A 股智能投研助手：RAG + 多 Agent，用自然语言查行情、看板块、分析财务。',
  role: '团队项目（本人角色待确认）',
  start: '2026-07',
  state: '可用',
  summary: '数据分散在行情、板块、财报、新闻多处，散户很难自己整合。FinAssistant 按业务分组工具，检索方案逐级用 RAGAS 评估。',
  problem: '手动查数、算指标、写报告的门槛很高。',
  decisions: [
    { title: '工具按业务分组，只激活当前需要的一组', why: '减少 LLM 选错工具。' },
    { title: '检索方案逐级实验，每一步用 RAGAS 评估', why: '纯向量 → 混合检索 → rerank，用数据决定是否值得增加复杂度。' },
  ],
  contributions: ['待本人确认后填写。'],
  outcomes: ['混合检索 faithfulness 0.9408；加 bge-reranker 后 context_recall 0.9585。'],
  metrics: [
    { value: '0.9408', label: '混合检索 faithfulness（RAGAS）' },
    { value: '5,203', label: '只覆盖股票（沪 2308 + 深 2895）' },
  ],
  stack: ['AgentScope', 'Milvus', 'MySQL', 'FastAPI', 'Vue 3'],
  tags: ['RAG', '金融', '评估'],
  links: [{ label: 'GitHub', url: 'https://github.com/yaosenJ/FinAssistant' }],
}

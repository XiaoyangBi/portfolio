/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 agentBenchmark 作品数据
 * [POS]: content/works 的成员。首页「02 / 立标准」章节引用它。
 *        数据来源：personal-agent-benchmark/README.md（2026-11-04 公开快照）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const agentBenchmark: WorkSource = {
  slug: 'personal-agent-benchmark',
  status: 'published',
  featured: true,
  order: 1,
  category: 'eval',
  origin: 'personal',
  title: 'Personal Agent Benchmark',
  subtitle: '给「个人助理 Agent」的一把尺子：记忆、推进、克制、表达。',
  principle: '立标准',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  end: '2026-11',
  state: '已发布',
  summary:
    '通用榜单测知识和推理，却不测个人助理真正要会的事：跨会话记住你、把任务往前推、不越权、该沉默时沉默。我做了一套公开的合成评测集，用来回答一个具体的选型问题——哪个模型更适合做我的助理。',
  problem: `选型时，团队常拿通用榜单做参考。可个人助理的失败方式很特殊：

- 记错了三周前用户说过的约束；
- 用户只是抱怨一句，它就替人下单；
- 用户没问，它却抢着输出一大段。

这些问题在通用榜单上没有分数。没有分数，就无法比较，也无法迭代。`,
  decisions: [
    {
      title: '同一道题，在 C0–C3 四种上下文条件下各跑一次',
      why: 'C0 只给当前会话，C1 直接给证据，C2 给全量历史，C3 给 top-3 检索结果。四个条件拆开了「模型会不会用记忆」和「检索有没有召回」。否则一个低分无法归因。',
    },
    {
      title: '无效回复不记 0 分，也不进分母',
      why: '传输错误和空响应不是能力问题。我用四种口径复算排名（共同有效、全分母记 0、各自有效分母、规范化后），名次完全一致。结论不依赖这个口径选择。',
    },
    {
      title: '区分「已有 trace」与「缺失 trace」',
      why: '仓库只能复核题目、输入、回复和断言分数。完整执行日志没有拿到，就标注缺失，不用结构化输入输出冒充 trace。',
    },
    {
      title: '主动性单独成轨，不与静态题混排',
      why: '主动性的评分单位是「决策点」：行动或静默都可能正确。把它和静态题混在一张榜上，会污染主榜。',
    },
  ],
  contributions: [
    '定义评测规格 v0.1：七个维度、四条件协议与判分规则。',
    '构造 10 个合成人物，每人 63 个检查点；persona-01 含 23 个会话。',
    '编写断言引擎，以及排名、敏感性分析、交叉校验脚本，只用 Python 标准库。',
    '完成五家 API 模型 × 10 个人物的单轮评测，另跑三轮稳定性。',
    '设计 Proactive P0 轨道：行动或静默协议、幂等执行、Decision Record。',
  ],
  outcomes: [
    '五模型共同有效样本 2488 / 2520 条；混元 Hy4 以 52.69% 居首。',
    '四种口径复算，名次顺序完全一致。',
    'GPT 运行时三轮平均通过率 63.76%，样本标准差 2.19 个百分点。',
    '全部题目、回复与判分明细公开在 GitHub，可离线复算。',
  ],
  metrics: [
    { value: '2,488', label: '五模型共同有效样本', source: 'README · 主榜' },
    { value: '10 × 63 × 4', label: '人物 × 检查点 × 条件', source: 'README · 题集' },
    { value: '4 / 4', label: '口径复算后名次一致', source: 'docs/api-v2-nothink-sensitivity.json' },
    { value: '52.69%', label: '第一名通过率（混元 Hy4）', source: 'README · 主榜' },
  ],
  stack: ['Python 标准库', 'OpenAI 兼容 API', '断言引擎', 'JSON Schema'],
  tags: ['评测设计', '记忆', '主动性', '模型选型'],
  links: [{ label: 'GitHub', url: 'https://github.com/XiaoyangBi/personal-agent-benchmark' }],
  notes: [
    {
      title: '五模型 × 十人物 · 单轮排名',
      body: `| 排名 | 模型 | 通过数 | 通过率 |
|---:|---|---:|---:|
| 1 | 混元 Hy4 | 1311 / 2488 | 52.69% |
| 2 | DeepSeek | 1237 / 2488 | 49.72% |
| 3 | GLM | 1234 / 2488 | 49.60% |
| 4 | MiMo | 1199 / 2488 | 48.19% |
| 5 | MiniMax | 1122 / 2488 | 45.10% |

单轮结果，不含重复采样，不是显著性检验。MiniMax 使用标准输出，解码模式是混杂因素。`,
    },
  ],
  reflection:
    '这份榜单最重要的部分，是它承认自己不能说什么：单轮、非显著性检验、解码模式混杂。我把这些限制写在 README 首屏，而不是藏在附录。',
}

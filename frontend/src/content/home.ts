/**
 * [INPUT]: 无运行时依赖
 * [OUTPUT]: 导出 HOME（首页叙事文案：hero、五个原则章节及其演示数据、结尾）
 * [POS]: content 模块的叙事层，只被 themes/cosmo/views/CosmoHome.vue 与 demos/* 消费。
 *        五个章节对应五条产品原则，每章绑定一件作品（work 字段为作品 slug），演示数据取自该作品的真实材料；
 *        对话与草稿是示意文案，不冒充真实用户数据。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const HOME = {
  hero: {
    eyebrow: 'AI 产品经理 · 厦门大学 人工智能本科 / 自动化硕士',
    title: ['AI 产品，', '先证明它有用。'],
    lead: ['我是毕骁扬。做 Agent，做评测，也做给自己用的 AI 工具。'],
    primary: '看作品',
    secondary: '下载简历',
  },

  /* ── 01 定问题 · InsightFlow ── */
  question: {
    index: '01 / 定问题',
    title: ['先把「想调研一下」，', '问成一份配置。'],
    body: ['用户带来的，往往只是一句模糊的话。', 'InsightFlow 先用一段多轮对话，把它收敛成目标产品、关注维度和竞品集合，再交给 Agent 流水线。'],
    meta: 'InsightFlow · 字节跳动 AI 全栈挑战赛优秀项目奖',
    work: 'insightflow',
    dialogue: [
      { who: '你', text: '想调研一下 AI 记账 App。' },
      { who: 'Agent', text: '更关心哪一面：功能、定价，还是增长打法？' },
      { who: '你', text: '功能和定价。' },
      { who: 'Agent', text: '竞品先定四个：核心 2 个，标杆 1 个，替代 1 个。' },
    ],
    config: ['target: AI 记账 App', 'dimensions: [功能, 定价]', 'competitors: 4 · 核心 / 标杆 / 替代'],
  },

  /* ── 02 立标准 · Personal Agent Benchmark ── */
  standard: {
    index: '02 / 立标准',
    title: ['没有评测，', '就说不清哪个更好。'],
    body: ['通用榜单不测个人助理该会的事：记住你、不越权、该沉默时沉默。', '我做了一套评测集：10 个合成人物，每人 63 个检查点，4 种上下文条件。'],
    meta: 'Personal Agent Benchmark · 共同有效样本 2,488 / 2,520',
    work: 'personal-agent-benchmark',
    rows: [
      { rank: '01', model: '混元 Hy4', rate: '52.69%' },
      { rank: '02', model: 'DeepSeek', rate: '49.72%' },
      { rank: '03', model: 'GLM', rate: '49.60%' },
      { rank: '04', model: 'MiMo', rate: '48.19%' },
      { rank: '05', model: 'MiniMax', rate: '45.10%' },
    ],
  },

  /* ── 03 留给人 · 羽省省 ── */
  human: {
    index: '03 / 留给人',
    title: ['AI 来整理，', '人来判断。'],
    body: ['羽省省里，AI 把一段口述整理成草稿。', '值不值、付了多少钱，由球友自己确认。原话里没有的价格，留空，不猜。'],
    meta: '羽省省 · 录音 → 语音识别 → AI 草稿 → 人确认 → 发布',
    work: 'yushengsheng',
    utterance: '今晚在 A 馆打球，45 元一小时，灯光好，就是停车难，我觉得值。',
    fields: [
      { label: '场馆', value: 'A 馆', state: 'filled' },
      { label: '价格', value: '45 元 / 小时 · 球友实测', state: 'filled' },
      { label: '标签', value: '灯光好 · 停车难', state: 'filled' },
      { label: '值不值', value: '你说「值」，请确认', state: 'confirm' },
    ],
  },

  /* ── 04 有出处 · 夜间章节 ── */
  evidence: {
    index: '04 / 有出处',
    title: ['每一个判断，', '都要找得到出处。'],
    body: ['这是我做 AI 产品的底线。', '缺数据就标缺失，审查不过就回到采集，用户没说的就留空。'],
    query: '出处',
    /** 「在 N 个作品里，找到 M 条」由组件按公开作品数与 labels 长度拼出，避免数字过期 */
    labels: [
      { text: '无效回复不记 0 分，也不进分母。', source: 'Personal Agent Benchmark' },
      { text: '证据门槛不过，分数封顶 60。', source: 'InsightFlow · ReviewAgent' },
      { text: '原话没有价格，就留空让人补。', source: '羽省省 · AI 草稿' },
      { text: '每条诊断都写清画面证据。', source: '镜准 · 视觉质检' },
      { text: '写入记忆前，必须经本人确认。', source: 'personal-memory' },
    ],
    features: ['评测设计', 'Agent 编排', 'Human-in-the-Loop', '证据链', '数据回流'],
  },

  /* ── 05 回流 · 内容流水线 ── */
  loop: {
    index: '05 / 回流',
    title: ['上线不是终点，', '回流才是。'],
    body: ['内容流水线记录每篇笔记的预测分与真实表现。', '一篇预测 90.5 分的笔记，只拿到 438 次曝光。系统因此多了一条失败模式：平台调性错配。'],
    meta: '小红书内容流水线 · 47 篇真实样本 · 单篇最高曝光 42,814',
    work: 'content-pipeline',
    steps: ['选题', '成稿', '封面', '发布', '回填', '校准'],
    predicted: '90.5',
    actual: '438',
  },

  works: {
    eyebrow: '06 / 作品',
    title: '精选作品',
    lead: '六件作品，每件都按「问题 → 决策 → 贡献 → 证据」写成案例。',
    all: '看全部作品',
  },

  end: {
    title: ['下一个 AI 产品，', '我们可以，换个方式做。'],
    cta: '写信给我',
    meta: 'AI 产品经理 · 2027 届 · 厦门大学',
    more: '先看看我是谁？关于我',
  },
}

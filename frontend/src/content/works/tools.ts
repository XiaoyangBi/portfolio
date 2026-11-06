/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 kb、resumePipeline、htmlTrio、quickCapture、modelRadar 五个作品数据
 * [POS]: content/works 的成员，「效率工具」与轻量「个人 AI 基建」作品。
 *        这些作品体量小，案例页只保留最能体现取舍的决策。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const kb: WorkSource = {
  slug: 'kb',
  status: 'archived',
  featured: false,
  order: 14,
  category: 'infra',
  origin: 'personal',
  title: '个人知识库检索层',
  subtitle: '把 md、docx、pdf、xlsx、pptx 统一抽成纯文本，给人和 Agent 一个稳定的检索入口。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  state: '自用中',
  summary: '资料格式五花八门，散在各处，搜不到。kb 把它们抽成文本建索引，提供网页、命令行、Agent 三个入口。',
  problem: '知识库里有几千份文档，格式各异。系统搜索不认识 docx 里的表格，Agent 也读不了 pptx。',
  decisions: [
    {
      title: '弃用 SQLite FTS5，改为 LIKE 粗筛 + Python 打分',
      why: 'FTS5 的 trigram 分词器搜「简历」「银行」这类两字中文会返回空。几千篇规模下，新方案每次查询仍在百毫秒内。',
    },
    {
      title: '按修改时间增量建索引',
      why: '日常重建只需几秒，索引不会因为「太慢」而被放弃更新。',
    },
    {
      title: '网页版只搜摘要，全文交给命令行',
      why: '网页只载入正文前 220 字，避免 HTML 过大卡顿。',
    },
  ],
  contributions: ['设计三入口检索层。', '实现多格式抽取、增量索引与打分。'],
  outcomes: ['已索引 2,887 篇文档（截图）。'],
  metrics: [
    { value: '2,887', label: '篇已索引文档' },
    { value: '3', label: '个入口：网页 · 命令行 · Agent' },
  ],
  stack: ['Python', 'SQLite', 'HTML'],
  tags: ['检索', '中文分词', '增量索引'],
  links: [],
  cover: { src: '/works/kb/preview.jpg', width: 1600, height: 1100, caption: '网页检索入口。' },
}

export const resumePipeline: WorkSource = {
  slug: 'resume-pipeline',
  status: 'archived',
  featured: false,
  order: 15,
  category: 'tool',
  origin: 'personal',
  title: '简历流水线',
  subtitle: '一份母版 YAML，生成多个岗位版本，并给出 JD 覆盖率与缺口。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  state: '自用中',
  summary: '过去手工维护 8 个 docx，事实互相矛盾，也看不出简历和 JD 差在哪。现在母版是唯一事实来源。',
  problem: '同一段经历，在三份简历里写出了三个数字。',
  decisions: [
    { title: '母版是唯一事实来源，脚本不改写任何数字', why: '变体配置只决定放哪些条目、叫什么、什么顺序。' },
    { title: '缺条目 id 时直接报错', why: '不悄悄丢内容。' },
    { title: '自动找出能压进一页的最大字号', why: '并写回配置，下次构建结果一致。' },
  ],
  contributions: ['设计母版与变体的数据结构。', '实现构建、页数检查与 JD 比对脚本。'],
  outcomes: ['3 个岗位版本由同一母版生成。'],
  metrics: [{ value: '8 → 1', label: '份手工维护的文件 → 一份母版' }],
  stack: ['Python', 'YAML', 'Chrome 打印'],
  tags: ['单一事实来源', '求职'],
  links: [],
}

export const htmlTrio: WorkSource = {
  slug: 'html-trio',
  status: 'published',
  featured: false,
  order: 16,
  category: 'tool',
  origin: 'personal',
  title: 'HTML 三件套 Skill',
  subtitle: 'HTML 报告的「图片内嵌 → 转 PPT / 转 PDF」完整流程，一句话触发。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-05',
  end: '2026-07',
  state: '可用',
  summary: 'HTML 报告一转发图片就丢；演示要翻页的 PPT；存档要文字可搜的 PDF。三个 Skill 串成一条管线。',
  problem: 'AI 生成的报告越来越多是 HTML，但收件人要的是 PPT 和 PDF。',
  decisions: [
    { title: '先内嵌成单文件，再分两路并行出 PPT 和 PDF', why: '图片丢失只需要在源头解决一次。' },
    { title: '尽量少依赖', why: '转 PPT 用纯 Python，不需要浏览器；图片压缩用 macOS 自带的 sips。' },
  ],
  contributions: ['设计三段管线与触发语。', '实现三个 Skill。'],
  outcomes: ['说「改成 PPT」即可触发。'],
  metrics: [{ value: '3', label: '个 Skill 串成一条管线' }],
  stack: ['Python', 'Playwright', 'pypdf'],
  tags: ['Skill', '文档转换'],
  links: [],
}

export const quickCapture: WorkSource = {
  slug: 'obsidian-quick-capture',
  status: 'published',
  featured: false,
  order: 17,
  category: 'tool',
  origin: 'personal',
  title: 'ObsidianQuickCapture',
  subtitle: 'macOS 菜单栏常驻的 Obsidian 快速记录 App。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-11',
  state: 'v0.1.0',
  summary: '灵感来了，不想切窗口。全局快捷键呼出，记完即走，附件先暂存。',
  problem: '打开 Obsidian、找到目录、新建笔记，三步之后灵感已经没了。',
  decisions: [
    { title: '全局快捷键呼出，记完即走', why: '记录入口必须比灵感消失得更快。' },
    { title: '用 security-scoped bookmark 保存目录授权', why: '只授权一次，重启后仍可写入 Vault。' },
  ],
  contributions: ['设计交互与授权流程。', '用 SwiftUI 实现菜单栏 App，并编写单元与集成测试。'],
  outcomes: ['v0.1.0 交付包可安装使用。'],
  metrics: [{ value: '1', label: '个快捷键完成记录' }],
  stack: ['Swift', 'SwiftUI', 'macOS'],
  tags: ['桌面工具', '捕获'],
  links: [],
}

export const modelRadar: WorkSource = {
  slug: 'model-release-radar',
  status: 'archived',
  featured: false,
  order: 18,
  category: 'tool',
  origin: 'personal',
  title: '模型发布雷达 Skill',
  subtitle: '判断某个 AI 模型是否临近发布：三层信源交叉验证，不预测具体日期。',
  role: '独立设计',
  team: 1,
  start: '2026-08',
  state: '可用',
  summary: 'AI 圈的「下周发布」传言很多。这个 Skill 把判断规则写死：至少两层信源同向，且必须含一层可独立核查的硬信号。',
  problem: '只凭一条爆料下判断，很容易被带偏；而爆料本身无法核查。',
  decisions: [
    { title: '三层信源：预测平台 / 发布规律 / 一手信号', why: '任何单一信源都可能被操纵或误读。' },
    { title: '至少两层同向，且含一层可核查的硬信号', why: '把「感觉要发了」变成可复核的规则。' },
    { title: '不预测具体日期', why: '日期最容易错，也最没用；要回答的只是「近不近」。' },
  ],
  contributions: ['设计判断规则与输出格式。'],
  outcomes: ['纯 Prompt Skill，无代码依赖。'],
  metrics: [{ value: '2 / 3', label: '层信源同向才下结论' }],
  stack: ['Prompt', 'Skill'],
  tags: ['信息判断', '交叉验证'],
  links: [],
}

/**
 * [INPUT]: 依赖 @/types 的 SiteData 与 ./schema 的 WORK_CATEGORIES
 * [OUTPUT]: 导出 assetUrl（静态资源前缀）、CONTACTS、SITE 与 PROFILE
 * [POS]: content 模块的身份层。api/static.ts 用 SITE 响应 site()；themes/cosmo 的关于页直接读 PROFILE。
 *        assetUrl 是 public/ 资源路径的唯一出口：项目站点部署时加 vite base 前缀，根路径部署时原样返回。
 *        CONTACTS 是联系方式的唯一数据源：首页结语读全部五项，SITE.settings.contact_methods 由其中有链接的四项生成。
 *        PROFILE 只写一行式履历，不展开实习细节：作品集的主角是个人项目。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { SiteData } from '@/types'
import { WORK_CATEGORIES } from './schema'

/* ────────────────────────── 静态资源前缀 ────────────────────────── */

/**
 * 给 public/ 下的绝对路径加 vite base 前缀。
 * 根路径部署时 BASE_URL 为 '/' 并返回原值；项目站点部署时为 '/<仓库名>/'。
 * 幂等：已带前缀的入参不重复拼接，供 api/static.ts 与视图共用同一份 PROFILE。
 */
export const assetUrl = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  if (!base || path.startsWith(`${base}/`)) return path
  return `${base}${path}`
}

/* ────────────────────────── 联系方式 ────────────────────────── */

/** 首页结语的联系方式。href 为空串时，组件把 value 复制进剪贴板（微信）。 */
export interface ContactLink {
  type: 'email' | 'wechat' | 'github' | 'xiaohongshu' | 'watcha'
  label: string
  value: string
  href: string
  icon: 'mail' | 'phone' | 'github' | 'book-open' | 'eye'
}

/** 逐项核对自 https://bixiaoyang.pages.dev/ 的社交栏（2026-11-06）。微信与手机号相同。 */
export const CONTACTS: readonly ContactLink[] = [
  { type: 'email', label: '邮箱', value: '1531289886@qq.com', href: 'mailto:1531289886@qq.com', icon: 'mail' },
  { type: 'wechat', label: '微信', value: '13313866815', href: '', icon: 'phone' },
  { type: 'github', label: 'GitHub', value: 'XiaoyangBi', href: 'https://github.com/XiaoyangBi', icon: 'github' },
  { type: 'xiaohongshu', label: '小红书', value: '个人主页', href: 'https://www.xiaohongshu.com/user/profile/617529c70000000002027c89', icon: 'book-open' },
  { type: 'watcha', label: 'Watcha', value: '@10006084', href: 'https://watcha.cn/@10006084', icon: 'eye' },
]

/* ────────────────────────── 站点设置 ────────────────────────── */

export const SITE: SiteData = {
  base_url: '',
  settings: {
    site_name: '毕骁扬 · AI 产品作品集',
    person_name: '毕骁扬',
    headline: 'AI 产品，先证明它有用。',
    bio: '做 Agent，做评测，也做给自己用的 AI 工具。',
    current_identity: 'AI 产品经理 · 2027 届 · 厦门大学',
    research_directions: ['Agent 产品', 'AI 评测', 'Human-in-the-Loop', '上下文与记忆'],
    email: '1531289886@qq.com',
    github_url: 'https://github.com/XiaoyangBi',
    location: '厦门 · 深圳',
    footer_text: '本站基于开源项目 EvidentFolio 改造，作品数据全部来自本人仓库与文档。',
    default_seo_title: '毕骁扬 · AI 产品经理作品集',
    default_seo_description: '毕骁扬的 AI 产品作品集：Agent 系统、AI 评测、人在回路与个人 AI 基建。每个作品按「问题 → 决策 → 贡献 → 证据」组织。',
    primary_language: 'zh-CN',
    music_enabled: false,
    analytics_enabled: false,
    featured_project_count: 6,
    contact_methods: CONTACTS.filter((item) => item.href).map((item) => ({
      type: item.type, label: item.label, value: item.value, url: item.href,
      description: '', icon_asset_uuid: '', icon_name: item.icon, icon_svg: '',
    })),
  },
  categories: Object.entries(WORK_CATEGORIES).map(([slug, item], index) => ({
    uuid: slug,
    slug,
    name: item.name,
    description: item.description,
    sort_order: index,
  })),
  tags: [],
}

/* ────────────────────────── 履历 ────────────────────────── */

export const PROFILE = {
  resumeUrl: assetUrl('/resume-ai-pm.pdf'),
  education: [
    { school: '厦门大学', degree: '硕士 · 自动化（保研）', period: '2024.09 — 2027.06' },
    { school: '厦门大学', degree: '本科 · 人工智能', period: '2020.09 — 2024.06' },
  ],
  experience: [
    { org: '腾讯 · WXG · 微信支付', role: '产品策划', period: '2026.02 — 2026.09' },
    { org: 'MetaGPT（GitHub 70.1k Stars）', role: 'AI 产品经理', period: '2025.01 — 2025.05' },
    { org: '腾讯 · CSIG · AI 工业质检', role: 'AI 产品经理', period: '2024.04 — 2024.08' },
  ],
  honors: [
    { name: '字节跳动 AI 全栈挑战赛 · 优秀项目奖', note: 'InsightFlow', year: '2026' },
    { name: '全国大学生「互联网+」大赛 · 福建省金奖 · 全国铜奖', note: '航空发动机智能视觉缺陷检测', year: '2025' },
    { name: '科大讯飞星火杯 · 优秀奖', note: 'LvBanGPT', year: '2024' },
    { name: '美国大学生数学建模竞赛 · F 奖（特等奖提名）', note: '', year: '2023' },
  ],
  skills: [
    '雅思 6.5，有海外交换经历',
    '小红书 AI 领域账号，粉丝 1,700+',
    '能写 PRD，也能用 AI Coding 把 PRD 做成可用的 Demo',
  ],
}

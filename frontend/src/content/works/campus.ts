/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 campusClubMatch、workstation 两个作品数据
 * [POS]: content/works 的成员，「AI 应用」分类中从 PRD 写到 MVP 的两件校园产品。
 *        数据来源：社团智能招新匹配平台/docs/03-MVP版PRD.md 与 Edge Functions；工位数字化管理系统/01、02 号 PRD。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const campusClubMatch: WorkSource = {
  slug: 'campus-club-match',
  status: 'published',
  featured: false,
  order: 11,
  category: 'app',
  origin: 'personal',
  title: '社团智能招新匹配平台',
  subtitle: '单校场景的社团招新平台：学生、社团、学校三端，核心是 AI 匹配。',
  role: '产品设计与全栈实现',
  team: 1,
  start: '2026-03',
  end: '2026-03',
  state: '已上线（Demo）',
  summary:
    '社团信息分散、报名渠道割裂、筛选效率低、学校难以统一管理。我从 MVP PRD 写起，用 Supabase 搭完三端，并把 AI 推荐的「说话方式」写成了硬约束。',
  problem: `每到招新季：

- 学生不知道哪个社团适合自己；
- 社团收到一堆不匹配的报名，手工筛到深夜；
- 学校看不到全局，也管不住流程。`,
  decisions: [
    {
      title: '首期只做单校，并写出「不做」清单',
      why: '学生之间不聊天、不支持多校、不做社团内部成员管理。先把招新这一件事做透。',
    },
    {
      title: 'AI 推荐必须给出 2–3 条具体理由，禁止空话',
      why: '分数表示「优先投递程度」，不代表能力评分。部分匹配时只说「适合的切入点」，不硬说完全匹配。',
    },
    {
      title: '权限分两层',
      why: '登录交给 Supabase Auth；角色和社团归属由业务表管理，再叠加行级安全策略（RLS）。',
    },
    {
      title: 'PRD 先定 4 个 KPI',
      why: '详情转报名率、推荐点击率、报名处理时长、招新覆盖率。指标先于功能。',
    },
  ],
  contributions: [
    '撰写 MVP PRD 与功能范围。',
    '实现学生、社团、学校三端与 17 个 Edge Functions。',
    '设计 AI 匹配的提示词约束与结果缓存。',
    '部署上线到 Vercel。',
  ],
  outcomes: ['线上可访问：campus-club-match.vercel.app。', '17 个 Edge Functions 覆盖画像、匹配、简历辅助、通知与审核。'],
  metrics: [
    { value: '3', label: '端：学生 · 社团 · 学校' },
    { value: '17', label: '个 Edge Functions' },
    { value: '4', label: '个 PRD 先行 KPI' },
  ],
  stack: ['React', 'TypeScript', 'Vite', 'Supabase', 'Edge Functions', 'Vercel'],
  tags: ['AI 匹配', 'PRD', '多角色权限', '校园'],
  links: [
    { label: '在线体验', url: 'https://campus-club-match.vercel.app' },
    { label: 'GitHub', url: 'https://github.com/XiaoyangBi/campus-club-match' },
  ],
}

export const workstation: WorkSource = {
  slug: 'workstation',
  status: 'archived',
  featured: false,
  order: 15,
  category: 'app',
  origin: 'personal',
  title: '工位数字化管理系统',
  subtitle: '学院级工位资源管理：申请、分配、回收、异常闭环，外加只读领导看板。',
  role: '产品设计与实现',
  team: 1,
  start: '2026-03',
  end: '2026-03',
  state: 'Demo',
  summary:
    '线下台账导致工位空置、错配、超期占用；状态口径不统一，出了问题追不到人。我写了 4 份 PRD，再做出一个本地可运行的 MVP 闭环。',
  problem: `学院的工位靠线下台账管理：

- 有人毕业了，工位还挂在名下；
- 新生排队，空位却没人知道；
- 统计口径不一，领导看到的数字不可信。`,
  decisions: [
    {
      title: '一期只解决「有没有」和「管不管得住」',
      why: '智能分配、门禁、IoT、押金全部暂缓。先把申请、分配、回收三个环节做透，否则统计必然失真。',
    },
    {
      title: '7 种工位状态，全系统统一口径',
      why: '状态口径是所有统计的地基。口径不统一，看板越漂亮越误导。',
    },
    {
      title: '领导看板只读',
      why: '避免越权干预流程。一个学生只对应一个主工位。',
    },
  ],
  contributions: ['撰写 4 份 PRD：功能规划、角色权限与业务规则等。', '实现 React + Express + Prisma 的 MVP。', '编写验收脚本，覆盖登录、审批、分配、确认、看板闭环。'],
  outcomes: ['验收脚本跑通「登录 → 审批 → 分配 → 入驻确认 → 看板」完整闭环。'],
  metrics: [
    { value: '4', label: '份 PRD' },
    { value: '7', label: '种统一工位状态' },
  ],
  stack: ['React', 'TypeScript', 'Express', 'Prisma', 'SQLite'],
  tags: ['B 端', 'PRD', '流程闭环'],
  links: [],
}

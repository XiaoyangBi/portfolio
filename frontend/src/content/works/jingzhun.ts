/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 jingzhun 作品数据
 * [POS]: content/works 的成员。电商视觉质检 Copilot，图片素材为改稿前后对比。
 *        数据来源：bailian-cli/README 与 .trae/skills/jingzhun-skill。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const jingzhun: WorkSource = {
  slug: 'jingzhun',
  status: 'published',
  featured: true,
  order: 9,
  category: 'app',
  origin: 'personal',
  title: '镜准 JingZhun',
  subtitle: '电商视觉运营的 AI Copilot：上传素材 → 视觉质检 → 自动改稿 → 批量复盘。',
  principle: '有出处',
  role: '产品设计与实现',
  team: 1,
  start: '2026-06',
  end: '2026-06',
  state: 'Demo',
  summary:
    '运营很难看出一张低转化主图到底差在哪；AI 给的建议又常是套话，没法照着改。镜准要求每一条诊断都写清画面证据、影响和行动建议，然后直接给出改稿。',
  problem: `电商视觉运营每天要处理大量主图和短视频素材。现有 AI 工具的典型输出是：

> 「建议突出产品卖点，提升画面吸引力。」

这句话没有错，但没人能照着改。运营需要的是：**哪里有问题、为什么影响转化、具体怎么改。**`,
  decisions: [
    {
      title: '证据优先：先看图，再下结论',
      why: '先调用视觉模型描述画面，再生成报告。每条问题必须包含画面证据、影响与行动建议，不允许泛化判断。',
    },
    {
      title: '上传、诊断、改稿拆成三步',
      why: '降低认知负担。页面刻意做得像「系统设置」，而不是高密度的操作台。',
    },
    {
      title: '单素材与批量看板两个入口',
      why: '单素材页解决「这张图怎么改」；批量看板解决「这一批素材哪里普遍有问题」，从单次生成延伸到运营复盘。',
    },
    {
      title: '模型失败时，流程不中断',
      why: '服务端返回兜底结果，用户仍能走完流程。模型调用封装在独立适配层，可以从本地 CLI 换成远程 API。',
    },
  ],
  contributions: [
    '定义「证据 → 影响 → 行动」三段式诊断格式。',
    '设计单素材与批量两套信息架构。',
    '用 Next.js + Supabase 实现上传、质检、改稿、历史记录与登录。',
    '整理 4 个示例商品案例，用于演示与回归。',
  ],
  outcomes: [
    '跑通「上传 → 质检报告 → 改稿生成 → 批量看板」完整链路。',
    '质检报告输出标题方向、首屏结构、字幕计划与分镜草案。',
    '代码已开源到 GitHub。',
  ],
  metrics: [
    { value: '3', label: '步主流程：上传 · 诊断 · 改稿' },
    { value: '3 段', label: '诊断格式：证据 · 影响 · 行动' },
    { value: '4', label: '个示例商品案例' },
  ],
  stack: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase', '阿里云百炼'],
  tags: ['视觉理解', '证据链', '电商', 'Copilot'],
  links: [{ label: 'GitHub', url: 'https://github.com/XiaoyangBi/JingZhun' }],
  cover: { src: '/works/jingzhun/after.jpg', width: 900, height: 900, caption: '改稿后：示例商品（加热枕）主图。' },
  gallery: [
    { src: '/works/jingzhun/before.jpg', width: 900, height: 900, caption: '改稿前：原始主图。' },
    { src: '/works/jingzhun/after.jpg', width: 900, height: 900, caption: '改稿后：依据质检报告生成。' },
  ],
  reflection:
    '「说得对但用不上」是 AI 建议最常见的失败。解决办法不是更强的模型，而是更严格的输出格式。',
}

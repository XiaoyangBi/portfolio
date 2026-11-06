/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 contentPipeline 作品数据
 * [POS]: content/works 的成员。首页「05 / 回流」章节引用它。
 *        数据来源：xiaoxiaole-content-pipeline/README.md 与 CC 投毒篇 05_数据回填.md。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const contentPipeline: WorkSource = {
  slug: 'content-pipeline',
  status: 'published',
  featured: true,
  order: 4,
  category: 'agent',
  origin: 'personal',
  title: '小红书内容创作流水线',
  subtitle: '一个真人博主的个人内容操作系统：用自己的真实数据，反推该写什么。',
  principle: '回流',
  role: '设计与搭建（黑客松团队「开心潇骁乐」）',
  start: '2026-07',
  end: '2026-07',
  state: '自用中',
  summary:
    '内容创作最难自动化的不是写字，而是判断：写什么、什么会火、什么会翻车。通用大模型在这些判断上没有经验。这套系统运行在 WorkBuddy 上，用 14 个可插拔 Skill 串起选题到数据回填，并用我自己账号的真实数据当记忆。',
  problem: `我在小红书写 AI 方向的内容，约 1,500 粉丝。每篇都要经历选题、写稿、做封面、发布、复盘。

通用写作工具能把字写顺，但回答不了三个问题：

1. 这个选题和我的账号匹配吗？
2. 和我以前爆过的内容像不像？
3. 它会不会踩中我已经踩过的坑？`,
  decisions: [
    {
      title: '真实账号数据做共享记忆',
      why: '文风指纹、爆款配方、失败案例库和查重库放在同一个数据底座。改一处规则，全链路生效。',
    },
    {
      title: '选题打分可解释：热度 × 0.4 + 匹配 × 0.45 + 形式 × 0.15',
      why: '匹配权重最高，因为「火的选题」不等于「适合我的选题」。每个分项都能追溯到具体引擎的输出。',
    },
    {
      title: '三个人工确认点',
      why: '选题定稿前、成稿定稿前、发布前各停一次。自动化负责速度，人负责方向。',
    },
    {
      title: '第 6 环回流到第 1 环',
      why: '系统记录「预测分 vs 实际表现」的误差，反向校准选题模型。没有回流，打分公式只是一个猜测。',
    },
    {
      title: '封面分导演层与执行层',
      why: '导演层定风格与构图，执行层出图。中文封面用 HTML 渲染后截图，避开图像模型的中文乱码。',
    },
  ],
  contributions: [
    '设计六环链路与三个人工确认点。',
    '从 47 篇真实发布中提炼爆款配方与失败模式，沉淀为数据底座。',
    '编写 14 个 Skill（主链路 7 个，封面 7 个）与一键幂等安装脚本。',
    '为翻车内容做复盘，把结论写回失败案例库。',
  ],
  outcomes: [
    '基于 47 篇真实发布样本；单篇最高曝光 42,814，中位数 3,715。',
    '记录 4 次爆款、1 次翻车，均有复盘。',
    '翻车篇预测 90.5 分，实际曝光 438；系统因此新增失败模式 D「平台调性错配」。',
  ],
  metrics: [
    { value: '42,814', label: '单篇最高曝光', source: 'README' },
    { value: '47', label: '篇真实发布样本', source: 'README' },
    { value: '14', label: '个可插拔 Skill', source: 'README' },
    { value: '90.5 → 438', label: '翻车篇：预测分 → 实际曝光', source: '05_数据回填.md' },
  ],
  stack: ['WorkBuddy Skill', 'Prompt 工程', 'Node.js', 'Python', 'HTML → Chrome 截图'],
  tags: ['数据回流', '内容生产', 'Skill 编排', '人在回路'],
  links: [],
  cover: { src: '/works/content-pipeline/cover.jpg', width: 1440, height: 810, caption: '项目封面：从选题到数据回流全链路。' },
  gallery: [
    { src: '/works/content-pipeline/architecture.jpg', width: 1440, height: 649, caption: '系统架构 v3：主链路 7 个 Skill，封面 7 个 Skill，共享数据底座。' },
  ],
  reflection:
    '最有价值的一篇，是翻车的那篇。它让打分模型第一次「被现实纠正」，也让失败案例库多了一条我自己想不到的规则。',
}

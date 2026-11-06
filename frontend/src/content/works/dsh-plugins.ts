/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 dshPlugins 作品数据
 * [POS]: content/works 的成员。DeepSeek Harness 插件组：上下文工作台、插件锻造炉、3D 桌宠、玻璃纵深皮肤。
 *        数据来源：dsh-plugins/{插件}/README 与 docs/design.md、docs/verification.md；dsh-skins/VERIFICATION.md。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const dshPlugins: WorkSource = {
  slug: 'dsh-plugins',
  status: 'archived',
  featured: false,
  order: 10,
  category: 'agent',
  origin: 'personal',
  title: 'DeepSeek Harness 插件组',
  subtitle: '给 Agent 工作台补上三件事：选对上下文、现场造工具、让状态被看见。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-08',
  end: '2026-11',
  state: '可用',
  summary:
    '我在 DeepSeek Harness 上写了一组插件。它们回答同一个问题：Agent 工作台里，用户和 Agent 之间还缺什么？答案是三件事——给 AI 看什么、AI 缺工具时怎么办、AI 在忙什么。',
  problem: `用 Agent 工作台时，我反复遇到三个摩擦：

- **上下文**：普通用户不知道该给 AI 看哪些资料；高级用户只能整份整份地给，控制不了粒度。
- **工具**：Agent 干到一半缺一个工具，只能停下来等人写。
- **状态**：多个会话并行时，看不出哪个在等我确认。`,
  decisions: [
    {
      title: '上下文工作台：小白与高级模式共用同一份数据',
      why: '切换模式不丢东西。小白模式刻意不出现 token、权重这些词；高级模式可以控制每份资料的注入方式。',
    },
    {
      title: '推荐用本地打分，不调用模型',
      why: '毫秒级、不花 token，还能解释「为什么挑它」。可解释性比推荐精度更影响用户是否信任。',
    },
    {
      title: '注入粒度只做三档：全文 / 开头 N 行 / 只给路径',
      why: '没做行区间，因为小白用不上，高级用户用路径即可。每多一档，就多一份理解成本。',
    },
    {
      title: '插件锻造炉：挂载走三阶段事务，失败自动回滚',
      why: 'Agent 写好工具 → 子进程验证 → 热挂载进当前会话，同一回合就能用。写坏了，旧版本继续服务。能力必须显式声明，并默认需要人工审批。',
    },
    {
      title: '3D 桌宠：多会话状态按优先级合并',
      why: '会话事件映射为 6 种状态；合并顺序为 等待 > 工作 > 出错 > 完成 > 空闲，避免「等你确认」被别的会话盖掉。',
    },
  ],
  contributions: [
    '设计并实现上下文工作台（三栏布局、三档注入、三档约束、发送内容逐字预览）。',
    '设计并实现插件锻造炉（6 个工具、两层生命周期）。',
    '设计并实现 3D 桌宠（Three.js + VRM，可独立置顶窗口）。',
    '设计纯 CSS 的玻璃纵深皮肤，覆盖 118 个官方设计 token。',
  ],
  outcomes: [
    '上下文工作台：冒烟测试 173 / 173，静态审计 19 / 19，中英文案 key 106 / 106 对齐。',
    '插件锻造炉：35 个测试。',
    '3D 桌宠：8 个内置动作，6 种状态。',
  ],
  metrics: [
    { value: '173 / 173', label: '上下文工作台冒烟测试', source: 'docs/verification.md' },
    { value: '35', label: '插件锻造炉测试用例', source: 'README' },
    { value: '6', label: '种 Agent 状态映射到桌宠' },
    { value: '118', label: '个设计 token 被皮肤覆盖', source: 'dsh-skins/VERIFICATION.md' },
  ],
  stack: ['Node.js', 'React', 'Three.js', 'three-vrm', 'Electron', 'CSS'],
  tags: ['Agent 体验', '上下文工程', '插件', '可见性'],
  links: [],
  cover: { src: '/works/dsh-plugins/pet3d-working.jpg', width: 1280, height: 757, caption: '3D 桌宠：Agent 进入「工作中」状态。' },
  gallery: [
    { src: '/works/dsh-plugins/pet3d-app.jpg', width: 1280, height: 813, caption: '桌宠悬浮在 Web GUI 中。' },
    { src: '/works/dsh-plugins/pet3d-settings.jpg', width: 1280, height: 813, caption: '桌宠设置面板。' },
    { src: '/works/dsh-plugins/skin-light.jpg', width: 1440, height: 900, caption: '玻璃纵深皮肤 · 浅色（设计稿）。' },
    { src: '/works/dsh-plugins/skin-dark.jpg', width: 1440, height: 900, caption: '玻璃纵深皮肤 · 深色（设计稿）。' },
  ],
  reflection:
    '上下文工作台的验证记录里，我写下了未验证项：浏览器渲染与真实会话端到端。列出没测过的，和列出测过的同样重要。',
}

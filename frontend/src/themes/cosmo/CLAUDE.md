# themes/cosmo/

L2 | 父级: /CLAUDE.md

公开端主题。视觉参考 cosmo-ai.cn：纸白底、细宋体标题、等宽编号、sticky 分章滚动、夜间章节、星空画布。
主题只依赖 `publicApi` 与 `@/content` 的 HOME / PROFILE；数据源切换不影响主题。

## 隔离约定

- 全部样式挂在 `:root[data-surface='cosmo']` 或 `.cz-` 前缀下。CosmoLayout 挂载时写入 data-surface，卸载时移除。
- 样式由 `index.ts` 引入、随 CosmoLayout 分块加载；静态模式不加载 evidentfolio 原样式（main.ts 控制）。
- 元素重置写在 `:where(.cz-shell)` 里，特异度为 0；组件类名设置外边距无需 `!important`。
- 图片与简历经 `api/static.ts` 的 `toAsset()` 输出，简历链接读 `PROFILE.resumeUrl`；两者都经 `assetUrl()` 加 base 前缀。主题里不写 public/ 绝对路径。

## 滚动叙事机制

- 章节 = 高度 `--len` vh 的滚动轨道 + 内部 `.cz-pin` sticky 满屏画框。
- `useChapters` 每帧写入 `--p`（钉住进度 0→1）与 `--in`（可见度 0→1→0）；动画由 CSS `calc()` 驱动。
- 演示组件需要离散状态时读 `progress[key]`，经 props `p` 传入。
- `[data-night]` 章节的可见度写入根节点 `--night` 并切换 `.is-night`；页眉、夜幕层、星空都只读这两个值。
- `stage` 是画布每帧读取的非响应式对象；改写后派发 `STAGE_EVENT` 唤醒已停止的 RAF 循环。
- ≤760px 或减少动效时退化为普通文档流：进度恒为 1，夜间章节自带深色底。

## 成员清单

index.ts: 样式入口，按 base → home → doc 顺序引入
CosmoLayout.vue: 根布局，声明 data-surface、挂载夜幕层与 StarStage、安装惯性滚动；行星数等于公开作品数
composables/useChapters.ts: 滚动叙事引擎，导出 useChapters、stage、STAGE_EVENT、isStaticFlow
components/StarStage.vue: canvas 星空，首屏右侧作品星系 + 夜幕星尘；空闲时停止 RAF
components/CosmoHeader.vue: 固定页眉，首页透明，其余页面滚动后加纸色渐变；滚到页脚淡出；夜间由 :root.is-night 反色
components/CosmoFooter.vue: 页脚，导航 + 联系方式 + 来源声明
components/WorkList.vue: 编号作品行 + 指针跟随封面预览；首页精选与索引页共用；简历项目加上标
components/CosmoContacts.vue: 结语联系方式栏，读 CONTACTS；细线图标横排，微信无链接、点击复制
demos/DialogueDemo.vue: 01 定问题，多轮澄清对话收敛为 WorkflowConfig
demos/LeaderboardDemo.vue: 02 立标准，五模型主榜逐行点亮
demos/DraftDemo.vue: 03 留给人，口述 → AI 草稿，「值不值」留给人确认
demos/SearchDemo.vue: 04 有出处（夜间），搜索「出处」浮现五条决策；作品数由 props total 计算
demos/LoopDemo.vue: 05 回流，六步流水线 + 预测分与实际曝光读数
views/CosmoHome.vue: 首页，序章 + 五章 + 精选作品 + 结语
views/CosmoProjects.vue: 作品索引，前端按分类筛选，状态写入 ?category=
views/CosmoCase.vue: 案例页，四段式 01 问题 → 02 决策 → 03 我做了什么 → 04 证据 + 复盘 + 上下篇；空段落不占编号
views/CosmoAbout.vue: 关于页，关注、经历、教育、荣誉、其他、联系
views/CosmoNotFound.vue: 404
styles/base.css: token、排版原子、夜幕与画布层、页眉页脚、按钮、减少动效
styles/home.css: 首页章节定位、五个演示、作品列表、封面预览、矮屏与窄屏退化
styles/doc.css: 文档页双栏（钉住的编号标签 + 正文）、指标条、图集、Markdown 正文、上下篇、关于页

## 案例页与数据的映射

| 案例段落 | Project 字段 | 来源 |
|---|---|---|
| 指标条 | showcase.metrics | WorkSource.metrics（后端模式缺失时不渲染） |
| 01 问题 | problem（Markdown） | WorkSource.problem |
| 02 决策 | sections[section_type='decision'] | WorkSource.decisions |
| 03 我做了什么 | contributions | WorkSource.contributions |
| 04 证据 | outcomes + 非决策文本区块 + 图集 + links | outcomes、notes、gallery、links |
| 复盘 | showcase.reflection | WorkSource.reflection |

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md

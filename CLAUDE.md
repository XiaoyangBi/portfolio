# portfolio - 毕骁扬的 AI 产品作品集，fork 自 EvidentFolio，默认纯静态部署

Vue 3.5 + Vue Router 4.6 + Pinia 3 + Vite 7.3 + TypeScript 5.8（vue-tsc 3.3）+ Vitest 3.2 + markdown-it + DOMPurify
可选后端：FastAPI（evidentfolio 原实现，仅 `VITE_DATA_SOURCE=api` 时启用）

## 本质

作品集是一份论证：「这个人能把 AI 产品做对」。每件作品是一个论据，按「问题 → 决策 → 贡献 → 证据」组织。
真实性高于观感。数字必须能指回 README、文档或线上地址；团队项目只写本人部分；归属未确认的作品写成 draft。

## 两种形态

| 形态 | 开关 | 数据来源 | 路由 |
|---|---|---|---|
| 静态作品集（默认） | `VITE_DATA_SOURCE` 缺省 | `frontend/src/content/` | `/`、`/projects`、`/projects/:slug`、`/about` |
| CMS 模式 | `VITE_DATA_SOURCE=api` | FastAPI `/api/v1/public/*` | 上述路由 + `/admin/*` + `/en/*` |

两种形态共用 `publicApi` 契约与 cosmo 主题。切换形态不改页面代码。

<directory>
frontend/ - Vue 前端，本站的全部改造都在这里 (关键子目录: src/content、src/themes/cosmo、src/api、public/works)
frontend/src/content/ - 作品与站点数据的唯一来源，作者手写 TypeScript (works/ 存放 13 件公开作品 + 2 件草稿 + 5 件已下架)
frontend/src/themes/cosmo/ - 公开端主题：分章滚动首页、作品索引、案例页、关于页 (5 子目录: components、composables、demos、styles、views)
frontend/src/api/ - 数据门面：static.ts 读 content，public.ts 按开关选择数据源
frontend/src/views、layouts、components、styles/ - evidentfolio 原公开端与后台，仅 CMS 模式使用
frontend/public/works/ - 作品截图，已压缩为 JPG，按作品 slug 分目录
frontend/public/downloads/ - 可公开下载的源码包；只有内容核对过的项目才放进来，含个人身份或业务数据的项目禁止打包
backend/ - evidentfolio FastAPI 后端，未改动，仅 CMS 模式使用
deploy/、docs/、scripts/、Dockerfile.* - evidentfolio 原部署工具链，服务 CMS 模式
</directory>

<config>
.github/workflows/deploy-pages.yml - 正式发布通道：push 到 main/master 自动构建并发布 GitHub Pages，链接固定
frontend/vercel.json - Vercel 备用部署：npm ci + npm run build，全部路径回退到 index.html
frontend/public/_redirects - Netlify / Cloudflare Pages 的 SPA 回退规则
frontend/public/.nojekyll - GitHub Pages 跳过 Jekyll 处理
frontend/package.json - postbuild 复制 index.html 为 dist/404.html，供 GitHub Pages 与对象存储做深链回退
frontend/vite.config.ts - @ 别名、BASE_PATH（GitHub Pages 项目站点）、/api 开发代理、vendor 分块
frontend/src/router/index.ts - history base 取 import.meta.env.BASE_URL，与 vite base 同源
frontend/src/content/site.ts - assetUrl() 统一 public/ 资源路径前缀，项目站点部署时加 vite base
frontend/src/env.d.ts - VITE_DATA_SOURCE、VITE_SHOW_DRAFTS、VITE_API_BASE_URL 的类型契约
.gitignore - 忽略 frontend/dist/、.edgeone/（含部署凭证）与 frontend/frontend.zip（CLI 上传包）
DEPLOY_PORTFOLIO.md - GitHub Pages 三步上线、验收清单与其他平台备用方案
</config>

## 改内容的唯一路径

1. 改 `frontend/src/content/works/*.ts`（作品）或 `site.ts`（身份、履历）或 `home.ts`（首页叙事）。
2. 新增截图放进 `frontend/public/works/{slug}/`，宽度 ≤ 1600px，JPG。
3. 运行 `npx vitest run src/content`：校验 slug、素材、首页引用与四段式完整性。
4. 运行 `npm run build`。

## 上游关系

- `upstream` 指向 `github.com/gmkrxb/evidentfolio`。evidentfolio 原文件保持原样，便于合并上游。
- 本站改动集中在新增目录（content、themes/cosmo、api/static.ts）与少数接线文件（router、main.ts、api/public.ts、types、env.d.ts、index.html）。

法则: 极简·稳定·导航·版本精确

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md

# 作品集部署说明

本站是纯静态站点：构建产物是 `frontend/dist/`，不需要后端、数据库或环境变量。
正式发布通道是 **GitHub Pages**：`.github/workflows/deploy-pages.yml` 在 push 到 `main` / `master` 时自动构建并发布。
链接固定、不带访问参数、不过期。每次改内容只需 push，不需要手动传文件。

## 1. 本地预览

```bash
cd frontend
npm ci
npm run dev                     # http://localhost:5173
VITE_SHOW_DRAFTS=1 npm run dev  # 同时显示 draft 作品，用于核对
```

## 2. 构建

```bash
cd frontend
npx vitest run               # 35 个用例，含内容守门测试
npm run build                # vue-tsc 类型检查 + vite 构建，产物在 dist/
npx vite preview             # 用构建产物预览，http://localhost:4173
```

`npm run build` 的 `postbuild` 额外生成 `dist/404.html`（内容同 index.html）。
`dist/` 自带三份回退配置：`vercel.json`、`_redirects`、`404.html`，外加 `.nojekyll`。
GitHub Pages 用 `404.html` 处理深链，`.nojekyll` 阻止 Jekyll 忽略下划线文件。

## 3. 正式上线：GitHub Pages（三步）

### 第一步：建仓库

在 GitHub 新建空仓库，**仓库名填 `portfolio`**。不要勾选 README、.gitignore、License。

`https://xiaoyangbi.github.io/` 上已有一个旧的深色终端风个人页。不要用它当仓库名，否则会覆盖旧站。
采用项目站点：作品集链接是 `https://xiaoyangbi.github.io/portfolio/`，旧站原样保留。

### 第二步：push

```bash
cd /Users/bixiaoyang/Desktop/bxy个人知识库/portfolio
git add -A
git commit -m "chore: publish AI product portfolio"
git remote add origin https://github.com/XiaoyangBi/portfolio.git
git push -u origin main
```

`origin` 已存在时，把 `remote add` 换成：

```bash
git remote set-url origin https://github.com/XiaoyangBi/portfolio.git
```

当前仓库只有 `upstream`（指向 fork 来源 `gmkrxb/evidentfolio`）。不要往 `upstream` push。

### 第三步：启用 Pages

1. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
2. 打开 **Actions** 页，找到 `Deploy Portfolio to Pages`，点 **Run workflow** 手动触发一次（或重跑第一次 push 触发的失败任务）。
3. 等工作流变绿，打开 `https://xiaoyangbi.github.io/portfolio/`。

### 想要根路径（会替换旧站）

把仓库名改成 `XiaoyangBi.github.io`，Pages 的 Source 仍选 GitHub Actions。工作流检测到用户站点会用根路径 `/` 构建，代码无需改动。
旧个人页会被替换，操作前先备份。

### 工作流做了什么

`deploy-pages.yml` 依次执行：`npm ci` → `npm run build`（含类型检查）→ 上传 `frontend/dist` → `actions/deploy-pages` 发布。
`configure-pages` 要求 Pages 已启用 GitHub Actions 源，所以第三步不能省。

仓库名不是 `<owner>.github.io` 时（项目站点），工作流自动设置 `BASE_PATH=/<仓库名>/`。
`vite.config.ts` 读它设置 `base`，`router/index.ts` 用 `import.meta.env.BASE_URL` 创建 history。
`content/site.ts` 的 `assetUrl()` 给 public/ 下的作品截图与简历 PDF 加同一前缀；`index.html` 的 favicon 用 `%BASE_URL%`。
因此项目站点里图片、简历、favicon 和深链都指向 `/portfolio/`，不会跑到根域名的旧站。
用户站点（`<owner>.github.io`）时 `BASE_URL` 为 `/`，`assetUrl()` 原样返回路径。

仓库里的 `.github/workflows/ci.yml` 与 `docker-publish.yml` 来自上游 EvidentFolio，跑后端测试与镜像构建，与本作品集无关。若它们报红，直接删除这两个文件即可。

## 4. 上线验收

把下面四条链接都点开，全部正常才算部署完成：

- `https://xiaoyangbi.github.io/portfolio/`
- `https://xiaoyangbi.github.io/portfolio/projects`
- `https://xiaoyangbi.github.io/portfolio/projects/insightflow`（深链，最容易翻车）
- `https://xiaoyangbi.github.io/portfolio/works/insightflow/cover.jpg`（静态素材）
- `https://xiaoyangbi.github.io/portfolio/resume-ai-pm.pdf`（简历）

另外确认：`/portfolio/projects/g-exo` 显示「作品不存在，或尚未公开」，说明草稿与已下架作品没有外泄。
`https://xiaoyangbi.github.io/` 仍是原来的旧个人页，说明没有误覆盖。

## 5. 发布前核对

公开链接一旦散出去就不可撤回：搜索引擎会收录，网页存档会留快照。先确认这几项：

- [ ] `frontend/public/resume-ai-pm.pdf` 是最新简历，且你接受其中的手机号与邮箱被公开抓取。
- [ ] 首页结语的微信项是手机号 `13313866815`，确认要公开。
- [ ] 截图中没有内部系统地址、他人姓名或聊天记录。
- [ ] `src/content/works/drafts.ts` 中的作品已确认角色；确认后把 `status` 改为 `published`。
- [ ] 五件 `archived` 作品确认无需恢复。
- [ ] 每件公开作品的数字都能指回出处（`metrics[].source`）。

## 6. 其他通道（临时预览 / 备用）

本站是 History 模式的单页应用。任何平台都必须把未知路径回退到 `index.html`，否则直接打开 `/projects/xxx` 会得到 404。

| 平台 | 构建输出 | 回退规则 | 用途 |
|---|---|---|---|
| GitHub Pages | `frontend/dist` | `404.html` + `.nojekyll` | **正式发布** |
| EdgeOne Makers | `frontend/dist` | 平台处理 SPA | 国内临时预览 |
| Vercel | `frontend/dist` | `vercel.json` | 备用 |
| Netlify / Cloudflare Pages | `frontend/dist` | `_redirects` | 备用 |
| 腾讯云 COS / 阿里云 OSS | `frontend/dist` | 错误文档填 `404.html` | 国内备用 |
| 自有服务器 | `frontend/dist` | 见下方 Nginx | 备用 |

### EdgeOne Makers（临时预览，非长期方案）

```bash
cd frontend
npm run build
npx -y edgeone@1.6.47 makers deploy dist \
  --anonymous --site china --env production --skip-ai-gateway-sync --json
```

匿名部署创建临时项目。CLI 输出 `expiresAt`，到期后平台删除项目、链接返回 404。
访问 URL 带 `eo_token` 与 `eo_time`，首次访问种下 Cookie，Cookie 有效期 3 小时。
不要把带参数的 URL 当成正式链接分享。

要长期保留，需在 `expiresAt` 前认领：

```bash
npx -y edgeone@1.6.47 login --claim --site china --json
```

浏览器打开输出的 `claimLoginUrl` 完成认领，再重新部署到同一项目名：

```bash
npx -y edgeone@1.6.47 makers deploy dist --name <项目名> --env production --json
```

`.edgeone/` 与 `frontend/frontend.zip` 是 CLI 本地状态，`.gitignore` 已忽略。

### 腾讯云 COS / 阿里云 OSS

1. 上传 `dist/` 全部内容到存储桶根目录。
2. 开启静态网站，索引文档设为 `index.html`，错误文档设为 `404.html`。
3. 平台赠送的二级域名可直接访问。绑定自定义域名需要备案。

### Nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/portfolio;          # dist/ 的内容
  index index.html;

  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
  location / { try_files $uri $uri/ /index.html; }
}
```

## 7. CMS 模式（可选）

需要在线后台时，按 evidentfolio 原文档 `docs/DEPLOYMENT.md` 部署后端，并在前端构建时设置 `VITE_DATA_SOURCE=api`。
此模式下 `/admin` 与 `/en` 恢复，公开端仍由 cosmo 主题渲染；作品数据改由后台录入，`src/content/` 不再生效。

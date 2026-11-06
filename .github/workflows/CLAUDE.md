# .github/workflows/

L2 | 父级: /CLAUDE.md

仓库的自动化入口。本站是纯静态前端；只有 `deploy-pages.yml` 属于本站，其余两个工作流来自上游 EvidentFolio，跑后端测试与镜像构建，与本作品集无关。

## 成员清单

deploy-pages.yml: 正式发布通道。push 到 main/master 或手动触发时，npm ci → npm run build → 上传 frontend/dist → actions/deploy-pages 发布。用户站点用根路径，项目站点自动设 BASE_PATH
ci.yml: 上游工作流。对 frontend 做类型检查与测试，对 backend 跑 pytest，并构建 Docker 镜像。不参与本站发布
docker-publish.yml: 上游工作流。release 时发布容器镜像。不参与本站发布

## 发布约束

- Pages 的 Source 必须设为 `GitHub Actions`。`actions/configure-pages` 在 Pages 未启用时失败。
- `frontend/package-lock.json` 必须提交。`npm ci` 依赖它，缺文件会让工作流在 Install 步骤失败。
- `dist/404.html` 由 `postbuild` 生成。删掉它会让 `/projects/:slug` 深链在 Pages 上 404。
- 正式仓库名是 `portfolio`（项目站点）。`https://xiaoyangbi.github.io/` 上已有旧的深色个人页，不要用 `<owner>.github.io` 当仓库名，避免覆盖。
- 项目站点用 `BASE_PATH`。public/ 资源必须经 `assetUrl()` 或 `%BASE_URL%`；手写绝对路径会指向根域名的旧站。
- 改构建命令或产物路径时，同步检查本文件的成员清单与 `DEPLOY_PORTFOLIO.md`。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md

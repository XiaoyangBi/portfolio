# api/

L2 | 父级: /CLAUDE.md

数据门面。页面只依赖 `publicApi` 一个契约；数据来自本地 content 还是 FastAPI 后端，由 `VITE_DATA_SOURCE` 在构建期决定。
`remotePublicApi` 的签名就是契约：`staticPublicApi` 必须逐一对齐，返回同形的 Project / SiteData / 分页结构。
错误统一用 `ApiClientError`；静态适配器找不到资源时抛 status 404，页面错误分支在两种数据源下一致。

## 成员清单

public.ts: 公开端门面，导出 IS_STATIC、publicApi、Paginated、prepareLocalePage；静态模式跳过语言预载
static.ts: 静态适配器，WorkSource → Project 映射（决策 → decision 区块，附注 → note，图集 → gallery，奖项 → Certificate）；只返回 published，draft 在 VITE_SHOW_DRAFTS=1 时放开，archived 任何模式都不公开；素材 URL 经 assetUrl() 加 base 前缀
client.ts: axios 传输层，evidentfolio 原实现；导出 api、ApiClientError、API_BASE_URL
admin.ts: 后台门面，evidentfolio 原实现；仅 CMS 模式的 /admin 使用
public.test.ts: 后端模式测试，测试内把数据源切为 api，验证语言预载

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md

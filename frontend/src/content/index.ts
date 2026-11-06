/**
 * [INPUT]: 依赖同目录 schema、site、home、works 四个子模块
 * [OUTPUT]: 统一再导出作品、站点、联系方式、履历、首页叙事数据与作者类型
 * [POS]: content 模块的唯一出口。外部只写 `@/content`，不深入子文件。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { WORK_CATEGORIES, type WorkCategoryKey, type WorkMedia, type WorkSource } from './schema'
export { SITE, PROFILE, CONTACTS, assetUrl, type ContactLink } from './site'
export { HOME } from './home'
export { WORKS } from './works'

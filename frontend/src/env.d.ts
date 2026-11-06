/**
 * [INPUT]: 依赖 vite/client 的类型
 * [OUTPUT]: 声明 ImportMetaEnv：VITE_API_BASE_URL、VITE_DATA_SOURCE、VITE_SHOW_DRAFTS
 * [POS]: src 根的环境变量契约。VITE_DATA_SOURCE 决定整站形态：static 为纯静态作品集，api 恢复 CMS 后端与 /admin。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** static：读取 src/content 的作品数据，可纯静态部署（默认）；api：读取 FastAPI 后端 */
  readonly VITE_DATA_SOURCE?: 'static' | 'api'
  /** 为 1 时静态数据源也返回 draft 作品，用于本地核对待确认内容 */
  readonly VITE_SHOW_DRAFTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

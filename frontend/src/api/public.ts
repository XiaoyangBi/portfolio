/**
 * [INPUT]: 依赖 ./client 的 api（axios 封装）；依赖 ./static 的 staticPublicApi；依赖 @/types 的领域类型
 * [OUTPUT]: 导出 IS_STATIC、Paginated、publicApi（公开数据唯一入口）、prepareLocalePage（后端模式的语言预载）
 * [POS]: api 模块的公开端门面。页面只认 publicApi 一个契约。
 *        VITE_DATA_SOURCE 缺省或非 'api' 时 IS_STATIC 为真，publicApi 指向 static.ts；否则请求 FastAPI 后端。
 *        remotePublicApi 保留 evidentfolio 原实现，签名即契约：static.ts 必须与它逐一对齐。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { api } from './client'
import { staticPublicApi } from './static'
import type { Asset, Certificate, Project, ResumeVersion, SiteData } from '@/types'

/** 数据源开关：默认读取 src/content 的静态作品；设为 api 时读取 FastAPI 后端。 */
export const IS_STATIC = import.meta.env.VITE_DATA_SOURCE !== 'api'

export interface Paginated<T> {
  items: T[]
  pagination: { page: number; page_size: number; total: number; pages?: number }
}

// 只消费一次的预载，文案就绪后再切换语言。
const prepared = new Map<string, { value: unknown; expires: number }>()
const requestKey = (path: string, params: Record<string, unknown>) => path + JSON.stringify(Object.entries(params).filter(([, value]) => value !== undefined).sort(([a], [b]) => a.localeCompare(b)))
function localizedGet<T>(path: string, params: Record<string, unknown> = {}, signal?: AbortSignal): Promise<T> {
  const query = { ...params, locale: currentLocale() }
  const key = requestKey(path, query), cached = prepared.get(key)
  prepared.delete(key)
  if (cached && cached.expires > Date.now() && !signal?.aborted) return Promise.resolve(cached.value as T)
  return api.get<T>(path, query, signal)
}
export async function prepareLocalePage(path: string, query: Record<string, unknown>, locale: 'zh-CN' | 'en') {
  if (IS_STATIC) return
  prepared.clear()
  async function preload<T>(endpoint: string, params: Record<string, unknown> = {}) {
    const args = { ...params, locale }, value = await api.get<T>(endpoint, args)
    prepared.set(requestKey(endpoint, args), { value, expires: Date.now() + 10000 })
    return value
  }
  const siteTask = preload<SiteData>('/public/site')
  if (path === '/') {
    const site = await siteTask
    await preload('/public/projects', { featured: true, page_size: Math.min(12, Math.max(1, Number(site.settings.featured_project_count) || 3)) })
  } else {
    const pageTask = path === '/projects'
      ? preload('/public/projects', { q: query.q || undefined, category: query.category || undefined, tags: Array.isArray(query.tags) ? query.tags : query.tags ? [query.tags] : [], sort: query.sort || 'featured', page_size: 50 })
      : /^\/(projects|certificates|assets)\/[^/]+$/.test(path) || ['/resumes', '/certificates'].includes(path) ? preload('/public' + path) : Promise.resolve()
    await Promise.all([siteTask, pageTask])
  }
}

const remotePublicApi = {
  site: (signal?: AbortSignal) => localizedGet<SiteData>('/public/site', {}, signal),
  projects: (params: Record<string, unknown>, signal?: AbortSignal) =>
    localizedGet<Paginated<Project>>('/public/projects', params, signal),
  project: (uuid: string, signal?: AbortSignal) =>
    localizedGet<Project>(`/public/projects/${uuid}`, {}, signal),
  resumes: (signal?: AbortSignal) =>
    localizedGet<{ items: ResumeVersion[] }>('/public/resumes', {}, signal),
  resume: (uuid: string, signal?: AbortSignal) =>
    localizedGet<ResumeVersion>(`/public/resumes/${uuid}`, {}, signal),
  certificates: (signal?: AbortSignal) =>
    localizedGet<{ items: Certificate[] }>('/public/certificates', {}, signal),
  certificate: (uuid: string, signal?: AbortSignal) =>
    localizedGet<Certificate>(`/public/certificates/${uuid}`, {}, signal),
  asset: (uuid: string, signal?: AbortSignal) =>
    localizedGet<Asset>(`/public/assets/${uuid}`, {}, signal),
  assetPreview: (uuid: string, signal?: AbortSignal) =>
    api.get<{
      kind: 'office' | 'archive'
      sections?: Array<{ title: string; lines: string[] }>
      entries?: Array<{ name: string; size: number; compressed_size: number; is_directory: boolean }>
      entry_count?: number
      truncated?: boolean
    }>(`/public/assets/${uuid}/preview`, undefined, signal),
}

/** 公开数据入口：页面只依赖这一契约，不关心数据来自本地内容还是后端。 */
export const publicApi: typeof remotePublicApi = IS_STATIC ? staticPublicApi : remotePublicApi

function currentLocale() {
  return location.pathname === '/en' || location.pathname.startsWith('/en/') ? 'en' : 'zh-CN'
}

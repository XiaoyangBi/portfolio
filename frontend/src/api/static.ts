/**
 * [INPUT]: 依赖 @/content 的 WORKS、SITE、PROFILE、WORK_CATEGORIES、assetUrl；依赖 ./client 的 ApiClientError；依赖 @/types 的领域类型
 * [OUTPUT]: 导出 staticPublicApi（与 publicApi 同签名）与 toProject（WorkSource → Project 映射）
 * [POS]: api 模块的静态数据源适配器。public.ts 在 VITE_DATA_SOURCE !== 'api' 时把 publicApi 指向它。
 *        它让主题层只认 evidentfolio 的 Project 契约：同一套页面既能读本地内容，也能读 CMS 后端。
 *        draft 默认不公开，VITE_SHOW_DRAFTS=1 时放开；archived 是本人主动下架的作品，任何模式都不公开。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { ApiClientError } from './client'
import { PROFILE, SITE, WORKS, WORK_CATEGORIES, assetUrl, type WorkMedia, type WorkSource } from '@/content'
import type { Asset, Certificate, Project, ProjectSection, ResumeVersion, SiteData, TaxonomyItem } from '@/types'
import type { Paginated } from './public'

const SHOW_DRAFTS = import.meta.env.VITE_SHOW_DRAFTS === '1'

/* ────────────────────────── 映射：素材 ────────────────────────── */

const MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml', pdf: 'application/pdf' }

function toAsset(src: string, extra: Partial<Asset> = {}): Asset {
  const name = src.split('/').pop() || src
  const extension = name.split('.').pop()?.toLowerCase() || ''
  const url = assetUrl(src)
  return {
    version: 1, uuid: src, original_name: name, display_name: name, mime_type: MIME[extension] || 'application/octet-stream',
    extension, size: 0, sha256: '', category: extension === 'pdf' ? 'document' : 'image', width: null, height: null, duration: null,
    is_public: true, access_mode: 'download', previewable: true, protected: false, description: '', logical_group: '', folder: null,
    view_count: 0, download_count: 0, created_at: '', updated_at: '', content_url: url, download_url: url, thumbnail_url: url,
    ...extra,
  }
}

const mediaAsset = (media: WorkMedia) => toAsset(media.src, { width: media.width, height: media.height, description: media.caption || '', display_name: media.caption || media.src })

/* ────────────────────────── 映射：作品 ────────────────────────── */

function category(work: WorkSource): TaxonomyItem {
  const item = WORK_CATEGORIES[work.category]
  return { uuid: work.category, slug: work.category, name: item.name, description: item.description }
}

function certificate(work: WorkSource): Certificate[] {
  if (!work.award) return []
  return [{
    uuid: `${work.slug}-award`, name: work.award.name, issuer: work.award.issuer, certificate_type: 'competition', issued_at: work.award.date,
    description: '', credential_no: '', credential_url: '', is_public: true, sort_order: 0, project_count: 1,
    asset: null, icon_asset: null, icon_name: '', icon_svg: '', created_at: '', updated_at: '',
  }]
}

function section(key: string, title: string, body: string, type: string, order: number, media: WorkMedia[] = []): ProjectSection {
  return {
    client_key: key, title, body, section_type: type, display_mode: media.length ? 'gallery' : 'text',
    asset_uuids: media.map((item) => item.src), album_uuid: null, heading_level: 3, is_visible: true,
    media_assets: media.map(mediaAsset), sort_order: order,
  }
}

/** 决策 → decision 区块；附注 → note 区块；图集 → gallery 区块。主题按 section_type 分组渲染。 */
function sections(work: WorkSource): ProjectSection[] {
  const decisions = work.decisions.map((item, index) => section(`decision-${index}`, item.title, item.why, 'decision', index))
  const notes = (work.notes || []).map((item, index) => section(`note-${index}`, item.title, item.body, 'note', 100 + index))
  const gallery = work.gallery?.length ? [section('gallery', '图集', '', 'gallery', 200, work.gallery)] : []
  return [...decisions, ...notes, ...gallery]
}

export function toProject(work: WorkSource): Project {
  const cover = work.cover ? mediaAsset(work.cover) : null
  return {
    uuid: work.slug, title: work.title, subtitle: work.subtitle, summary: work.summary, content: '', background: '',
    problem: work.problem, solution: '', architecture: '', contributions: work.contributions, technologies: work.stack, outcomes: work.outcomes,
    start_date: work.start, end_date: work.end || '', role: work.role, team_size: work.team ?? null,
    status: work.status, project_state: work.state, is_featured: work.featured,
    is_open_source: work.links.some((link) => link.url.includes('github.com')), sort_order: work.order, content_layout: [],
    category: category(work), tags: work.tags.map((tag) => ({ uuid: tag, slug: tag, name: tag })), certificates: certificate(work),
    cover_asset: cover, auto_cover_assets: cover ? [cover] : [],
    links: work.links.map((link, index) => ({
      label: link.label,
      url: link.url.startsWith('/') ? assetUrl(link.url) : link.url,
      link_type: /\.zip(\?|#|$)/i.test(link.url) ? 'download' : link.url.includes('github.com') ? 'repository' : 'website',
      sort_order: index,
    })),
    sections: sections(work), albums: [], assets: [],
    seo_title: work.title, seo_description: work.subtitle, published_at: null, created_at: '', updated_at: '',
    translations: {}, content_language_mode: 'single_zh',
    showcase: { metrics: work.metrics, principle: work.principle, origin: work.origin, reflection: work.reflection },
  }
}

/* ────────────────────────── 查询 ────────────────────────── */

const visible = () => WORKS.filter((work) => work.status === 'published' || (SHOW_DRAFTS && work.status === 'draft'))
const notFound = (what: string) => Promise.reject(new ApiClientError(`${what}不存在`, 'NOT_FOUND', 404))

function listProjects(params: Record<string, unknown>): Paginated<Project> {
  const q = String(params.q || '').trim().toLowerCase()
  const tags = ([] as unknown[]).concat(params.tags ?? []).map(String)
  let items = visible()
  if (params.featured) items = items.filter((work) => work.featured)
  if (params.category) items = items.filter((work) => work.category === params.category)
  if (tags.length) items = items.filter((work) => tags.every((tag) => work.tags.includes(tag)))
  if (q) items = items.filter((work) => [work.title, work.subtitle, work.summary, ...work.tags, ...work.stack].join(' ').toLowerCase().includes(q))
  const size = Math.max(1, Number(params.page_size) || items.length || 1)
  const page = items.slice(0, size).map(toProject)
  return { items: page, pagination: { page: 1, page_size: size, total: items.length, pages: Math.ceil(items.length / size) } }
}

const RESUME: ResumeVersion = {
  uuid: 'ai-pm', name: 'AI 产品经理简历', language: 'zh-CN', resume_type: 'pdf', is_default: true, is_public: true, version: '2026-11',
  view_count: 0, download_count: 0, created_at: '', updated_at: '', asset: toAsset(PROFILE.resumeUrl),
}

const certificates = () => visible().flatMap(certificate)

export const staticPublicApi = {
  site: (_signal?: AbortSignal): Promise<SiteData> => Promise.resolve(SITE),
  projects: (params: Record<string, unknown>, _signal?: AbortSignal) => Promise.resolve(listProjects(params)),
  project: (uuid: string, _signal?: AbortSignal) => {
    const work = visible().find((item) => item.slug === uuid)
    return work ? Promise.resolve(toProject(work)) : notFound('作品')
  },
  resumes: (_signal?: AbortSignal) => Promise.resolve({ items: [RESUME] }),
  resume: (uuid: string, _signal?: AbortSignal) => (uuid === RESUME.uuid ? Promise.resolve(RESUME) : notFound('简历')),
  certificates: (_signal?: AbortSignal) => Promise.resolve({ items: certificates() }),
  certificate: (uuid: string, _signal?: AbortSignal) => {
    const item = certificates().find((entry) => entry.uuid === uuid)
    return item ? Promise.resolve(item) : notFound('证书')
  },
  asset: (_uuid: string, _signal?: AbortSignal): Promise<Asset> => notFound('资源'),
  assetPreview: (_uuid: string, _signal?: AbortSignal): Promise<never> => notFound('资源预览'),
}

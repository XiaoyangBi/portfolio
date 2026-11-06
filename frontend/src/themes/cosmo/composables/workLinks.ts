/**
 * [INPUT]: 依赖 @/types 的 Project、ProjectLink
 * [OUTPUT]: 导出 LinkKind、WorkLink、classifyLinks、badges
 * [POS]: themes/cosmo 的链接分类工具，纯函数，无响应式。
 *        状态只由真实 links 派生：GitHub / Gitee / GitLab → 已开源；其他 http → 已部署可访问；zip → 源码包。
 *        首页精选、作品索引、案例页共用同一份判定，避免三处各写一套。
 *        没有可公开入口的作品返回空数组。不编造链接，不把「仅案例」伪装成「已开源」。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { Project, ProjectLink } from '@/types'

export type LinkKind = 'source' | 'demo' | 'download'

export interface WorkLink {
  link: ProjectLink
  kind: LinkKind
  label: string
}

const KIND_LABEL: Record<LinkKind, string> = {
  source: '已开源',
  demo: '已部署可访问',
  download: '源码包',
}

const ORDER: LinkKind[] = ['demo', 'source', 'download']

function kindOf(url: string): LinkKind {
  if (/\.zip(\?|#|$)/i.test(url) || url.includes('/downloads/')) return 'download'
  if (/github\.com|gitee\.com|gitlab\.com/i.test(url)) return 'source'
  return 'demo'
}

export function classifyLinks(project: Project): WorkLink[] {
  return (project.links || []).map((link) => {
    const kind = kindOf(link.url)
    return { link, kind, label: KIND_LABEL[kind] }
  })
}

/** 列表徽标：按「能直接体验 → 能看源码 → 能下载」去重排序 */
export function badges(project: Project): Array<{ label: string; kind: LinkKind }> {
  const present = new Set(classifyLinks(project).map((item) => item.kind))
  return ORDER.filter((kind) => present.has(kind)).map((kind) => ({ label: KIND_LABEL[kind], kind }))
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

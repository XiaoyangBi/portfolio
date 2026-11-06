/**
 * [INPUT]: 依赖 vue-router；依赖 @/api/public 的 IS_STATIC；依赖 @/stores 的 auth / locale / site；
 *          依赖 @/utils/pageNavigation 的滚动恢复；依赖 @/themes/cosmo 的布局与视图
 * [OUTPUT]: 默认导出 router
 * [POS]: 应用的路由表。公开端一律挂在 cosmo 主题下（/、/projects、/projects/:uuid、/about）。
 *        静态模式（默认）没有后端：不注册 /admin 与 /en，也不查询初始化状态。
 *        history base 取 import.meta.env.BASE_URL，与 vite.config.ts 的 base 同源，供 GitHub Pages 项目站点使用。
 *        VITE_DATA_SOURCE=api 时恢复 evidentfolio 的后台与英文路由，公开端仍由 cosmo 渲染。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { readPreference, writePreference } from '@/utils/storage'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { authApi } from '@/api/admin'
import { IS_STATIC } from '@/api/public'
import { useSiteStore } from '@/stores/site'
import { initialScroll, isLocaleNavigation, waitForPageContent } from '@/utils/pageNavigation'

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

/* ────────────────────────── 公开端：cosmo 主题 ────────────────────────── */

const cosmoRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('@/themes/cosmo/CosmoLayout.vue'),
  meta: { layoutKey: 'cosmo' },
  children: [
    { path: '', name: 'home', component: () => import('@/themes/cosmo/views/CosmoHome.vue') },
    { path: 'projects', name: 'projects', component: () => import('@/themes/cosmo/views/CosmoProjects.vue') },
    { path: 'projects/:uuid', name: 'project-detail', component: () => import('@/themes/cosmo/views/CosmoCase.vue') },
    { path: 'about', name: 'about', component: () => import('@/themes/cosmo/views/CosmoAbout.vue') },
    { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('@/themes/cosmo/views/CosmoNotFound.vue') },
  ],
}

/* ────────────────────────── 后端模式：evidentfolio 原路由 ────────────────────────── */

function legacyPublicChildren(prefix: string): RouteRecordRaw[] {
  return [
    { path: '', name: `${prefix}home`, component: () => import('@/views/public/HomeView.vue') },
    { path: 'projects', name: `${prefix}projects`, component: () => import('@/views/public/ProjectsView.vue') },
    { path: 'projects/:uuid', name: `${prefix}project-detail`, component: () => import('@/views/public/ProjectDetailView.vue') },
    { path: 'resumes', name: `${prefix}resumes`, component: () => import('@/views/public/ResumesView.vue') },
    { path: 'certificates', name: `${prefix}certificates`, component: () => import('@/views/public/CertificatesView.vue') },
    { path: 'certificates/:uuid', name: `${prefix}certificate-detail`, component: () => import('@/views/public/CertificateDetailView.vue') },
    { path: 'contact', name: `${prefix}contact`, component: () => import('@/views/public/ContactView.vue') },
    { path: 'assets/:uuid', name: `${prefix}asset-viewer`, component: () => import('@/views/public/AssetViewerView.vue') },
    { path: ':pathMatch(.*)*', name: `${prefix}not-found`, component: () => import('@/views/NotFoundView.vue') },
  ]
}

const backendRoutes: RouteRecordRaw[] = [
  {
    path: '/en',
    component: () => import('@/layouts/PublicLayout.vue'),
    meta: { layoutKey: 'public', locale: 'en' },
    children: legacyPublicChildren('en-'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, layoutKey: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'projects', name: 'admin-projects', component: () => import('@/views/admin/ProjectsAdminView.vue') },
      { path: 'projects/new', name: 'admin-project-new', component: () => import('@/views/admin/ProjectEditorView.vue') },
      { path: 'projects/:uuid', name: 'admin-project-edit', component: () => import('@/views/admin/ProjectEditorView.vue') },
      { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/TaxonomyView.vue'), props: { mode: 'categories' } },
      { path: 'tags', name: 'admin-tags', component: () => import('@/views/admin/TaxonomyView.vue'), props: { mode: 'tags' } },
      { path: 'assets', name: 'admin-assets', component: () => import('@/views/admin/AssetsAdminView.vue') },
      { path: 'resumes', name: 'admin-resumes', component: () => import('@/views/admin/ResumesAdminView.vue') },
      { path: 'certificates', name: 'admin-certificates', component: () => import('@/views/admin/CertificatesAdminView.vue') },
      { path: 'analytics', name: 'admin-analytics', component: () => import('@/views/admin/AnalyticsView.vue') },
      { path: 'ai', name: 'admin-ai', component: () => import('@/views/admin/AIAdminView.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('@/views/admin/SettingsView.vue') },
      { path: 'audit-logs', name: 'admin-audit', component: () => import('@/views/admin/AuditLogsView.vue') },
    ],
  },
]

/* ────────────────────────── 路由实例 ────────────────────────── */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  async scrollBehavior(to, from, savedPosition) {
    if (isLocaleNavigation(to.path, from.path) && useLocaleStore().switching) return false
    const position = initialScroll(!from.matched.length, to.hash, savedPosition)
    if (position || to.hash) {
      if (from.matched.length || to.hash) {
        if (!to.path.startsWith('/admin')) await useSiteStore().load().catch(() => undefined)
        await waitForPageContent()
      }
      if (position) return { ...position, behavior: 'instant' }
    }
    if (to.hash) return { el: to.hash, top: (document.querySelector<HTMLElement>('.cz-top, .public-header')?.offsetHeight || 72) + 28, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }
    if (to.path !== from.path) return { top: 0, behavior: 'instant' }
  },
  // 后端路由必须排在 cosmo 之前：cosmo 的 catch-all 会吞掉 /admin 与 /en。
  routes: IS_STATIC ? [cosmoRoutes] : [...backendRoutes, cosmoRoutes],
})

/* ────────────────────────── 守卫：仅后端模式生效 ────────────────────────── */

if (!IS_STATIC) {
  router.beforeEach(async (to) => {
    if (!to.path.startsWith('/admin') && !readPreference('evidentfolio_setup_complete')) {
      try {
        const setup = await authApi.setupStatus()
        if (setup.required) return { name: 'admin-login', query: { setup: '1' } }
        writePreference('evidentfolio_setup_complete', '1')
      } catch {
        // 接口异常由页面展示，不阻断导航。
      }
    }
    if (!to.path.startsWith('/admin')) useLocaleStore().syncPath(to.path)
    const auth = useAuthStore()
    if (to.meta.requiresAuth) {
      const authenticated = await auth.check()
      if (!authenticated) return { name: 'admin-login', query: { redirect: to.fullPath } }
    }
    if (to.meta.guestOnly) {
      const authenticated = await auth.check()
      if (authenticated) return { name: 'admin-dashboard' }
    }
  })
}

export default router

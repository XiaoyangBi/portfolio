<!--
  [INPUT]: 依赖 vue-router 的 useRoute；依赖 @/api/public 的 publicApi；依赖 @/components/content/MarkdownContent；
           依赖 @/composables/useMeta、@/stores/site、@/utils/pageNavigation 的 trackPageLoad；依赖 @/types 的 Project
  [OUTPUT]: CosmoCase 页面组件（路由 /projects/:uuid）
  [POS]: themes/cosmo/views 的案例详情页，是作品集的论证单元。
         版式固定为四段：01 问题 → 02 决策 → 03 我做了什么 → 04 证据，末尾是复盘与上下篇。
         段落为空即跳过，编号按实际出现的段落重排。
         section_type 分组：decision → 决策；gallery 或带图区块 → 图集；其余 → 证据附注。
         showcase 字段缺失（后端模式）时，指标条与来源标记不渲染，其余版式不变。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { publicApi } from '@/api/public'
import type { Project, ProjectSection } from '@/types'
import MarkdownContent from '@/components/content/MarkdownContent.vue'
import { useMeta } from '@/composables/useMeta'
import { useSiteStore } from '@/stores/site'
import { trackPageLoad } from '@/utils/pageNavigation'

const route = useRoute()
const site = useSiteStore()
const project = ref<Project | null>(null)
const siblings = ref<Project[]>([])
const missing = ref(false)

/* ────────────────────────── 加载 ────────────────────────── */

async function load(uuid: string) {
  missing.value = false
  try {
    const [item, all] = await Promise.all([publicApi.project(uuid), publicApi.projects({ page_size: 100 })])
    project.value = item
    siblings.value = all.items
  } catch {
    project.value = null
    missing.value = true
  }
}
watch(() => String(route.params.uuid || ''), (uuid) => { if (uuid) void trackPageLoad(load(uuid)) }, { immediate: true })

/* ────────────────────────── 派生 ────────────────────────── */

const fmt = (value: string) => value.replace('-', '.')
const period = computed(() => {
  const item = project.value
  if (!item?.start_date) return ''
  if (!item.end_date) return `${fmt(item.start_date)} 起`
  return item.end_date === item.start_date ? fmt(item.start_date) : `${fmt(item.start_date)} — ${fmt(item.end_date)}`
})

const facts = computed(() => {
  const item = project.value
  if (!item) return []
  const team = item.team_size ? (item.team_size === 1 ? '独立完成' : `${item.team_size} 人`) : ''
  const origin = item.showcase ? (item.showcase.origin === 'resume' ? '简历所列项目' : '简历外个人项目') : ''
  return [
    { label: '角色', value: item.role },
    { label: '团队', value: team },
    { label: '时间', value: period.value },
    { label: '状态', value: item.project_state },
    { label: '来源', value: origin },
  ].filter((fact) => fact.value)
})

const eyebrow = computed(() => [project.value?.category?.name, project.value?.showcase?.principle].filter(Boolean).join(' · '))
const metrics = computed(() => project.value?.showcase?.metrics || [])
const award = computed(() => project.value?.certificates[0] || null)

const visibleSections = computed(() => (project.value?.sections || []).filter((item) => item.is_visible).sort((a, b) => a.sort_order - b.sort_order))
const media = (item: ProjectSection) => item.media_assets || []
const isGallery = (item: ProjectSection) => item.section_type === 'gallery' || (item.display_mode === 'gallery' && media(item).length > 0)
const decisions = computed(() => visibleSections.value.filter((item) => item.section_type === 'decision'))
const gallery = computed(() => visibleSections.value.filter(isGallery).flatMap(media))
const notes = computed(() => visibleSections.value.filter((item) => item.section_type !== 'decision' && !isGallery(item) && item.body))

/** 实际出现的段落及其编号；空段落不占编号 */
const parts = computed(() => {
  const item = project.value
  if (!item) return {} as Record<string, string>
  const present = [
    ['problem', Boolean(item.problem)],
    ['decisions', decisions.value.length > 0],
    ['contributions', item.contributions.length > 0],
    ['evidence', item.outcomes.length + notes.value.length + gallery.value.length + item.links.length > 0],
  ] as const
  return Object.fromEntries(present.filter(([, on]) => on).map(([key], index) => [key, String(index + 1).padStart(2, '0')])) as Record<string, string>
})

const neighbours = computed(() => {
  const index = siblings.value.findIndex((item) => item.uuid === project.value?.uuid)
  if (index < 0) return { prev: null, next: null }
  return { prev: siblings.value[index - 1] || null, next: siblings.value[index + 1] || null }
})

useMeta({
  title: () => (project.value ? `${project.value.title} · ${site.settings.person_name || '作品集'}` : '作品'),
  description: () => project.value?.seo_description || project.value?.subtitle || '',
  image: () => project.value?.cover_asset?.content_url,
})
</script>

<template>
  <article v-if="project" class="cz-doc cz-case">
    <RouterLink class="cz-back cz-mono" to="/projects">← 全部作品</RouterLink>

    <!-- 页眉：它是什么 -->
    <header class="cz-case__head">
      <p v-if="eyebrow" class="cz-eyebrow">{{ eyebrow }}</p>
      <h1 class="cz-serif cz-case__title">{{ project.title }}</h1>
      <p class="cz-case__sub">{{ project.subtitle }}</p>
      <dl class="cz-facts">
        <div v-for="fact in facts" :key="fact.label">
          <dt class="cz-mono">{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>
      <p v-if="award" class="cz-award"><span class="cz-mono">AWARD</span>{{ award.name }}<template v-if="award.issuer"> · {{ award.issuer }}</template></p>
    </header>

    <p class="cz-case__lead cz-serif">{{ project.summary }}</p>

    <ul v-if="metrics.length" class="cz-metrics">
      <li v-for="metric in metrics" :key="metric.label">
        <strong class="cz-serif">{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
        <small v-if="metric.source" class="cz-mono">{{ metric.source }}</small>
      </li>
    </ul>

    <figure v-if="project.cover_asset" class="cz-figure cz-case__cover">
      <img :src="project.cover_asset.content_url" :width="project.cover_asset.width || undefined" :height="project.cover_asset.height || undefined" :alt="project.cover_asset.description || project.title" />
      <figcaption v-if="project.cover_asset.description">{{ project.cover_asset.description }}</figcaption>
    </figure>

    <!-- 01 问题 -->
    <section v-if="parts.problem" id="problem" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">{{ parts.problem }}</span>问题</h2>
      <div class="cz-part__body cz-prose"><MarkdownContent :source="project.problem" /></div>
    </section>

    <!-- 02 决策 -->
    <section v-if="parts.decisions" id="decisions" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">{{ parts.decisions }}</span>决策</h2>
      <ol class="cz-part__body cz-decisions">
        <li v-for="(item, index) in decisions" :key="item.client_key || index">
          <span class="cz-mono">{{ String.fromCharCode(65 + index) }}</span>
          <h3 class="cz-serif">{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </li>
      </ol>
    </section>

    <!-- 03 我做了什么 -->
    <section v-if="parts.contributions" id="contributions" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">{{ parts.contributions }}</span>我做了什么</h2>
      <ul class="cz-part__body cz-ticks"><li v-for="item in project.contributions" :key="item">{{ item }}</li></ul>
    </section>

    <!-- 04 证据 -->
    <section v-if="parts.evidence" id="evidence" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">{{ parts.evidence }}</span>证据</h2>
      <div class="cz-part__body">
        <ul v-if="project.outcomes.length" class="cz-ticks"><li v-for="item in project.outcomes" :key="item">{{ item }}</li></ul>
        <div v-for="note in notes" :key="note.client_key || note.title" class="cz-note">
          <h3 class="cz-mono">{{ note.title }}</h3>
          <div class="cz-prose"><MarkdownContent :source="note.body" /></div>
        </div>
        <div v-if="gallery.length" class="cz-gallery">
          <figure v-for="media in gallery" :key="media.uuid" class="cz-figure">
            <a :href="media.content_url" target="_blank" rel="noopener">
              <img :src="media.content_url" :width="media.width || undefined" :height="media.height || undefined" :alt="media.description || media.display_name" loading="lazy" />
            </a>
            <figcaption v-if="media.description">{{ media.description }}</figcaption>
          </figure>
        </div>
        <ul v-if="project.links.length" class="cz-links">
          <li v-for="link in project.links" :key="link.url">
            <a :href="link.url" target="_blank" rel="noopener"><span>{{ link.label }}</span><span class="cz-mono">{{ link.url.replace(/^https?:\/\//, '') }}</span>↗</a>
          </li>
        </ul>
      </div>
    </section>

    <!-- 复盘 -->
    <section v-if="project.showcase?.reflection" class="cz-part cz-part--reflection">
      <h2 class="cz-part__label"><span class="cz-mono">—</span>复盘</h2>
      <blockquote class="cz-part__body cz-serif">{{ project.showcase.reflection }}</blockquote>
    </section>

    <footer class="cz-case__foot">
      <dl class="cz-facts cz-facts--stack">
        <div v-if="project.technologies.length"><dt class="cz-mono">技术</dt><dd>{{ project.technologies.join(' / ') }}</dd></div>
        <div v-if="project.tags.length"><dt class="cz-mono">标签</dt><dd>{{ project.tags.map((tag) => tag.name).join(' / ') }}</dd></div>
      </dl>
      <nav class="cz-pager" aria-label="上下篇">
        <RouterLink v-if="neighbours.prev" class="cz-pager__prev" :to="`/projects/${neighbours.prev.uuid}`">
          <span class="cz-mono">← 上一篇</span><strong class="cz-serif">{{ neighbours.prev.title }}</strong>
        </RouterLink>
        <RouterLink v-if="neighbours.next" class="cz-pager__next" :to="`/projects/${neighbours.next.uuid}`">
          <span class="cz-mono">下一篇 →</span><strong class="cz-serif">{{ neighbours.next.title }}</strong>
        </RouterLink>
      </nav>
    </footer>
  </article>

  <section v-else-if="missing" class="cz-doc cz-empty">
    <p class="cz-eyebrow">404</p>
    <h1 class="cz-serif">这件作品不存在，或尚未公开。</h1>
    <RouterLink class="cz-more" to="/projects">回到全部作品</RouterLink>
  </section>

  <div v-else class="cz-doc cz-loading" aria-busy="true" />
</template>

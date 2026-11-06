<!--
  [INPUT]: 依赖 vue-router 的 useRoute / useRouter；依赖 @/api/public 的 publicApi；依赖 @/stores/site 的分类；
           依赖 ../components/WorkList 与 ../composables/workLinks；依赖 @/composables/useMeta、@/utils/pageNavigation 的 trackPageLoad
  [OUTPUT]: CosmoProjects 页面组件（路由 /projects）
  [POS]: themes/cosmo/views 的作品索引。一次取回全部公开作品，在前端按分类筛选，计数由同一份列表算出。
         当前分类写入 ?category=，链接可分享；空分类不显示，避免出现「0 件」的按钮。
         页头下方的置顶入口区把全部真实外链摊开。Personal Agent 主线的作品优先，其余按「可体验 → 可看源码 → 可下载」排序。
         入口与徽标都从 links 派生；没有可公开入口的作品不会出现在这里。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { publicApi } from '@/api/public'
import type { Project } from '@/types'
import { useMeta } from '@/composables/useMeta'
import { useSiteStore } from '@/stores/site'
import { trackPageLoad } from '@/utils/pageNavigation'
import WorkList from '../components/WorkList.vue'
import { classifyLinks, isExternal, type LinkKind } from '../composables/workLinks'

const route = useRoute()
const router = useRouter()
const site = useSiteStore()
const all = ref<Project[]>([])

void trackPageLoad(publicApi.projects({ page_size: 100 }).then((result) => { all.value = result.items }).catch(() => undefined))

const active = computed(() => String(route.query.category || ''))
const filters = computed(() => {
  const count = (slug: string) => all.value.filter((item) => item.category?.slug === slug).length
  return site.categories.map((item) => ({ slug: item.slug, name: item.name, description: item.description, count: count(item.slug) })).filter((item) => item.count)
})
const current = computed(() => filters.value.find((item) => item.slug === active.value) || null)
const shown = computed(() => (active.value ? all.value.filter((item) => item.category?.slug === active.value) : all.value))

const hasKind = (project: Project, kind: LinkKind) => classifyLinks(project).some((item) => item.kind === kind)
const counts = computed(() => ({
  source: all.value.filter((item) => hasKind(item, 'source')).length,
  demo: all.value.filter((item) => hasKind(item, 'demo')).length,
  download: all.value.filter((item) => hasKind(item, 'download')).length,
}))

/** Personal Agent 主线的作品优先露出入口 */
const SPOTLIGHT = new Set(['personal-agent-benchmark', 'personal-memory', 'second-brain', 'reading-coach'])
const spotlight = (slug: string) => (SPOTLIGHT.has(slug) ? 0 : 1)

const RANK: Record<LinkKind, number> = { demo: 0, source: 1, download: 2 }
const launchpad = computed(() => all.value
  .flatMap((project) => classifyLinks(project).map((item) => ({
    key: `${project.uuid}:${item.link.url}`,
    slug: project.uuid,
    title: project.title,
    label: item.label,
    kind: item.kind,
    url: item.link.url,
  })))
  .sort((a, b) => spotlight(a.slug) - spotlight(b.slug) || RANK[a.kind] - RANK[b.kind]))

function pick(slug: string) {
  void router.replace({ query: slug && slug !== active.value ? { category: slug } : {} })
}

useMeta({
  title: () => `全部作品 · ${site.settings.person_name || '作品集'}`,
  description: () => '按「问题 → 决策 → 贡献 → 证据」组织的 AI 产品作品索引。',
})
</script>

<template>
  <div class="cz-doc cz-index-page">
    <header class="cz-doc__head">
      <p class="cz-eyebrow">INDEX · {{ String(all.length).padStart(2, '0') }}</p>
      <h1 class="cz-serif">全部作品</h1>
    </header>

    <section v-if="launchpad.length" class="cz-launchpad" aria-label="开源与在线入口">
      <div class="cz-launchpad__intro">
        <p class="cz-eyebrow">OPEN SOURCE · LIVE · DOWNLOAD</p>
        <p class="cz-launchpad__lead">{{ counts.source }} 件已开源，{{ counts.demo }} 件已部署可直接访问，{{ counts.download }} 件提供源码包下载。</p>
      </div>
      <ul class="cz-launchpad__grid">
        <li v-for="item in launchpad" :key="item.key">
          <a
            class="cz-launchcard"
            :class="`is-${item.kind}`"
            :href="item.url"
            :target="isExternal(item.url) ? '_blank' : undefined"
            :download="isExternal(item.url) ? undefined : ''"
            rel="noopener"
          >
            <span class="cz-launchcard__kind cz-mono">{{ item.label }}</span>
            <strong class="cz-serif">{{ item.title }}</strong>
            <span class="cz-launchcard__url cz-mono">{{ item.url.replace(/^https?:\/\//, '') }}</span>
            <span class="cz-launchcard__go" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </section>

    <nav v-if="filters.length > 1" class="cz-filters" aria-label="按分类筛选">
      <button type="button" :class="{ 'is-on': !active }" @click="pick('')">全部<sup class="cz-mono">{{ all.length }}</sup></button>
      <button v-for="item in filters" :key="item.slug" type="button" :class="{ 'is-on': active === item.slug }" @click="pick(item.slug)">
        {{ item.name }}<sup class="cz-mono">{{ item.count }}</sup>
      </button>
    </nav>
    <p class="cz-filters__note">{{ current?.description || '按时间与重要程度排序。标注「简历项目」的作品，可与简历逐条对照。' }}</p>

    <WorkList :projects="shown" />
  </div>
</template>

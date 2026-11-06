<!--
  [INPUT]: 依赖 @/content 的 HOME 叙事文案与 PROFILE.resumeUrl；依赖 @/api/public 的 publicApi；
           依赖 ../composables/useChapters；依赖 ../components/WorkList、CosmoContacts 与 ../demos/* 五个演示组件；
           依赖 @/composables/useMeta、@/stores/site
  [OUTPUT]: CosmoHome 页面组件（路由 /）
  [POS]: themes/cosmo/views 的首页。结构仿 cosmo-ai.cn 的分章滚动：
         序章（姓名与命题）→ 五条产品原则（各配一件作品的真实演示，第 04 章入夜）→ 精选作品 → 结语。
         章节位置与动效全部由样式中的 --p / --in 驱动，组件只把离散进度交给演示组件。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { HOME, PROFILE } from '@/content'
import { publicApi } from '@/api/public'
import type { Project } from '@/types'
import { useMeta } from '@/composables/useMeta'
import { useSiteStore } from '@/stores/site'
import { scrollToY } from '@/utils/smoothScroll'
import { useChapters } from '../composables/useChapters'
import WorkList from '../components/WorkList.vue'
import CosmoContacts from '../components/CosmoContacts.vue'
import DialogueDemo from '../demos/DialogueDemo.vue'
import LeaderboardDemo from '../demos/LeaderboardDemo.vue'
import DraftDemo from '../demos/DraftDemo.vue'
import SearchDemo from '../demos/SearchDemo.vue'
import LoopDemo from '../demos/LoopDemo.vue'

const site = useSiteStore()
const root = ref<HTMLElement | null>(null)
const featured = ref<Project[]>([])
const total = ref(0)
const { progress, refresh } = useChapters(root)
const p = (key: string) => progress[key] ?? 0
const mail = computed(() => (site.settings.email ? `mailto:${site.settings.email}` : '/about'))

function jumpTo(id: string) {
  const target = document.getElementById(id)
  if (target) scrollToY(target.getBoundingClientRect().top + window.scrollY, 1400)
}

onMounted(async () => {
  const [picked, all] = await Promise.all([
    publicApi.projects({ featured: true, page_size: Number(site.settings.featured_project_count) || 6 }),
    publicApi.projects({ page_size: 1 }),
  ])
  featured.value = picked.items
  total.value = all.pagination.total
  requestAnimationFrame(refresh)
})

useMeta({
  title: () => String(site.settings.default_seo_title || site.settings.site_name || '作品集'),
  description: () => String(site.settings.default_seo_description || site.settings.bio || ''),
})
</script>

<template>
  <div ref="root" class="cz-home">
    <!-- 序 · 姓名与命题 -->
    <section class="cz-ch cz-ch--hero" data-ch="hero" style="--len: 170">
      <div class="cz-pin">
        <div class="cz-copy">
          <p class="cz-eyebrow">{{ HOME.hero.eyebrow }}</p>
          <h1 class="cz-serif cz-display"><span v-for="line in HOME.hero.title" :key="line" class="cz-line">{{ line }}</span></h1>
          <p class="cz-lead"><template v-for="(line, index) in HOME.hero.lead" :key="line">{{ line }}<br v-if="index < HOME.hero.lead.length - 1" /></template></p>
          <div class="cz-actions">
            <a class="cz-cta" href="#works" @click.prevent="jumpTo('works')">{{ HOME.hero.primary }}</a>
            <a class="cz-ghost" :href="PROFILE.resumeUrl" target="_blank" rel="noopener">{{ HOME.hero.secondary }}</a>
          </div>
        </div>
        <div class="cz-cue" aria-hidden="true"><span />向下滚动</div>
      </div>
    </section>

    <!-- 01 · 定问题 -->
    <section class="cz-ch cz-ch--question" data-ch="question" style="--len: 260">
      <div class="cz-pin">
        <div class="cz-copy">
          <p class="cz-index">{{ HOME.question.index }}</p>
          <h2 class="cz-serif"><span v-for="line in HOME.question.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <p v-for="line in HOME.question.body" :key="line">{{ line }}</p>
          <RouterLink class="cz-more" :to="`/projects/${HOME.question.work}`">读案例 · {{ HOME.question.meta }}</RouterLink>
        </div>
        <DialogueDemo class="cz-demo" :p="p('question')" />
      </div>
    </section>

    <!-- 02 · 立标准 -->
    <section class="cz-ch cz-ch--standard" data-ch="standard" style="--len: 260">
      <div class="cz-pin">
        <div class="cz-copy">
          <p class="cz-index">{{ HOME.standard.index }}</p>
          <h2 class="cz-serif"><span v-for="line in HOME.standard.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <p v-for="line in HOME.standard.body" :key="line">{{ line }}</p>
          <p class="cz-meta">{{ HOME.standard.meta }}</p>
          <RouterLink class="cz-more" :to="`/projects/${HOME.standard.work}`">读案例</RouterLink>
        </div>
        <LeaderboardDemo class="cz-demo" :p="p('standard')" />
      </div>
    </section>

    <!-- 03 · 留给人 -->
    <section class="cz-ch cz-ch--human" data-ch="human" style="--len: 260">
      <div class="cz-pin">
        <DraftDemo class="cz-demo" :p="p('human')" />
        <div class="cz-copy">
          <p class="cz-index">{{ HOME.human.index }}</p>
          <h2 class="cz-serif"><span v-for="line in HOME.human.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <p v-for="line in HOME.human.body" :key="line">{{ line }}</p>
          <p class="cz-meta">{{ HOME.human.meta }}</p>
          <RouterLink class="cz-more" :to="`/projects/${HOME.human.work}`">读案例</RouterLink>
        </div>
      </div>
    </section>

    <!-- 04 · 有出处（入夜） -->
    <section class="cz-ch cz-ch--evidence" data-ch="evidence" data-night style="--len: 300">
      <div class="cz-pin">
        <div class="cz-copy">
          <p class="cz-index">{{ HOME.evidence.index }}</p>
          <h2 class="cz-serif"><span v-for="line in HOME.evidence.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <p v-for="line in HOME.evidence.body" :key="line">{{ line }}</p>
        </div>
        <SearchDemo :p="p('evidence')" :total="total" />
        <ul class="cz-features"><li v-for="item in HOME.evidence.features" :key="item">{{ item }}</li></ul>
      </div>
    </section>

    <!-- 05 · 回流 -->
    <section class="cz-ch cz-ch--loop" data-ch="loop" style="--len: 240">
      <div class="cz-pin">
        <div class="cz-copy">
          <p class="cz-index">{{ HOME.loop.index }}</p>
          <h2 class="cz-serif"><span v-for="line in HOME.loop.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <p v-for="line in HOME.loop.body" :key="line">{{ line }}</p>
          <p class="cz-meta">{{ HOME.loop.meta }}</p>
          <RouterLink class="cz-more" :to="`/projects/${HOME.loop.work}`">读案例</RouterLink>
        </div>
        <LoopDemo class="cz-demo" :p="p('loop')" />
      </div>
    </section>

    <!-- 06 · 精选作品 -->
    <section id="works" class="cz-works">
      <header class="cz-works__head">
        <p class="cz-index">{{ HOME.works.eyebrow }}</p>
        <h2 class="cz-serif">{{ HOME.works.title }}</h2>
        <p>{{ HOME.works.lead }}</p>
      </header>
      <WorkList :projects="featured" />
      <RouterLink class="cz-more cz-works__all" to="/projects">{{ HOME.works.all }}（{{ total }}）→</RouterLink>
    </section>

    <!-- 结语 -->
    <section class="cz-ch cz-ch--end" data-ch="end" style="--len: 150">
      <div class="cz-pin">
        <div class="cz-copy">
          <h2 class="cz-serif cz-display-sm"><span v-for="line in HOME.end.title" :key="line" class="cz-line">{{ line }}</span></h2>
          <a class="cz-cta" :href="mail">{{ HOME.end.cta }}</a>
          <CosmoContacts />
          <p class="cz-meta">{{ HOME.end.meta }}</p>
          <RouterLink class="cz-more" to="/about">{{ HOME.end.more }}</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

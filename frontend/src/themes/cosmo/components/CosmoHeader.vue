<!--
  [INPUT]: 依赖 vue-router 的 useRoute；依赖 @/stores/site 的站点设置；依赖 @/content 的 PROFILE.resumeUrl
  [OUTPUT]: CosmoHeader 组件（固定页眉）
  [POS]: themes/cosmo/components 的导航层，由 CosmoLayout 挂载。
         首页保持透明，让星空与标题直接相接；其余页面滚动后加纸色渐变底，避免正文从文字下穿过。
         夜幕章节中颜色由 :root.is-night 反转，组件本身不感知夜幕。
         滚到页面底部时淡出：结语与页脚已有导航，固定页眉不该压住最后一段标题。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteStore } from '@/stores/site'
import { PROFILE } from '@/content'

const route = useRoute()
const site = useSiteStore()
const scrolled = ref(false)
const atBottom = ref(false)
const name = computed(() => site.settings.person_name || '作品集')
const mail = computed(() => (site.settings.email ? `mailto:${site.settings.email}` : '/about'))
const solid = computed(() => route.path !== '/' && scrolled.value)

function sync() {
  scrolled.value = window.scrollY > 12
  atBottom.value = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 48
}
onMounted(() => { sync(); window.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync, { passive: true }) })
onBeforeUnmount(() => { window.removeEventListener('scroll', sync); window.removeEventListener('resize', sync) })
</script>

<template>
  <header class="cz-top" :class="{ 'is-solid': solid, 'is-hidden': atBottom }">
    <RouterLink class="cz-brand" to="/" :aria-label="`${name} 首页`">
      <span class="cz-brand__mark" aria-hidden="true">{{ name.slice(0, 1) }}</span>
      <span>{{ name }}</span>
    </RouterLink>
    <nav aria-label="主导航">
      <RouterLink class="cz-top__keep" to="/projects">作品</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
      <a :href="PROFILE.resumeUrl" target="_blank" rel="noopener">简历</a>
      <a class="cz-top__contact cz-top__keep" :href="mail">联系</a>
    </nav>
  </header>
</template>

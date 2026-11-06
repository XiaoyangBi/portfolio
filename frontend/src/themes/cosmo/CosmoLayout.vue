<!--
  [INPUT]: 依赖 ./index 的主题样式；依赖 ./components 的 CosmoHeader、CosmoFooter、StarStage；依赖 @/utils/smoothScroll 的惯性滚动；
           依赖 @/stores/site 与 @/api/public 的公开数据
  [OUTPUT]: CosmoLayout 组件（公开端外壳）
  [POS]: themes/cosmo 的根布局，router 把全部公开路由挂在它下面。
         它负责三件事：声明 data-surface='cosmo' 让主题样式生效；挂载夜幕与星空背景；复用 evidentfolio 的惯性滚动。
         星系行星数等于公开作品数，因此星空本身也是作品集的一部分。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import './index'
import CosmoHeader from './components/CosmoHeader.vue'
import CosmoFooter from './components/CosmoFooter.vue'
import StarStage from './components/StarStage.vue'
import { installSmoothScroll } from '@/utils/smoothScroll'
import { useSiteStore } from '@/stores/site'
import { publicApi } from '@/api/public'

const site = useSiteStore()
const bodies = ref(18)
let uninstall: (() => void) | undefined

onMounted(() => {
  document.documentElement.dataset.surface = 'cosmo'
  uninstall = installSmoothScroll()
  site.load().catch(() => undefined)
  publicApi.projects({ page_size: 1 }).then((result) => { bodies.value = result.pagination.total || bodies.value }).catch(() => undefined)
})
onBeforeUnmount(() => {
  uninstall?.()
  delete document.documentElement.dataset.surface
})
</script>

<template>
  <div class="cz-shell">
    <div class="cz-night" aria-hidden="true" />
    <StarStage :key="bodies" :bodies="bodies" />
    <CosmoHeader />
    <main id="main-content" class="cz-main">
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </RouterView>
    </main>
    <CosmoFooter />
  </div>
</template>

<!--
  [INPUT]: 依赖 @/stores/site 的站点设置；依赖 @/content 的 PROFILE.resumeUrl
  [OUTPUT]: CosmoFooter 组件
  [POS]: themes/cosmo/components 的页脚，由 CosmoLayout 挂载。左侧导航与出处声明，右侧联系方式。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '@/stores/site'
import { PROFILE } from '@/content'

const site = useSiteStore()
const settings = computed(() => site.settings)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="cz-foot">
    <div class="cz-foot__main">
      <nav aria-label="页脚导航">
        <RouterLink to="/projects">全部作品</RouterLink>
        <RouterLink to="/about">关于我</RouterLink>
        <a :href="PROFILE.resumeUrl" target="_blank" rel="noopener">简历 PDF</a>
        <a v-if="settings.github_url" :href="settings.github_url" target="_blank" rel="noopener">GitHub</a>
      </nav>
      <p>© {{ year }} {{ settings.person_name }} · {{ settings.footer_text }}</p>
    </div>
    <div v-if="settings.email" class="cz-foot__contact">
      <strong>联系我</strong>
      <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
    </div>
  </footer>
</template>

<!--
  [INPUT]: 依赖 @/composables/useMeta
  [OUTPUT]: CosmoNotFound 页面组件（cosmo 路由的 catch-all）
  [POS]: themes/cosmo/views 的 404。与 CosmoCase 的「作品不存在」共用 .cz-empty 版式。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'

useMeta({ title: '页面不存在', description: '' })
</script>

<template>
  <section class="cz-doc cz-empty">
    <p class="cz-eyebrow">404</p>
    <h1 class="cz-serif">这里什么也没有。</h1>
    <RouterLink class="cz-more" to="/">回到首页</RouterLink>
  </section>
</template>

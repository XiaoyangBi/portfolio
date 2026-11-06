<!--
  [INPUT]: 依赖 @/content 的 HOME.standard（五模型主榜）
  [OUTPUT]: LeaderboardDemo 组件，props.p 为章节进度 0..1
  [POS]: themes/cosmo/demos 的成员，首页「02 / 立标准」的演示。
         版式沿用 cosmo-ai.cn 的「时间戳 + 字幕」列表：滚动点亮当前行，悬停可预览。
         数值来自 Personal Agent Benchmark README，横线长度与通过率成正比。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { HOME } from '@/content'

const props = defineProps<{ p: number }>()
const rows = HOME.standard.rows
const hovered = ref<number | null>(null)
const active = computed(() => hovered.value ?? Math.min(rows.length - 1, Math.max(0, Math.floor(props.p * rows.length * 1.1))))
const width = (rate: string) => `${(parseFloat(rate) / 60) * 100}%`
</script>

<template>
  <ol class="cz-board" aria-label="五模型单轮通过率">
    <li v-for="(row, index) in rows" :key="row.model" :class="{ 'is-on': index === active }" @mouseenter="hovered = index" @mouseleave="hovered = null">
      <time>{{ row.rank }}</time>
      <span class="cz-serif">{{ row.model }}</span>
      <em>{{ row.rate }}</em>
      <i :style="{ '--w': width(row.rate) }" />
    </li>
  </ol>
</template>

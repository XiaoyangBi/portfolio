<!--
  [INPUT]: 依赖 @/content 的 HOME.evidence（检索词、引文与能力标签）
  [OUTPUT]: SearchDemo 组件，props.p 为章节进度 0..1，props.total 为公开作品数
  [POS]: themes/cosmo/demos 的成员，首页夜间章节「04 / 有出处」的演示。
         复刻 cosmo-ai.cn 的「找得到」：检索框逐字输入，结果数浮现，引文像星星一样散落在夜空里。
         每条引文都是某件作品里真实写下的决定，source 指明出处。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { HOME } from '@/content'

const props = defineProps<{ p: number; total: number }>()
const data = HOME.evidence
const typed = computed(() => data.query.slice(0, Math.max(0, Math.floor(((props.p - 0.04) / 0.12) * data.query.length))))
const found = computed(() => props.p > 0.2)
/** 引文的散布位置：百分比坐标，避开左侧标题区 */
const SPOTS = [
  { x: 52, y: 40 }, { x: 70, y: 52 }, { x: 46, y: 62 }, { x: 64, y: 72 }, { x: 50, y: 82 },
]
const labels = computed(() => data.labels.map((label, index) => {
  const start = 0.26 + index * 0.1
  const t = Math.min(1, Math.max(0, (props.p - start) / 0.12))
  return { ...label, spot: SPOTS[index % SPOTS.length]!, t }
}))
</script>

<template>
  <div class="cz-search" :style="{ '--search-in': Math.min(1, props.p / 0.06) }" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
    <span class="cz-search__typed cz-serif">{{ typed }}</span><span class="cz-search__caret" />
  </div>
  <p class="cz-found" :class="{ 'is-shown': found }" aria-hidden="true">在 {{ total }} 个作品里，找到 {{ data.labels.length }} 条同一类决定</p>
  <div class="cz-labels" aria-label="作品中的取证原则">
    <p v-for="label in labels" :key="label.text" class="cz-label" :style="{ left: `${label.spot.x}%`, top: `${label.spot.y}%`, '--t': label.t }">
      <span class="cz-serif">{{ label.text }}</span>
      <small>{{ label.source }}</small>
    </p>
  </div>
</template>

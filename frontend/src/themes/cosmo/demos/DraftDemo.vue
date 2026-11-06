<!--
  [INPUT]: 依赖 @/content 的 HOME.human（口述原话与草稿字段）
  [OUTPUT]: DraftDemo 组件，props.p 为章节进度 0..1
  [POS]: themes/cosmo/demos 的成员，首页「03 / 留给人」的演示。
         原话 → 字段逐个被 AI 填好 → 「值不值」停在待确认 → 进度末尾由人确认。
         它演示羽省省的分工：AI 整理，人判断。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { HOME } from '@/content'

const props = defineProps<{ p: number }>()
const fields = HOME.human.fields
const filled = computed(() => Math.floor((props.p - 0.12) / 0.14) + 1)
const confirmed = computed(() => props.p > 0.82)
</script>

<template>
  <figure class="cz-draft" aria-label="口述发帖草稿示意">
    <blockquote class="cz-serif">「{{ HOME.human.utterance }}」</blockquote>
    <dl>
      <div v-for="(field, index) in fields" :key="field.label" :class="[`is-${field.state}`, { 'is-shown': index < filled, 'is-confirmed': field.state === 'confirm' && confirmed }]">
        <dt>{{ field.label }}</dt>
        <dd>
          <template v-if="field.state === 'confirm' && confirmed">值 · 已由你确认</template>
          <template v-else>{{ field.value }}</template>
        </dd>
      </div>
    </dl>
    <figcaption :class="{ 'is-ready': confirmed }"><span />{{ confirmed ? '可以发布了' : 'AI 已整理草稿，等你确认' }}</figcaption>
  </figure>
</template>

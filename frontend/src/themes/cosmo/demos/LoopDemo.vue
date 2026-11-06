<!--
  [INPUT]: 依赖 @/content 的 HOME.loop（六环步骤与预测/实际数值）
  [OUTPUT]: LoopDemo 组件，props.p 为章节进度 0..1
  [POS]: themes/cosmo/demos 的成员，首页「05 / 回流」的演示。
         六个环节依次点亮，最后一环弯回第一环；下方读数依次给出预测分、实际曝光与新增的失败模式。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { HOME } from '@/content'

const props = defineProps<{ p: number }>()
const data = HOME.loop
const active = computed(() => Math.min(data.steps.length - 1, Math.max(0, Math.floor(props.p * data.steps.length * 1.05))))
const closed = computed(() => props.p > 0.9)
const readouts = computed(() => [
  { label: '预测分', value: data.predicted, on: props.p > 0.55 },
  { label: '实际曝光', value: data.actual, on: props.p > 0.68 },
  { label: '新增失败模式', value: 'D · 平台调性错配', on: props.p > 0.8 },
])
</script>

<template>
  <div class="cz-loop" aria-label="内容流水线六环回流示意">
    <ol class="cz-loop__steps" :class="{ 'is-closed': closed }">
      <li v-for="(step, index) in data.steps" :key="step" :class="{ 'is-on': index <= active, 'is-head': index === active }">
        <i />
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong class="cz-serif">{{ step }}</strong>
      </li>
    </ol>
    <dl class="cz-loop__readout">
      <div v-for="item in readouts" :key="item.label" :class="{ 'is-on': item.on }">
        <dt>{{ item.label }}</dt>
        <dd class="cz-serif">{{ item.value }}</dd>
      </div>
    </dl>
  </div>
</template>

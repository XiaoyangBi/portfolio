<!--
  [INPUT]: 依赖 @/content 的 HOME.question（对话与配置）
  [OUTPUT]: DialogueDemo 组件，props.p 为章节进度 0..1
  [POS]: themes/cosmo/demos 的成员，首页「01 / 定问题」的演示。
         对话逐句出现，最后收敛成一份结构化配置，复现 InsightFlow 访谈 Agent 的工作方式。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { HOME } from '@/content'

const props = defineProps<{ p: number }>()
const lines = HOME.question.dialogue
const step = 0.15
const shown = computed(() => Math.min(lines.length + 1, Math.floor((props.p - 0.04) / step) + 1))
</script>

<template>
  <div class="cz-dialogue" aria-label="访谈 Agent 示意对话">
    <ol>
      <li v-for="(line, index) in lines" :key="index" :class="{ 'is-shown': index < shown, 'is-last': index === Math.min(shown, lines.length) - 1 }">
        <small>{{ line.who }}</small>
        <span class="cz-serif">{{ line.text }}</span>
      </li>
    </ol>
    <pre class="cz-dialogue__config" :class="{ 'is-shown': shown > lines.length }"><code><i>WorkflowConfig</i>
<template v-for="row in HOME.question.config" :key="row">{{ row }}
</template></code></pre>
  </div>
</template>

<!--
  [INPUT]: 依赖 @/types 的 Project；依赖 ../composables/workLinks 的 badges
  [OUTPUT]: WorkList 组件：编号作品行 + 开源状态徽标 + 跟随指针的封面预览
  [POS]: themes/cosmo/components 的作品列表，首页「精选作品」与作品索引页共用。
         行内只放判断一件作品是否值得点开所需的信息：标题、一句话定位、真实可访问状态、原则、年份、成熟度。
         徽标由 links 派生；没有入口的作品不显示徽标，不编造状态。
         封面预览只在精确指针设备上出现，触屏不显示。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types'
import { badges } from '../composables/workLinks'

defineProps<{ projects: Project[] }>()
const peek = ref<Project | null>(null)
const point = ref({ x: 0, y: 0 })
const fine = window.matchMedia('(pointer: fine)').matches

const pad = (value: number) => String(value).padStart(2, '0')
const year = (project: Project) => project.start_date.slice(0, 4)

function move(event: MouseEvent) { point.value = { x: event.clientX, y: event.clientY } }
</script>

<template>
  <ol class="cz-worklist" @mousemove="move" @mouseleave="peek = null">
    <li v-for="(project, index) in projects" :key="project.uuid">
      <RouterLink class="cz-work" :to="`/projects/${project.uuid}`" @mouseenter="peek = project" @focus="peek = null">
        <span class="cz-work__no cz-mono">{{ pad(index + 1) }}</span>
        <span class="cz-work__body">
          <span class="cz-work__title cz-serif">{{ project.title }}<sup v-if="project.showcase?.origin === 'resume'">简历项目</sup></span>
          <span class="cz-work__sub">{{ project.subtitle }}</span>
          <span v-if="badges(project).length" class="cz-work__badges">
            <span v-for="badge in badges(project)" :key="badge.kind" class="cz-badge" :class="`is-${badge.kind}`">{{ badge.label }}</span>
          </span>
        </span>
        <span class="cz-work__meta cz-mono">
          <span>{{ project.showcase?.principle || project.category?.name }}</span>
          <span>{{ year(project) }}</span>
          <span>{{ project.project_state }}</span>
        </span>
        <span class="cz-work__arrow" aria-hidden="true">→</span>
      </RouterLink>
    </li>
  </ol>
  <div v-if="fine" class="cz-peek" :class="{ 'is-on': peek?.cover_asset }" :style="{ transform: `translate3d(${point.x + 28}px, ${point.y - 90}px, 0)` }" aria-hidden="true">
    <img v-if="peek?.cover_asset" :src="peek.cover_asset.content_url" alt="" />
  </div>
</template>

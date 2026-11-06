<!--
  [INPUT]: 依赖 @/content 的 PROFILE；依赖 @/stores/site 的站点设置（姓名、身份、简介、方向、联系方式）；依赖 @/composables/useMeta
  [OUTPUT]: CosmoAbout 页面组件（路由 /about）
  [POS]: themes/cosmo/views 的关于页。只陈列可核对的事实：教育、经历、荣誉、方向与联系方式。
         经历只写一行，不展开：细节在简历 PDF 里，作品集的主角是作品。
         身份数据来自 site 设置，履历来自 PROFILE；两者分开，后端模式下身份仍可在后台修改。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { computed } from 'vue'
import { PROFILE } from '@/content'
import { useMeta } from '@/composables/useMeta'
import { useSiteStore } from '@/stores/site'

const site = useSiteStore()
const name = computed(() => site.settings.person_name || '')
const contacts = computed(() => site.settings.contact_methods || [])

useMeta({
  title: () => `关于 · ${name.value || '作品集'}`,
  description: () => site.settings.bio || '',
})
</script>

<template>
  <div class="cz-doc cz-about">
    <header class="cz-doc__head">
      <p class="cz-eyebrow">ABOUT</p>
      <h1 class="cz-serif">{{ name }}</h1>
      <p class="cz-about__identity cz-mono">{{ site.settings.current_identity }}</p>
      <p class="cz-doc__lead">{{ site.settings.bio }}</p>
    </header>

    <section v-if="site.settings.research_directions?.length" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">01</span>关注</h2>
      <ul class="cz-part__body cz-tags">
        <li v-for="item in site.settings.research_directions" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">02</span>经历</h2>
      <ol class="cz-part__body cz-rows">
        <li v-for="item in PROFILE.experience" :key="item.org">
          <strong>{{ item.org }}</strong><span>{{ item.role }}</span><time class="cz-mono">{{ item.period }}</time>
        </li>
      </ol>
    </section>

    <section class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">03</span>教育</h2>
      <ol class="cz-part__body cz-rows">
        <li v-for="item in PROFILE.education" :key="item.degree">
          <strong>{{ item.school }}</strong><span>{{ item.degree }}</span><time class="cz-mono">{{ item.period }}</time>
        </li>
      </ol>
    </section>

    <section class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">04</span>荣誉</h2>
      <ol class="cz-part__body cz-rows">
        <li v-for="item in PROFILE.honors" :key="item.name">
          <strong>{{ item.name }}</strong><span>{{ item.note }}</span><time class="cz-mono">{{ item.year }}</time>
        </li>
      </ol>
    </section>

    <section class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">05</span>其他</h2>
      <ul class="cz-part__body cz-ticks">
        <li v-for="item in PROFILE.skills" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section id="contact" class="cz-part">
      <h2 class="cz-part__label"><span class="cz-mono">06</span>联系</h2>
      <div class="cz-part__body">
        <ul class="cz-links">
          <li v-for="item in contacts" :key="item.type">
            <a :href="item.url" :target="item.url.startsWith('http') ? '_blank' : undefined" rel="noopener"><span>{{ item.label }}</span><span class="cz-mono">{{ item.value }}</span>↗</a>
          </li>
          <li>
            <a :href="PROFILE.resumeUrl" target="_blank" rel="noopener"><span>简历</span><span class="cz-mono">PDF</span>↗</a>
          </li>
        </ul>
        <p v-if="site.settings.location" class="cz-part__note">{{ site.settings.location }}</p>
      </div>
    </section>
  </div>
</template>

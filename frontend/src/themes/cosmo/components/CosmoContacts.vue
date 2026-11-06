<!--
  [INPUT]: 依赖 @/content 的 CONTACTS 与 ContactLink；依赖 lucide-vue-next 的五个线性图标
  [OUTPUT]: CosmoContacts 组件：横向联系方式栏
  [POS]: themes/cosmo/components 的联系入口，由 CosmoHome 的结语章节挂载。
         版式与 https://bixiaoyang.pages.dev/ 的社交栏一致：细线图标 + 单色文字，不用品牌色。
         四项有链接，微信没有链接：点击复制微信号，剪贴板不可用时直接显示号码供手动复制。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BookOpen, Eye, Github, Mail, Phone } from 'lucide-vue-next'
import { CONTACTS, type ContactLink } from '@/content'

const icons = { mail: Mail, phone: Phone, github: Github, 'book-open': BookOpen, eye: Eye }
const feedback = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

function reset() { feedback.value = '' }

async function copyValue(item: ContactLink) {
  try {
    await navigator.clipboard.writeText(item.value)
    feedback.value = '已复制'
  } catch {
    feedback.value = `微信号 ${item.value}`
  }
  clearTimeout(timer)
  timer = setTimeout(reset, 2400)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <nav class="cz-contacts" aria-label="联系方式">
    <template v-for="item in CONTACTS" :key="item.type">
      <a
        v-if="item.href"
        :href="item.href"
        :target="item.href.startsWith('http') ? '_blank' : undefined"
        rel="noopener"
        :title="item.value"
      >
        <component :is="icons[item.icon]" :size="16" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </a>
      <button v-else type="button" :title="`点击复制 ${item.value}`" @click="copyValue(item)">
        <component :is="icons[item.icon]" :size="16" aria-hidden="true" />
        <span>{{ feedback || item.label }}</span>
      </button>
    </template>
  </nav>
</template>

/**
 * [INPUT]: 依赖 vue、pinia、./router、./App.vue；依赖 @/api/public 的 IS_STATIC；依赖 ./styles/legacy（仅后端模式）
 * [OUTPUT]: 无导出；挂载应用到 #app
 * [POS]: 前端入口。静态模式只加载 cosmo 主题（主题样式随 CosmoLayout 分块加载）；
 *        后端模式额外加载 evidentfolio 原样式（约 280KB），供 /admin 与 /en 使用。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { IS_STATIC } from './api/public'
import { initializeTheme } from './stores/theme'
import { reveal } from './directives/reveal'
import { scrollProgress } from './directives/scrollProgress'
import { scramble } from './directives/scramble'
import { magnetic } from './directives/magnetic'
import { segment } from './directives/segment'
import { installImageRecovery } from './utils/imageRecovery'
import { protect } from './directives/protect'

function mount() {
  initializeTheme()
  installImageRecovery()
  createApp(App).directive('reveal', reveal).directive('scroll-progress', scrollProgress).directive('scramble', scramble).directive('magnetic', magnetic).directive('segment', segment).directive('protect', protect).use(createPinia()).use(router).mount('#app')
}

if (IS_STATIC) mount()
else void import('./styles/legacy').then(mount)

/**
 * [INPUT]: 依赖 @vitejs/plugin-vue；依赖 BASE_PATH 环境变量（仅 GitHub Pages 项目站点需要）
 * [OUTPUT]: 默认导出 vite 配置
 * [POS]: 构建配置。base 缺省为根路径；部署到 GitHub Pages 项目站点时设 BASE_PATH=/仓库名/，
 *        资源前缀与 vue-router 的 history base 同时生效（router 读 import.meta.env.BASE_URL）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/sitemap.xml': 'http://127.0.0.1:8000',
      '/robots.txt': 'http://127.0.0.1:8000',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          content: ['markdown-it', 'dompurify'],
        },
      },
    },
  },
})

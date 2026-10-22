import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 部署目标区分的 base 路径：
 * - GitHub Pages 部署在 /ink_flow/ 子路径下，构建时需加 DEPLOY_TARGET=github-pages
 * - 本地开发与 Vercel 部署均使用根路径 '/'，保证资源正常加载
 */
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages'

// https://vitejs.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/ink_flow/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      //  @ 指向 src 目录
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    allowedHosts: true,
  },
})

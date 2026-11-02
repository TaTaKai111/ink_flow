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
  // 预构建在「服务启动时」完成，而不是首次访问时才触发，
  // 避免首屏请求被依赖预构建阻塞（表现为长时间卡在加载屏）
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      'axios',
      'dayjs',
      'mockjs',
      'element-plus',
      '@element-plus/icons-vue',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // 用 127.0.0.1 打开，规避部分环境下 localhost 走 IPv6(::1) 或代理导致首屏请求挂起
    open: 'http://127.0.0.1:3000/',
    allowedHosts: true,
  },
})

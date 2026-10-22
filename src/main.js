import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import store from './store'
import './mock' // Mock.js 拦截全部接口（纯前端演示）
import './styles/index.scss'

const app = createApp(App)

// 全局注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn }).use(store).use(router)

app.mount('#app')

// 移除首屏加载屏（带淡出过渡；transitionend 未触发时 600ms 兜底移除）
const splash = document.getElementById('app-splash')
if (splash) {
  clearTimeout(window.__splashTimeout)
  splash.classList.add('is-hide')
  splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  setTimeout(() => splash.remove(), 600)
}

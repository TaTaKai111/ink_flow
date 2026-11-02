import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import store from './store'
import iconMap from '@/utils/icons'
import './mock' // Mock.js 拦截全部接口（纯前端演示）
import './styles/index.scss'

const app = createApp(App)

// 只注册「按名动态渲染」所需的图标，避免全量注册上千个组件拖慢首屏
Object.entries(iconMap).forEach(([name, component]) => {
  app.component(name, component)
})

app.use(ElementPlus, { locale: zhCn }).use(store).use(router)

/** 移除首屏加载屏（transitionend 未触发时 600ms 兜底移除） */
function hideSplash() {
  const splash = document.getElementById('app-splash')
  if (!splash) return
  clearTimeout(window.__splashTimeout)
  clearTimeout(window.__splashForceHide)
  splash.classList.add('is-hide')
  const remove = () => splash.remove()
  splash.addEventListener('transitionend', remove, { once: true })
  setTimeout(remove, 600)
}

let mounted = false
function startApp() {
  if (mounted) return
  mounted = true
  app.mount('#app')
  hideSplash()
}

/**
 * 等首次路由解析完成（含懒加载组件）后再挂载：
 * 否则 mount 时 <router-view> 还是空的，加载屏一消失就是白屏。
 * 无论解析成功或失败都挂载，避免加载屏永久停留。
 */
router.isReady().then(startApp, startApp)

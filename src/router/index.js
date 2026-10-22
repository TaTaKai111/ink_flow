import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import store from '@/store'

/**
 * 路由模式按部署环境自动切换：
 * - 本地开发与 Vercel 部署在根路径（BASE_URL 为 '/'），使用 history 模式，URL 美观（如 /article）
 * - GitHub Pages 部署在 /ink_flow/ 子路径（BASE_URL 不为 '/'），使用 hash 模式，避免刷新子页面 404
 * import.meta.env.BASE_URL 即 vite.config.js 中的 base 值，无需额外维护变量
 */
const routerHistory =
  import.meta.env.BASE_URL === '/' ? createWebHistory() : createWebHashHistory()

/**
 * 路由配置：全部采用懒加载
 * meta.title 用于面包屑与文档标题，meta.icon 对应侧边栏菜单图标
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DataAnalysis' },
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/index.vue'),
        meta: { title: '文章管理', icon: 'Document' },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类管理', icon: 'Folder' },
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/tag/index.vue'),
        meta: { title: '标签管理', icon: 'PriceTag' },
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/comment/index.vue'),
        meta: { title: '评论管理', icon: 'ChatDotRound' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
  // 未匹配路由重定向到仪表盘
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: routerHistory,
  routes,
})

// 路由守卫：未登录跳转登录页，已登录访问登录页则跳首页
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (to.meta.public || to.path === '/login') {
    if (token && to.path === '/login') {
      return next('/')
    }
    return next()
  }
  if (!token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  next()
})

// 根据路由动态设置文档标题
router.afterEach(to => {
  const title = to.meta.title
  document.title = title ? `${title} - InkFlow CMS` : 'InkFlow CMS - 博客内容管理平台'
})

export default router

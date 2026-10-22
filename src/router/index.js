import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

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
  history: createWebHistory(),
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

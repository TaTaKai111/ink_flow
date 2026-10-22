<template>
  <aside class="sidebar">
    <!-- 品牌 Logo 区 -->
    <div class="sidebar-logo">
      <Logo :size="38" from="#ffffff" to="#e3f0fe" />
      <div class="logo-text">
        <h1 class="logo-name">InkFlow CMS</h1>
        <span class="logo-sub">博客内容管理平台</span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      router
      unique-opened
      background-color="transparent"
      text-color="rgba(255, 255, 255, 0.75)"
      active-text-color="#ffffff"
    >
      <el-menu-item v-for="item in menuRoutes" :key="item.path" :index="`/${item.path}`">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span class="menu-title">{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>

    <div class="sidebar-footer">Vue 3 · Element Plus · ECharts</div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './Logo.vue'

const route = useRoute()

// 从路由表提取侧边栏菜单项（布局路由的一级子路由）
const menuRoutes = computed(() => {
  const layoutRoute = route.matched.find(r => r.path === '/')
  return layoutRoute ? layoutRoute.children.filter(child => child.meta && child.meta.title) : []
})

// 当前高亮菜单
const activeMenu = computed(() => route.path)
</script>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  width: 232px;
  height: 100vh;
  background: linear-gradient(160deg, #1a73e8 0%, #0d47a1 62%, #082f66 100%);
  box-shadow: 2px 0 12px rgba(13, 71, 161, 0.25);

  /* Logo 区 */
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .logo-name {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .logo-sub {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.65);
    }
  }

  /* 菜单 */
  .sidebar-menu {
    flex: 1;
    padding: 12px 12px 0;
    overflow-y: auto;
    border-right: none;
    background: transparent;

    :deep(.el-menu-item) {
      height: 46px;
      margin-bottom: 6px;
      border-radius: 8px;
      font-size: 14px;
      transition: background-color 0.25s ease, transform 0.25s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.12);
        transform: translateX(4px);
      }

      &.is-active {
        background-color: rgba(255, 255, 255, 0.22);
        font-weight: 600;
        box-shadow: inset 3px 0 0 #ffffff;
      }

      .el-icon {
        font-size: 18px;
      }
    }

    .menu-title {
      margin-left: 4px;
    }
  }

  /* 底部技术栈说明 */
  .sidebar-footer {
    padding: 14px 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>

<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主区域 -->
    <div class="layout-body">
      <AppHeader @refresh="handleRefresh" />
      <main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="viewKey" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
// 视图重载计数器：点击顶栏刷新按钮时 +1，强制重渲染当前页
const refreshCount = ref(0)
const viewKey = computed(() => `${route.path}?${refreshCount.value}`)

function handleRefresh() {
  refreshCount.value += 1
}
</script>

<style scoped lang="scss">
.layout-body {
  margin-left: 232px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  padding: 20px;
  background-color: var(--ink-bg);
}
</style>

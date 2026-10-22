<template>
  <header class="app-header">
    <!-- 左侧：面包屑 -->
    <div class="header-left">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：刷新 + 用户信息 -->
    <div class="header-right">
      <el-tooltip content="刷新当前页" placement="bottom">
        <el-button class="header-btn" circle size="small" @click="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-tooltip>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <span class="user-avatar">{{ avatarText(nickname) }}</span>
          <span class="user-nickname">{{ nickname }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>个人设置
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ArrowRight, ArrowDown, Refresh, Setting, SwitchButton } from '@element-plus/icons-vue'
import store from '@/store'
import { avatarText } from '@/utils/format'

const emit = defineEmits(['refresh'])
const route = useRoute()
const router = useRouter()

// 当前页面标题（取路由 meta）
const currentTitle = computed(() => route.meta.title || '')

// 博主昵称
const nickname = computed(() => store.state.user.userInfo?.nickname || '博主')

// 通知布局层重载当前视图
function refresh() {
  emit('refresh')
}

// 下拉菜单命令
async function handleCommand(command) {
  if (command === 'settings') {
    router.push('/settings')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出当前登录账号吗？', '退出登录', {
        type: 'warning',
        confirmButtonText: '确认退出',
        cancelButtonText: '取消',
      })
      await store.dispatch('user/logout')
      ElMessage.success('已安全退出')
      router.push('/login')
    } catch {
      // 用户取消退出
    }
  }
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 4px rgba(26, 43, 74, 0.08);

  .header-btn:hover {
    color: var(--el-color-primary);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.25s ease;

    &:hover {
      background-color: #f0f5fd;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #1a73e8, #0d47a1);
      border-radius: 50%;
    }

    .user-nickname {
      font-size: 14px;
      color: var(--ink-text-main);
    }
  }
}
</style>

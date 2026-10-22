<template>
  <div class="login-page">
    <!-- 背景装饰光斑 -->
    <div class="bg-decor bg-decor-1" />
    <div class="bg-decor bg-decor-2" />
    <div class="bg-decor bg-decor-3" />

    <!-- 登录卡片（毛玻璃） -->
    <div class="login-card">
      <div class="login-header">
        <Logo :size="56" />
        <h1 class="login-title">InkFlow CMS</h1>
        <p class="login-subtitle">个人博客内容管理平台</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginRules"
        size="large"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button class="login-btn" type="primary" :loading="loading" round @click="handleLogin">
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>

      <p class="login-tip">演示账号：admin / 123456（任意非空用户名密码也可登录）</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import Logo from '@/layout/components/Logo.vue'
import store from '@/store'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
})

// 表单校验规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 登录提交
async function handleLogin() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  loading.value = true
  try {
    await store.dispatch('user/login', { ...loginForm })
    ElMessage.success('登录成功，欢迎回来！')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (error) {
    // 错误提示已在 axios 响应拦截中统一弹出
    console.error('登录失败：', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 55%, #082f66 100%);
}

/* 背景装饰光斑 */
.bg-decor {
  position: absolute;
  border-radius: 50%;
  opacity: 0.35;
  filter: blur(2px);
  animation: float 8s ease-in-out infinite;
}

.bg-decor-1 {
  top: 12%;
  left: 18%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 70%);
}

.bg-decor-2 {
  right: 14%;
  bottom: 18%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(122, 181, 248, 0.6), transparent 70%);
  animation-delay: 2s;
}

.bg-decor-3 {
  top: 55%;
  left: 8%;
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-24px);
  }
}

/* 登录卡片 */
.login-card {
  position: relative;
  z-index: 1;
  width: 400px;
  padding: 44px 40px 32px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(8, 47, 102, 0.35);
  backdrop-filter: blur(10px);
  animation: card-in 0.5s ease;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;

  .login-title {
    margin: 16px 0 6px;
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .login-subtitle {
    margin: 0 0 28px;
    font-size: 14px;
    color: var(--ink-text-sub);
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 4px 12px;
  }
}

.login-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(26, 115, 232, 0.4);
    transform: translateY(-2px);
  }
}

.login-tip {
  margin: 20px 0 0;
  font-size: 12px;
  color: var(--ink-text-light);
  text-align: center;
}
</style>

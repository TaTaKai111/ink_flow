<template>
  <div class="settings-page page-container">
    <PageHeader title="系统设置" description="配置站点信息、博主资料与功能开关">
      <el-button type="primary" :icon="Check" :loading="saving" @click="handleSave">保存设置</el-button>
    </PageHeader>

    <div v-loading="loading" class="settings-grid">
      <!-- 站点设置 -->
      <div class="ink-card settings-card">
        <h3 class="card-title">站点设置</h3>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="88px">
          <el-form-item label="站点 Logo">
            <el-upload
              class="logo-uploader"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleLogoChange"
            >
              <img v-if="form.siteLogo" :src="form.siteLogo" class="upload-preview" alt="站点 Logo" />
              <div v-else class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传 Logo</span>
              </div>
            </el-upload>
            <el-button v-if="form.siteLogo" link type="danger" @click="form.siteLogo = ''">
              移除
            </el-button>
          </el-form-item>
          <el-form-item label="站点名称" prop="siteName">
            <el-input v-model="form.siteName" placeholder="请输入站点名称" maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="站点描述" prop="siteDescription">
            <el-input
              v-model="form.siteDescription"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入站点描述"
              maxlength="120"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 博主信息 -->
      <div class="ink-card settings-card">
        <h3 class="card-title">博主信息</h3>
        <el-form label-width="88px">
          <el-form-item label="博主头像">
            <el-upload
              class="avatar-uploader"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleAvatarChange"
            >
              <img v-if="form.bloggerAvatar" :src="form.bloggerAvatar" class="avatar-preview" alt="博主头像" />
              <div v-else class="avatar-placeholder">
                <el-icon><Plus /></el-icon>
              </div>
            </el-upload>
            <el-button v-if="form.bloggerAvatar" link type="danger" @click="form.bloggerAvatar = ''">
              移除
            </el-button>
          </el-form-item>
          <el-form-item label="博主昵称">
            <el-input v-model="form.bloggerNickname" placeholder="请输入博主昵称" maxlength="15" show-word-limit />
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input
              v-model="form.bloggerBio"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入个人简介"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 功能开关 -->
      <div class="ink-card settings-card switch-card">
        <h3 class="card-title">功能开关</h3>
        <div class="switch-row">
          <div class="switch-text">
            <p class="switch-name">开启评论</p>
            <span class="switch-desc">关闭后访客将无法在文章下方发表评论</span>
          </div>
          <el-switch v-model="form.commentEnabled" />
        </div>
        <el-divider />
        <div class="switch-row">
          <div class="switch-text">
            <p class="switch-name">开启注册</p>
            <span class="switch-desc">开启后允许新访客注册成为博客用户</span>
          </div>
          <el-switch v-model="form.registerEnabled" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Plus } from '@element-plus/icons-vue'
import { getSettings, updateSettings } from '@/api/settings'
import store from '@/store'
import PageHeader from '@/components/PageHeader.vue'

const loading = ref(true)
const saving = ref(false)
const formRef = ref()

// 设置表单
const form = reactive({
  siteName: '',
  siteDescription: '',
  siteLogo: '',
  bloggerNickname: '',
  bloggerAvatar: '',
  bloggerBio: '',
  commentEnabled: true,
  registerEnabled: false,
})

// 校验规则：站点名称必填
const rules = {
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
}

// 读取本地图片文件并转为 base64 预览（纯前端演示，无真实上传）
function readImageAsDataURL(file, callback) {
  const reader = new FileReader()
  reader.onload = event => callback(event.target.result)
  reader.readAsDataURL(file)
}

// Logo 选择
function handleLogoChange(file) {
  if (!file || !file.raw) return
  readImageAsDataURL(file.raw, dataUrl => {
    form.siteLogo = dataUrl
  })
}

// 头像选择
function handleAvatarChange(file) {
  if (!file || !file.raw) return
  readImageAsDataURL(file.raw, dataUrl => {
    form.bloggerAvatar = dataUrl
  })
}

// 加载设置
async function loadSettings() {
  loading.value = true
  try {
    const res = await getSettings()
    Object.assign(form, res.data)
  } catch (error) {
    console.error('系统设置加载失败：', error)
  } finally {
    loading.value = false
  }
}

// 保存设置
async function handleSave() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    await updateSettings({ ...form })
    ElMessage.success('设置保存成功')
    // 昵称变更时同步顶栏展示
    const userInfo = store.state.user.userInfo
    if (userInfo && userInfo.nickname !== form.bloggerNickname) {
      store.commit('user/SET_USER_INFO', { ...userInfo, nickname: form.bloggerNickname })
    }
  } catch (error) {
    console.error('设置保存失败：', error)
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<style scoped lang="scss">
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.settings-card {
  .card-title {
    margin: 0 0 18px;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink-text-main);

    &::before {
      display: inline-block;
      width: 4px;
      height: 14px;
      margin-right: 8px;
      background: linear-gradient(180deg, #1a73e8, #0d47a1);
      border-radius: 2px;
      content: '';
      vertical-align: -1px;
    }
  }
}

/* 开关卡片跨两列 */
.switch-card {
  grid-column: span 2;

  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;

    .switch-name {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--ink-text-main);
    }

    .switch-desc {
      font-size: 12px;
      color: var(--ink-text-light);
    }
  }

  :deep(.el-divider) {
    margin: 14px 0;
  }
}

/* Logo 上传 */
.logo-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d3dce6;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.25s ease;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .upload-preview {
    display: block;
    width: 120px;
    height: 44px;
    object-fit: contain;
    border-radius: 6px;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 44px;
    font-size: 12px;
    color: var(--ink-text-light);

    .el-icon {
      font-size: 16px;
    }
  }
}

/* 头像上传 */
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d3dce6;
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.25s ease;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .avatar-preview {
    display: block;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    font-size: 20px;
    color: var(--ink-text-light);
  }
}
</style>

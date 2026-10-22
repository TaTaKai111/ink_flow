<template>
  <div class="tag-page page-container">
    <PageHeader title="标签管理" description="管理博客文章标签，支持自定义标签颜色">
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增标签</el-button>
    </PageHeader>

    <div class="ink-card table-card">
      <!-- 搜索区 -->
      <div class="search-bar">
        <el-input
          v-model="query.name"
          placeholder="搜索标签名称"
          :prefix-icon="Search"
          clearable
          style="width: 240px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <!-- 标签表格 -->
      <el-table v-loading="loading" :data="tagList" stripe border>
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column label="标签名称" min-width="180">
          <template #default="{ row }">
            <span class="tag-dot" :style="{ backgroundColor: row.color }" />
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column label="颜色标记" width="140" align="center">
          <template #default="{ row }">
            <el-tag :color="row.color" effect="dark" class="color-tag">{{ row.color }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="articleCount" label="关联文章数" width="140" align="center" sortable />
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑标签' : '新增标签'"
      width="460px"
      @closed="handleClosed"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" maxlength="15" show-word-limit />
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <div class="color-picker-row">
            <el-color-picker v-model="form.color" />
            <el-input v-model="form.color" placeholder="如 #1a73e8" style="width: 160px" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { getTags, createTag, updateTag, deleteTag } from '@/api/tag'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'

// ---------- 列表数据与查询 ----------
const loading = ref(false)
const tagList = ref([])
const query = reactive({ name: '' })

// ---------- 弹窗状态 ----------
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const formRef = ref()

const emptyForm = () => ({ name: '', color: '#1a73e8' })
const form = reactive(emptyForm())
const rules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  color: [{ required: true, message: '请选择标签颜色', trigger: 'change' }],
}

// 加载标签列表（前端按名称过滤）
async function loadTags() {
  loading.value = true
  try {
    const res = await getTags()
    tagList.value = res.data.filter(item => !query.name || item.name.includes(query.name))
  } catch (error) {
    console.error('标签列表加载失败：', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  loadTags()
}

function handleReset() {
  query.name = ''
  loadTags()
}

// 打开新增弹窗
function openCreateDialog() {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, emptyForm())
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 打开编辑弹窗
function openEditDialog(row) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, { name: row.name, color: row.color })
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 关闭后重置表单
function handleClosed() {
  formRef.value?.resetFields()
  Object.assign(form, emptyForm())
}

// 提交（新增 / 编辑）
async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateTag(editingId.value, { ...form })
      ElMessage.success('标签更新成功')
    } else {
      await createTag({ ...form })
      ElMessage.success('标签新增成功')
    }
    dialogVisible.value = false
    loadTags()
  } catch (error) {
    console.error('标签保存失败：', error)
  } finally {
    submitting.value = false
  }
}

// 删除标签（二次确认）
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确认删除标签「${row.name}」吗？该标签关联的 ${row.articleCount} 篇文章将移除该标签。`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
      },
    )
    await deleteTag(row.id)
    ElMessage.success('标签删除成功')
    loadTags()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除标签失败：', error)
    }
  }
}

onMounted(loadTags)
</script>

<style scoped lang="scss">
.table-card {
  padding: 20px 20px 0;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.tag-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
  vertical-align: -1px;
}

.color-tag {
  border: none;
  border-radius: 10px;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

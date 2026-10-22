<template>
  <div class="category-page page-container">
    <PageHeader title="分类管理" description="管理博客文章分类，分类下存在文章时不可删除">
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增分类</el-button>
    </PageHeader>

    <div class="ink-card table-card">
      <!-- 搜索区 -->
      <div class="search-bar">
        <el-input
          v-model="query.name"
          placeholder="搜索分类名称"
          :prefix-icon="Search"
          clearable
          style="width: 240px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <!-- 分类表格 -->
      <el-table v-loading="loading" :data="categoryList" stripe border>
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="articleCount" label="文章数量" width="140" align="center" sortable />
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
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="460px"
      @closed="handleClosed"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="20" show-word-limit />
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
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/category'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'

// ---------- 列表数据与查询 ----------
const loading = ref(false)
const categoryList = ref([])
const query = reactive({ name: '' })

// ---------- 弹窗状态 ----------
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const emptyForm = () => ({ name: '' })
const form = reactive(emptyForm())
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}
const formRef = ref()

// 加载分类列表（前端按名称过滤）
async function loadCategories() {
  loading.value = true
  try {
    const res = await getCategories()
    categoryList.value = res.data.filter(item => !query.name || item.name.includes(query.name))
  } catch (error) {
    console.error('分类列表加载失败：', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  loadCategories()
}

function handleReset() {
  query.name = ''
  loadCategories()
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
  Object.assign(form, { name: row.name })
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
      await updateCategory(editingId.value, { ...form })
      ElMessage.success('分类更新成功')
    } else {
      await createCategory({ ...form })
      ElMessage.success('分类新增成功')
    }
    dialogVisible.value = false
    loadCategories()
  } catch (error) {
    console.error('分类保存失败：', error)
  } finally {
    submitting.value = false
  }
}

// 删除分类（二次确认）
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确认删除分类「${row.name}」吗？该分类下的 ${row.articleCount} 篇文章将失去分类。`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
      },
    )
    await deleteCategory(row.id)
    ElMessage.success('分类删除成功')
    loadCategories()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败：', error)
    }
  }
}

onMounted(loadCategories)
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
</style>

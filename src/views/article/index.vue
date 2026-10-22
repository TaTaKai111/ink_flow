<template>
  <div class="article-page page-container">
    <PageHeader title="文章管理" description="管理博客全部文章，支持发布、编辑与删除">
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增文章</el-button>
    </PageHeader>

    <div class="ink-card table-card">
      <!-- 搜索筛选区 -->
      <div class="search-bar">
        <el-input
          v-model="query.title"
          placeholder="搜索文章标题"
          :prefix-icon="Search"
          clearable
          style="width: 240px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="query.categoryId"
          placeholder="全部分类"
          clearable
          style="width: 160px"
          @change="handleSearch"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
        <el-select
          v-model="query.status"
          placeholder="全部状态"
          clearable
          style="width: 140px"
          @change="handleSearch"
        >
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <!-- 文章表格 -->
      <el-table
        v-loading="loading"
        :data="articleList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="分类" width="110" align="center">
          <template #default="{ row }">
            {{ categoryName(row.categoryId) }}
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="180">
          <template #default="{ row }">
            <el-tag
              v-for="tagId in row.tagIds"
              :key="tagId"
              size="small"
              effect="light"
              class="article-tag"
              :style="tagStyle(tagId)"
            >
              {{ tagName(tagId) }}
            </el-tag>
            <span v-if="!row.tagIds.length" class="no-tag">未设置标签</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="light">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="90" align="right" sortable />
        <el-table-column label="创建时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 'published' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'published' ? '下线' : '发布' }}
            </el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="loadArticles"
          @current-change="loadArticles"
        />
      </div>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <ArticleFormDialog
      v-model:visible="dialogVisible"
      :article="currentArticle"
      :categories="categories"
      :tags="tags"
      @saved="loadArticles"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { getArticles, deleteArticle, toggleArticleStatus } from '@/api/article'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import ArticleFormDialog from './ArticleFormDialog.vue'

// ---------- 列表数据与查询条件 ----------
const loading = ref(false)
const articleList = ref([])
const total = ref(0)
const categories = ref([])
const tags = ref([])

const query = reactive({
  title: '',
  categoryId: '',
  status: '',
  page: 1,
  pageSize: 10,
})

// ---------- 弹窗状态 ----------
const dialogVisible = ref(false)
const currentArticle = ref(null)

// 分类 / 标签名称映射
function categoryName(id) {
  return categories.value.find(item => item.id === id)?.name || '-'
}

function tagName(id) {
  return tags.value.find(item => item.id === id)?.name || '-'
}

// 标签彩色样式
function tagStyle(id) {
  const color = tags.value.find(item => item.id === id)?.color || '#1a73e8'
  return {
    color,
    backgroundColor: `${color}1a`,
    borderColor: `${color}4d`,
  }
}

// 加载分类与标签选项
async function loadOptions() {
  const [categoryRes, tagRes] = await Promise.all([getCategories(), getTags()])
  categories.value = categoryRes.data
  tags.value = tagRes.data
}

// 加载文章列表
async function loadArticles() {
  loading.value = true
  try {
    const res = await getArticles({ ...query })
    articleList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('文章列表加载失败：', error)
  } finally {
    loading.value = false
  }
}

// 查询（重置到第一页）
function handleSearch() {
  query.page = 1
  loadArticles()
}

// 重置筛选条件
function handleReset() {
  Object.assign(query, { title: '', categoryId: '', status: '', page: 1, pageSize: 10 })
  loadArticles()
}

// 打开新增弹窗
function openCreateDialog() {
  currentArticle.value = null
  dialogVisible.value = true
}

// 打开编辑弹窗
function openEditDialog(row) {
  currentArticle.value = row
  dialogVisible.value = true
}

// 切换发布状态
async function handleToggleStatus(row) {
  const nextStatus = row.status === 'published' ? 'draft' : 'published'
  const actionText = nextStatus === 'published' ? '发布' : '下线'
  try {
    await ElMessageBox.confirm(`确认${actionText}文章《${row.title}》吗？`, '状态变更', {
      type: 'warning',
      confirmButtonText: `确认${actionText}`,
      cancelButtonText: '取消',
    })
    await toggleArticleStatus(row.id, nextStatus)
    ElMessage.success(`文章已${actionText}`)
    loadArticles()
  } catch (error) {
    // 用户取消或请求失败
    if (error !== 'cancel') {
      console.error('状态切换失败：', error)
    }
  }
}

// 删除文章（二次确认）
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除文章《${row.title}》吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
    })
    await deleteArticle(row.id)
    ElMessage.success('文章删除成功')
    // 删除后当前页可能为空，回退一页
    if (articleList.value.length === 1 && query.page > 1) {
      query.page -= 1
    }
    loadArticles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败：', error)
    }
  }
}

onMounted(async () => {
  await loadOptions()
  loadArticles()
})
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

.article-tag {
  margin-right: 6px;
  border-radius: 10px;
}

.no-tag {
  font-size: 12px;
  color: var(--ink-text-light);
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>

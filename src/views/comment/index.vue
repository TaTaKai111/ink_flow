<template>
  <div class="comment-page page-container">
    <PageHeader title="评论管理" description="审核与管理访客评论，支持按状态筛选" />

    <div class="ink-card table-card">
      <!-- 筛选区 -->
      <div class="search-bar">
        <el-select
          v-model="query.status"
          placeholder="全部状态"
          clearable
          style="width: 160px"
          @change="handleSearch"
        >
          <el-option label="待审核" value="pending" />
          <el-option label="已审核" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-input
          v-model="query.nickname"
          placeholder="搜索评论者昵称"
          :prefix-icon="Search"
          clearable
          style="width: 220px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <!-- 评论表格 -->
      <el-table v-loading="loading" :data="commentList" stripe border>
        <el-table-column label="评论者" width="140" align="center">
          <template #default="{ row }">
            <div class="commenter">
              <span class="commenter-avatar">{{ avatarText(row.nickname) }}</span>
              <span class="commenter-name">{{ row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" min-width="240">
          <template #default="{ row }">
            <el-tooltip :content="row.content" placement="top" :show-after="300">
              <span class="comment-content">{{ ellipsis(row.content, 40) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="所属文章" min-width="180">
          <template #default="{ row }">
            <span class="article-title">{{ ellipsis(row.articleTitle, 18) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status].type" effect="light">
              {{ statusMap[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status !== 'approved'">
              <el-button link type="success" :icon="Check" @click="handleAudit(row, 'approved')">
                通过
              </el-button>
            </template>
            <template v-if="row.status !== 'rejected'">
              <el-button link type="warning" :icon="Close" @click="handleAudit(row, 'rejected')">
                拒绝
              </el-button>
            </template>
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
          @size-change="loadComments"
          @current-change="loadComments"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search, Refresh, Check, Close, Delete } from '@element-plus/icons-vue'
import { getComments, auditComment, deleteComment } from '@/api/comment'
import { formatDate, ellipsis, avatarText } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'

// ---------- 列表数据与查询 ----------
const loading = ref(false)
const commentList = ref([])
const total = ref(0)

const query = reactive({
  status: '',
  nickname: '',
  page: 1,
  pageSize: 10,
})

// 评论状态映射
const statusMap = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已审核', type: 'success' },
  rejected: { label: '已拒绝', type: 'danger' },
}

// 加载评论列表
async function loadComments() {
  loading.value = true
  try {
    const res = await getComments({ ...query })
    commentList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('评论列表加载失败：', error)
  } finally {
    loading.value = false
  }
}

// 查询（重置到第一页）
function handleSearch() {
  query.page = 1
  loadComments()
}

// 重置筛选条件
function handleReset() {
  Object.assign(query, { status: '', nickname: '', page: 1, pageSize: 10 })
  loadComments()
}

// 审核（通过 / 拒绝）
async function handleAudit(row, status) {
  const actionText = status === 'approved' ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确认${actionText}这条评论吗？`, '审核确认', {
      type: 'warning',
      confirmButtonText: `确认${actionText}`,
      cancelButtonText: '取消',
    })
    await auditComment(row.id, status)
    ElMessage.success(`评论审核已${actionText}`)
    loadComments()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('评论审核失败：', error)
    }
  }
}

// 删除评论（二次确认）
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确认删除这条评论吗？删除后不可恢复。', '删除确认', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
    })
    await deleteComment(row.id)
    ElMessage.success('评论删除成功')
    // 删除后当前页可能为空，回退一页
    if (commentList.value.length === 1 && query.page > 1) {
      query.page -= 1
    }
    loadComments()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败：', error)
    }
  }
}

onMounted(loadComments)
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

.commenter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .commenter-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    border-radius: 50%;
  }

  .commenter-name {
    font-size: 13px;
    color: var(--ink-text-main);
  }
}

.comment-content,
.article-title {
  font-size: 13px;
  color: var(--ink-text-sub);
  cursor: default;
}

.article-title {
  color: var(--el-color-primary);
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>

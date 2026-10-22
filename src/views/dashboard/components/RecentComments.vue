<template>
  <!-- 最近评论列表 -->
  <ul class="recent-comments">
    <li v-for="comment in list" :key="comment.id" class="comment-item">
      <span class="comment-avatar">{{ avatarText(comment.nickname) }}</span>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-nickname">{{ comment.nickname }}</span>
          <el-tag :type="statusMap[comment.status].type" size="small" effect="light">
            {{ statusMap[comment.status].label }}
          </el-tag>
          <span class="comment-time">{{ formatDate(comment.createdAt, 'MM-DD HH:mm') }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <span class="comment-article">评论于《{{ comment.articleTitle }}》</span>
      </div>
    </li>
    <li v-if="!list.length" class="comment-empty">暂无评论数据</li>
  </ul>
</template>

<script setup>
import { formatDate, avatarText } from '@/utils/format'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

// 评论状态映射
const statusMap = {
  approved: { label: '已审核', type: 'success' },
  pending: { label: '待审核', type: 'warning' },
  rejected: { label: '已拒绝', type: 'danger' },
}
</script>

<style scoped lang="scss">
.recent-comments {
  margin: 0;
  padding: 0;
  list-style: none;

  .comment-item {
    display: flex;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px dashed #ebeef5;
    transition: background-color 0.25s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8fafd;
      border-radius: 8px;
    }

    .comment-avatar {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #1a73e8, #0d47a1);
      border-radius: 50%;
    }

    .comment-body {
      flex: 1;
      min-width: 0;

      .comment-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .comment-nickname {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-text-main);
        }

        .comment-time {
          font-size: 12px;
          color: var(--ink-text-light);
        }
      }

      .comment-content {
        margin: 6px 0 4px;
        font-size: 13px;
        color: var(--ink-text-sub);
      }

      .comment-article {
        font-size: 12px;
        color: var(--ink-text-light);
      }
    }
  }

  .comment-empty {
    padding: 32px 0;
    font-size: 13px;
    color: var(--ink-text-light);
    text-align: center;
  }
}
</style>

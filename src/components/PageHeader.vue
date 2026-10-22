<template>
  <!-- 管理页统一页头：标题 + 描述 + 右侧操作插槽 -->
  <div class="page-header">
    <div class="page-header-text">
      <h2 class="page-title">{{ title }}</h2>
      <p v-if="description" class="page-desc">{{ description }}</p>
    </div>
    <div class="page-header-actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;

  .page-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--ink-text-main);

    // 标题左侧渐变竖线
    &::before {
      display: inline-block;
      width: 4px;
      height: 18px;
      margin-right: 10px;
      background: linear-gradient(180deg, #1a73e8, #0d47a1);
      border-radius: 2px;
      content: '';
      vertical-align: -2px;
    }
  }

  .page-desc {
    margin: 6px 0 0 14px;
    font-size: 13px;
    color: var(--ink-text-light);
  }
}
</style>

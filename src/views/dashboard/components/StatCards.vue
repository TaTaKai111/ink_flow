<template>
  <!-- 顶部统计卡片行 -->
  <div class="stat-cards">
    <div v-for="card in cards" :key="card.key" class="stat-card ink-card">
      <div class="stat-icon" :style="{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }">
        <el-icon><component :is="card.icon" /></el-icon>
      </div>
      <div class="stat-info">
        <span class="stat-label">{{ card.label }}</span>
        <span class="stat-value" :data-value="card.value">{{ displayValues[card.key] }}</span>
      </div>
      <div class="stat-glow" :style="{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Document, Folder, PriceTag, ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ articleCount: 0, categoryCount: 0, tagCount: 0, commentCount: 0 }),
  },
})

// 卡片配置：图标、颜色渐变区分
const cards = [
  { key: 'articleCount', label: '文章总数', icon: Document, from: '#1a73e8', to: '#4a9bf5' },
  { key: 'categoryCount', label: '分类数', icon: Folder, from: '#52c41a', to: '#95de64' },
  { key: 'tagCount', label: '标签数', icon: PriceTag, from: '#faad14', to: '#ffd666' },
  { key: 'commentCount', label: '评论数', icon: ChatDotRound, from: '#722ed1', to: '#b37feb' },
]

// 数字滚动动画的当前显示值
const displayValues = ref({ articleCount: 0, categoryCount: 0, tagCount: 0, commentCount: 0 })

// 数值变化时执行 count-up 动画
watch(
  () => props.stats,
  newStats => {
    cards.forEach(card => {
      const target = Number(newStats[card.key]) || 0
      const start = displayValues.value[card.key]
      const duration = 800
      const startTime = performance.now()
      const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1)
        // easeOutCubic 缓动
        const eased = 1 - (1 - progress) ** 3
        displayValues.value[card.key] = Math.round(start + (target - start) * eased)
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  },
  { deep: true, immediate: true },
)
</script>

<style scoped lang="scss">
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    font-size: 26px;
    color: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(26, 43, 74, 0.15);
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .stat-label {
      font-size: 13px;
      color: var(--ink-text-sub);
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--ink-text-main);
      font-variant-numeric: tabular-nums;
    }
  }

  // 右上角装饰光晕
  .stat-glow {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    opacity: 0.08;
    filter: blur(6px);
  }
}
</style>

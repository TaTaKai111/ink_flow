<template>
  <div class="dashboard page-container" v-loading="loading">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner ink-card">
      <div class="welcome-text">
        <h2>{{ greeting }}，{{ nickname }}</h2>
        <p>{{ today }} · 欢迎回到 InkFlow CMS，今天也是持续创作的一天</p>
      </div>
      <el-icon class="welcome-icon"><Reading /></el-icon>
    </div>

    <!-- 统计卡片 -->
    <StatCards :stats="stats" />

    <!-- 趋势 + 分类占比 -->
    <div class="chart-row">
      <div class="ink-card chart-card">
        <h3 class="card-title">文章发布趋势</h3>
        <p class="card-subtitle">近 6 个月文章发布数量统计</p>
        <TrendChart :months="trend.months" :counts="trend.counts" />
      </div>
      <div class="ink-card chart-card">
        <h3 class="card-title">分类占比</h3>
        <p class="card-subtitle">各分类下文章数量分布</p>
        <CategoryPieChart :data="categoryRatio" />
      </div>
    </div>

    <!-- 热门文章 + 最近评论 -->
    <div class="chart-row">
      <div class="ink-card chart-card">
        <h3 class="card-title">热门文章 Top5</h3>
        <p class="card-subtitle">按浏览量排序</p>
        <TopArticlesChart :data="topArticles" />
      </div>
      <div class="ink-card chart-card">
        <h3 class="card-title">最近评论</h3>
        <p class="card-subtitle">最新收到的 6 条评论</p>
        <RecentComments :list="recentComments" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Reading } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import {
  getStats,
  getPublishTrend,
  getCategoryRatio,
  getTopArticles,
  getRecentComments,
} from '@/api/dashboard'
import store from '@/store'
import StatCards from './components/StatCards.vue'
import TrendChart from './components/TrendChart.vue'
import CategoryPieChart from './components/CategoryPieChart.vue'
import TopArticlesChart from './components/TopArticlesChart.vue'
import RecentComments from './components/RecentComments.vue'

const loading = ref(true)
const stats = ref({ articleCount: 0, categoryCount: 0, tagCount: 0, commentCount: 0 })
const trend = reactive({ months: [], counts: [] })
const categoryRatio = ref([])
const topArticles = ref([])
const recentComments = ref([])

// 根据时间生成问候语
const greeting = computed(() => {
  const hour = dayjs().hour()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const nickname = computed(() => store.state.user.userInfo?.nickname || '博主')
const today = computed(() => dayjs().format('YYYY年MM月DD日 dddd'))

// 并行加载仪表盘全部数据
async function loadDashboard() {
  loading.value = true
  try {
    const [statsRes, trendRes, ratioRes, topRes, commentRes] = await Promise.all([
      getStats(),
      getPublishTrend(),
      getCategoryRatio(),
      getTopArticles(),
      getRecentComments(),
    ])
    stats.value = statsRes.data
    trend.months = trendRes.data.months
    trend.counts = trendRes.data.counts
    categoryRatio.value = ratioRes.data
    topArticles.value = topRes.data
    recentComments.value = commentRes.data
  } catch (error) {
    console.error('仪表盘数据加载失败：', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped lang="scss">
/* 欢迎横幅 */
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background: linear-gradient(120deg, #ffffff 60%, #e8f2fe 100%);

  .welcome-text h2 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: var(--ink-text-main);
  }

  .welcome-text p {
    margin: 0;
    font-size: 13px;
    color: var(--ink-text-sub);
  }

  .welcome-icon {
    font-size: 56px;
    color: var(--el-color-primary-light-5);
    opacity: 0.8;
  }
}

/* 图表行：两列布局 */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.chart-card {
  .card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink-text-main);

    // 标题左侧竖线装饰
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

  .card-subtitle {
    margin: 4px 0 8px 12px;
    font-size: 12px;
    color: var(--ink-text-light);
  }
}
</style>

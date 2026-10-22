<template>
  <VChart :option="chartOption" class="trend-chart" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import VChart from '@/components/VChart.vue'

const props = defineProps({
  // 月份标签，如 ['5月', '6月', ...]
  months: {
    type: Array,
    default: () => [],
  },
  // 每月发布数量
  counts: {
    type: Array,
    default: () => [],
  },
})

// 文章发布趋势折线图配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(31, 45, 61, 0.9)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
  },
  grid: { left: 36, right: 16, top: 16, bottom: 28 },
  xAxis: {
    type: 'category',
    data: props.months,
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#d3dce6' } },
    axisTick: { show: false },
    axisLabel: { color: '#5e6d82', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#909399', fontSize: 12 },
    splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } },
  },
  series: [
    {
      name: '发布文章数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 9,
      data: props.counts,
      lineStyle: { width: 3, color: '#1a73e8' },
      itemStyle: { color: '#ffffff', borderColor: '#1a73e8', borderWidth: 3 },
      // 渐变面积填充
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(26, 115, 232, 0.28)' },
          { offset: 1, color: 'rgba(26, 115, 232, 0.02)' },
        ]),
      },
    },
  ],
}))
</script>

<style scoped>
.trend-chart {
  height: 300px;
}
</style>

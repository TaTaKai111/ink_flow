<template>
  <VChart :option="chartOption" class="top-chart" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import VChart from '@/components/VChart.vue'

const props = defineProps({
  // 热门文章 [{ title, views }]
  data: {
    type: Array,
    default: () => [],
  },
})

// 热门文章浏览量 Top5 横向柱状图配置
const chartOption = computed(() => {
  const titles = [...props.data].map(item => item.title).reverse()
  const views = [...props.data].map(item => item.views).reverse()
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(31, 45, 61, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: params => `${params.name}<br/>浏览量：${params.value}`,
    },
    grid: { left: 8, right: 48, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#909399', fontSize: 12 },
      splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } },
    },
    yAxis: {
      type: 'category',
      data: titles,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5e6d82', fontSize: 12 },
    },
    series: [
      {
        name: '浏览量',
        type: 'bar',
        data: views,
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          // 水平渐变柱
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#0d47a1' },
            { offset: 1, color: '#4a9bf5' },
          ]),
        },
        // 柱条末端显示数值
        label: {
          show: true,
          position: 'right',
          color: '#5e6d82',
          fontSize: 12,
          formatter: params => params.value,
        },
      },
    ],
  }
})
</script>

<style scoped>
.top-chart {
  height: 300px;
}
</style>

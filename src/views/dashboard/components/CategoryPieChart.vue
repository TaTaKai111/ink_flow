<template>
  <VChart :option="chartOption" class="pie-chart" />
</template>

<script setup>
import { computed } from 'vue'
import VChart from '@/components/VChart.vue'

const props = defineProps({
  // 分类占比数据 [{ name, value }]
  data: {
    type: Array,
    default: () => [],
  },
})

// 饼图配色（深蓝主题向的明亮色板）
const palette = ['#1a73e8', '#4a9bf5', '#722ed1', '#13c2c2', '#52c41a', '#faad14', '#eb2f96', '#fa541c']

// 分类占比环形图配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(31, 45, 61, 0.9)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: '{b}: {c} 篇（{d}%）',
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 12,
    textStyle: { color: '#5e6d82', fontSize: 12 },
  },
  color: palette,
  series: [
    {
      type: 'pie',
      radius: ['46%', '70%'],
      center: ['36%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#ffffff', borderWidth: 2, borderRadius: 6 },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 600,
          color: '#1f2d3d',
          formatter: '{b}\n{d}%',
        },
        scaleSize: 8,
      },
      data: props.data,
    },
  ],
}))
</script>

<style scoped>
.pie-chart {
  height: 300px;
}
</style>

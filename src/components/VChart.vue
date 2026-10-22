<template>
  <!-- ECharts 容器：高度由父级通过 style 控制 -->
  <div ref="chartRef" class="v-chart" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // ECharts 配置项
  option: {
    type: Object,
    required: true,
  },
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
onMounted(async () => {
  await nextTick()
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
  window.addEventListener('resize', handleResize)
})

// option 变化时更新图表
watch(
  () => props.option,
  newOption => {
    chartInstance?.setOption(newOption, true)
  },
  { deep: true },
)

// 窗口缩放自适应
function handleResize() {
  chartInstance?.resize()
}

// 销毁实例，避免内存泄漏
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped>
.v-chart {
  width: 100%;
  height: 100%;
}
</style>

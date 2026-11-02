/**
 * ECharts 按需引入
 *
 * 全量 `import * as echarts from 'echarts'` 会把全部图表类型与组件打进产物，
 * 开发态预构建后约 2.5MB，首屏需要完整下载并解析，是"卡在加载界面"的主因之一。
 * 这里只注册项目实际用到的图表与组件，体积可下降 80% 以上。
 * 新增图表类型 / 组件时，在此处补充注册即可。
 */
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
])

export default echarts

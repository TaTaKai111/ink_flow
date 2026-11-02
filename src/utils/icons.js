/**
 * 需要全局注册的 Element Plus 图标
 *
 * 早期使用 `import * as ElementPlusIconsVue` 全量注册 1200+ 图标组件，
 * 会显著拖慢首屏。改为只注册「以字符串名动态渲染」的图标：
 * 路由 meta.icon 与菜单渲染需要通过名字解析组件，其余图标由各页面按需 import。
 */
import {
  ChatDotRound,
  DataAnalysis,
  Document,
  Folder,
  PriceTag,
  Setting,
} from '@element-plus/icons-vue'

/** 图标名 -> 组件，供 <component :is=""> 按名字解析 */
export const iconMap = {
  ChatDotRound,
  DataAnalysis,
  Document,
  Folder,
  PriceTag,
  Setting,
}

export default iconMap

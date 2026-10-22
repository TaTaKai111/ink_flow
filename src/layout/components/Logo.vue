<template>
  <svg
    class="ink-logo"
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="inkLogoGradient" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0%" :stop-color="from" />
        <stop offset="100%" :stop-color="to" />
      </linearGradient>
    </defs>
    <!-- 圆角方形底 -->
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#inkLogoGradient)" />
    <!-- 墨滴 -->
    <path
      d="M24 9c-8 8.5-12 14.8-12 20.4C12 36.4 17.4 42 24 42s12-5.6 12-12.6C36 23.8 32 17.5 24 9z"
      fill="#ffffff"
      fill-opacity="0.95"
    />
    <!-- 墨滴高光 -->
    <path d="M24 14c-5.5 6-8.5 10.3-8.5 14.2 0 .5.05 1 .14 1.5C17 25 21.4 19.6 27 15.2c-1-1-2-1.7-3-1.2z" fill="#1a73e8" fill-opacity="0.35" />
    <!-- 笔尖 -->
    <path d="M24 30.5l3.2 6.2c.7 1.4-.5 2.6-1.9 2.1l-2.2-1-2.2 1c-1.4.5-2.6-.7-1.9-2.1L24 30.5z" fill="url(#inkLogoGradient)" />
  </svg>
</template>

<script setup>
defineProps({
  // 图标尺寸
  size: {
    type: [Number, String],
    default: 40,
  },
  // 渐变起始色
  from: {
    type: String,
    default: '#1a73e8',
  },
  // 渐变结束色
  to: {
    type: String,
    default: '#0d47a1',
  },
})
</script>

<style scoped>
.ink-logo {
  display: block;
  flex-shrink: 0;
}
</style>

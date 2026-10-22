import dayjs from 'dayjs'

/**
 * 格式化日期时间
 * @param {string|number|Date} date 日期
 * @param {string} pattern 格式，默认 YYYY-MM-DD HH:mm
 * @returns {string} 格式化后的字符串
 */
export function formatDate(date, pattern = 'YYYY-MM-DD HH:mm') {
  if (!date) return '-'
  return dayjs(date).format(pattern)
}

/**
 * 截断过长文本并追加省略号
 * @param {string} text 原文本
 * @param {number} max 最大长度
 */
export function ellipsis(text, max = 40) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}...` : text
}

/**
 * 生成随机头像文字（昵称首字）
 * @param {string} name 昵称
 */
export function avatarText(name) {
  return (name || '?').trim().charAt(0)
}

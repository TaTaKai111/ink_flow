import Mock from 'mockjs'
import {
  categorySeeds,
  tagSeeds,
  nicknames,
  commentContents,
  contentTemplates,
} from './data'

/**
 * Mock 内存数据库
 * 所有 CRUD 操作直接作用于下面的数组，实现真实的增删改效果；
 * 同时将数据持久化到 localStorage，刷新页面后数据不丢失。
 */

const STORAGE_KEY = 'inkflow_mock_db_v1'

/** 生成 [daysAgoStart, daysAgoEnd] 区间内的随机日期（ISO 字符串） */
function randomDate(daysAgoStart, daysAgoEnd) {
  const day = 24 * 3600 * 1000
  const end = Date.now() - daysAgoStart * day
  const start = Date.now() - daysAgoEnd * day
  return new Date(start + Math.random() * (end - start)).toISOString()
}

/** 从数组中随机取一个元素 */
function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/** 随机取 1~4 个标签 ID */
function randomTagIds() {
  const count = Mock.Random.integer(1, 4)
  const ids = new Set()
  while (ids.size < count) {
    ids.add(Mock.Random.integer(1, tagSeeds.length))
  }
  return [...ids]
}

/** 根据标题生成正文 */
function buildContent(title) {
  const paragraphs = [
    `《${title}》—— 本文围绕实际业务场景展开，结合个人实践经验，对相关技术方案进行系统性梳理与总结。`,
    ...contentTemplates,
  ]
  return paragraphs.join('\n\n')
}

/** 生成初始种子数据：8 分类 / 20 标签 / 128 文章 / 50 评论 + 默认设置 */
function seedDb() {
  // ---------- 分类（8 个） ----------
  const categories = categorySeeds.map((item, index) => ({
    id: index + 1,
    name: item.name,
    createdAt: randomDate(180, 700),
  }))

  // ---------- 标签（20 个） ----------
  const tags = tagSeeds.map((item, index) => ({
    id: index + 1,
    name: item.name,
    color: item.color,
    createdAt: randomDate(150, 650),
  }))

  // ---------- 文章（128 篇：约 6 成发布于近半年，保证趋势图数据饱满） ----------
  const articles = []
  let articleSeq = 0
  categorySeeds.forEach((category, categoryIndex) => {
    category.titles.forEach(title => {
      articleSeq += 1
      const isRecent = articleSeq % 10 < 6
      const createdAt = isRecent ? randomDate(0, 183) : randomDate(184, 730)
      const content = buildContent(title)
      articles.push({
        id: articleSeq,
        title,
        summary: content.replace(/\n/g, ' ').slice(0, 60),
        content,
        categoryId: categoryIndex + 1,
        tagIds: randomTagIds(),
        status: Math.random() < 0.72 ? 'published' : 'draft',
        views: Mock.Random.integer(36, 8600),
        createdAt,
        updatedAt: createdAt,
      })
    })
  })
  // 按创建时间倒序，新文章排前面
  articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // ---------- 评论（50 条） ----------
  const publishedIds = articles.filter(item => item.status === 'published').map(item => item.id)
  const comments = Array.from({ length: 50 }, (_, index) => {
    const rand = Math.random()
    return {
      id: index + 1,
      articleId: pickOne(publishedIds),
      nickname: pickOne(nicknames),
      content: pickOne(commentContents),
      // 待审核 30% / 已审核 55% / 已拒绝 15%
      status: rand < 0.3 ? 'pending' : rand < 0.85 ? 'approved' : 'rejected',
      createdAt: randomDate(0, 90),
    }
  })
  comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // ---------- 系统设置 ----------
  const settings = {
    siteName: 'InkFlow CMS',
    siteDescription: '记录技术成长，分享生活点滴 —— 一个简洁高效的个人博客内容管理平台',
    siteLogo: '',
    bloggerNickname: '墨流',
    bloggerAvatar: '',
    bloggerBio: '全栈开发工程师，热爱前端技术与写作，相信持续积累的力量。',
    commentEnabled: true,
    registerEnabled: false,
  }

  return { categories, tags, articles, comments, settings }
}

/** 从 localStorage 恢复数据，无记录则生成种子数据 */
function loadDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && Array.isArray(parsed.articles) && Array.isArray(parsed.categories)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Mock 数据读取失败，将重新生成：', error)
  }
  return seedDb()
}

/** 统一数据源 */
export const db = loadDb()

/** 数据变更后调用，持久化到 localStorage */
export function persistDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (error) {
    console.error('Mock 数据持久化失败：', error)
  }
}

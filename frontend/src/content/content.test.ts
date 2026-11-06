/**
 * [INPUT]: 依赖 ./index 的 WORKS、HOME、SITE；依赖 @/api/static 的 staticPublicApi；依赖 node:fs 检查 public/ 素材
 * [OUTPUT]: vitest 用例（无导出）
 * [POS]: content 模块的守门测试。作者手写数据没有后端校验，这里替代后台表单的约束：
 *        slug 唯一、素材文件真实存在、首页章节引用的作品可解析、未公开作品不外露。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { HOME, SITE, WORKS } from './index'
import { staticPublicApi } from '@/api/static'

// vitest 以 frontend/ 为工作目录；jsdom 下 import.meta.url 不是 file 协议，不能用来定位。
const PUBLIC_DIR = resolve(process.cwd(), 'public')
const published = WORKS.filter((work) => work.status === 'published')

test('作品 slug 唯一，且只含小写字母、数字与连字符', () => {
  const slugs = WORKS.map((work) => work.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/))
})

test('封面与图集引用的素材都存在于 public/', () => {
  const missing = WORKS.flatMap((work) => [work.cover, ...(work.gallery || [])])
    .filter((media) => media && !existsSync(PUBLIC_DIR + media.src))
    .map((media) => media!.src)
  expect(missing).toEqual([])
})

test('首页五个章节引用的作品都已公开', () => {
  const refs = [HOME.question.work, HOME.standard.work, HOME.human.work, HOME.loop.work]
  refs.forEach((slug) => expect(published.map((work) => work.slug)).toContain(slug))
})

test('公开作品必须写出问题、决策、贡献与证据', () => {
  published.forEach((work) => {
    expect(work.problem.trim(), work.slug).not.toBe('')
    expect(work.decisions.length, work.slug).toBeGreaterThan(0)
    expect(work.contributions.length, work.slug).toBeGreaterThan(0)
    expect(work.outcomes.length + work.metrics.length, work.slug).toBeGreaterThan(0)
  })
})

test('草稿与已下架作品不出现在公开列表与详情中', async () => {
  const hidden = WORKS.filter((work) => work.status !== 'published')
  const list = await staticPublicApi.projects({ page_size: 100 })
  expect(list.pagination.total).toBe(published.length)
  for (const work of hidden) await expect(staticPublicApi.project(work.slug)).rejects.toMatchObject({ status: 404 })
})

test('精选数量不少于站点设置的展示数', async () => {
  const featured = await staticPublicApi.projects({ featured: true, page_size: 100 })
  expect(featured.pagination.total).toBeGreaterThanOrEqual(Number(SITE.settings.featured_project_count))
})

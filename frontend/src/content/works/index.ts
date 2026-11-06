/**
 * [INPUT]: 依赖同目录全部作品文件与 ../schema 的 WorkSource
 * [OUTPUT]: 导出 WORKS（按 order 排序的全部作品，含草稿）
 * [POS]: content/works 的唯一出口。api/static.ts 只从这里读取作品，不直接引用单个文件。
 *        新增作品：新建文件 → 在下方数组登记 → 更新 content/CLAUDE.md。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'
import { agentBenchmark } from './agent-benchmark'
import { insightflow } from './insightflow'
import { yushengsheng } from './yushengsheng'
import { contentPipeline } from './content-pipeline'
import { jingzhun } from './jingzhun'
import { personalMemory, secondBrain } from './memory'
import { dshPlugins } from './dsh-plugins'
import { campusClubMatch, workstation } from './campus'
import { lvbangpt, morningBrief, readingCoach } from './agents'
import { htmlTrio, kb, modelRadar, quickCapture, resumePipeline } from './tools'
import { finAssistant, gexo } from './drafts'

export const WORKS: readonly WorkSource[] = [
  agentBenchmark,
  insightflow,
  yushengsheng,
  contentPipeline,
  jingzhun,
  personalMemory,
  secondBrain,
  dshPlugins,
  campusClubMatch,
  lvbangpt,
  morningBrief,
  workstation,
  readingCoach,
  kb,
  resumePipeline,
  htmlTrio,
  quickCapture,
  modelRadar,
  gexo,
  finAssistant,
].sort((a, b) => a.order - b.order)

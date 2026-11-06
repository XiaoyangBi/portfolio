/**
 * [INPUT]: 依赖 vue 的生命周期与 reactive；依赖 @/utils/pageNavigation 的 PAGE_LAYOUT_EVENT
 * [OUTPUT]: 导出 stage（画布读取的非响应式共享状态）、useChapters（章节滚动进度）、isStaticFlow（是否退化为普通文档流）
 * [POS]: themes/cosmo 的滚动叙事引擎。CosmoHome 调用 useChapters；StarStage 每帧读取 stage。
 *        设计取舍：进度写入 CSS 变量（--p、--in），动画由样式 calc() 驱动；只有演示组件需要离散状态时才读 reactive 的 progress。
 *        窄屏或减少动效时，章节退化为普通文档流：进度恒为 1，夜幕按「夜间章节距视口中心的远近」计算。
 *        桌面端夜幕与内容同源：入场同相，离场滞后。浅色文字先淡出，底色后亮，避免灰底白字。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { onBeforeUnmount, onMounted, reactive, type Ref } from 'vue'
import { PAGE_LAYOUT_EVENT } from '@/utils/pageNavigation'

/* ────────────────────────── 共享舞台状态 ────────────────────────── */

/** 画布每帧读取：night 为夜幕浓度，orbit 为首屏星系可见度，0..1 */
export const stage = { night: 0, orbit: 0 }
/** 舞台状态被外部改写后广播，唤醒已停下的画布循环 */
export const STAGE_EVENT = 'cosmo:stage'

const flowQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)') : null
export const isStaticFlow = () => Boolean(flowQuery?.matches)

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (t: number) => t * t * (3 - 2 * t)

/* ────────────────────────── 章节进度 ────────────────────────── */

/**
 * 扫描 root 内全部 [data-ch] 章节，持续写入：
 *  --p  ：章节被钉住期间 0 → 1
 *  --in ：入场与离场的可见度 0 → 1 → 0（首章不入场渐变，末章不离场渐变）
 * [data-night] 章节的可见度决定全站夜幕。
 */
export function useChapters(root: Ref<HTMLElement | null>) {
  const progress = reactive<Record<string, number>>({})
  let frame = 0
  let sections: HTMLElement[] = []

  function collect() {
    sections = Array.from(root.value?.querySelectorAll<HTMLElement>('[data-ch]') || [])
  }

  function measure() {
    frame = 0
    const viewport = window.innerHeight || 1
    const flow = isStaticFlow()
    let night = 0
    sections.forEach((section, index) => {
      const key = section.dataset.ch || String(index)
      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - viewport)
      const p = -rect.top / travel
      // 入场在章节顶边进入视口下部时开始，离场在钉住结束后随章节滑出完成：相邻章节交接处不留整屏空白。
      const enter = index === 0 ? 1 : clamp((p + 0.62) / 0.5)
      const exit = index === sections.length - 1 ? 1 : clamp((1.3 - p) / 0.3)
      const visibility = flow ? 1 : smooth(Math.min(enter, exit))
      const pinned = flow ? 1 : clamp(p)
      section.style.setProperty('--p', pinned.toFixed(4))
      section.style.setProperty('--in', visibility.toFixed(4))
      const rounded = Math.round(pinned * 100) / 100
      if (progress[key] !== rounded) progress[key] = rounded
      if (index === 0) stage.orbit = flow ? clamp(1 - -rect.top / viewport) : smooth(clamp(1 - p * 1.4))
      if (section.dataset.night !== undefined) {
        const centered = 1 - Math.abs(rect.top + rect.height / 2 - viewport / 2) / (rect.height / 2 + viewport * 0.25)
        // 夜幕与内容同源，但离场滞后：内容先淡出，底色后褪，交接处不留整屏中灰。
        // 夜间章节的文字是固定浅色；夜幕先退或晚升都会造成「浅字压灰底」。
        const nightCurve = smooth(Math.min(clamp((p + 0.62) / 0.5), clamp((1.34 - p) / 0.26)))
        night = Math.max(night, flow ? smooth(clamp(centered * 1.6)) : nightCurve)
      }
    })
    stage.night = night
    const html = document.documentElement
    html.style.setProperty('--night', night.toFixed(3))
    html.classList.toggle('is-night', night > 0.5)
  }

  const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
  const refresh = () => { collect(); cancelAnimationFrame(frame); frame = 0; measure(); window.dispatchEvent(new Event(STAGE_EVENT)) }

  onMounted(() => {
    refresh()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', refresh, { passive: true })
    window.addEventListener(PAGE_LAYOUT_EVENT, refresh)
    flowQuery?.addEventListener('change', refresh)
  })
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', refresh)
    window.removeEventListener(PAGE_LAYOUT_EVENT, refresh)
    flowQuery?.removeEventListener('change', refresh)
    stage.night = 0
    stage.orbit = 0
    window.dispatchEvent(new Event(STAGE_EVENT))
    document.documentElement.style.removeProperty('--night')
    document.documentElement.classList.remove('is-night')
  })

  return { progress, refresh }
}

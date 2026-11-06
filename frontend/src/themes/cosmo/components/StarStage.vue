<!--
  [INPUT]: 依赖 ../composables/useChapters 的 stage 共享状态
  [OUTPUT]: StarStage 组件（全屏固定画布）
  [POS]: themes/cosmo 的背景层，由 CosmoLayout 挂载一次。
         它画两样东西：首屏右侧的「作品星系」（每颗行星代表一件作品），与全站的星尘。
         夜幕浓度 stage.night 把墨色星尘点亮为白色星空；stage.orbit 控制星系淡出。
         画布不参与布局与交互，页面隐藏时暂停；减少动效时只在滚动与尺寸变化时重绘一帧。
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { STAGE_EVENT, stage } from '../composables/useChapters'

const props = withDefaults(defineProps<{ bodies?: number }>(), { bodies: 18 })
const canvas = ref<HTMLCanvasElement | null>(null)

interface Star { x: number; y: number; depth: number; r: number; phase: number }
interface Body { ring: number; angle: number; speed: number; r: number }

const INK = [29, 29, 31]
const NIGHT_INK = [242, 242, 240]
const BRAND = [22, 176, 234]
const RINGS = [0.62, 0.86, 1.1]
const TILT = (-16 * Math.PI) / 180

let stars: Star[] = []
let bodies: Body[] = []
let width = 0
let height = 0
let ratio = 1
let frame = 0
let elapsed = 0
let last = 0
const still = window.matchMedia('(prefers-reduced-motion: reduce)')

/* ────────────────────────── 初始化 ────────────────────────── */

function seed() {
  const count = Math.min(220, Math.round((width * height) / 9000))
  stars = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), depth: 0.25 + Math.random() * 0.75, r: 0.4 + Math.random() * 1.1, phase: Math.random() * Math.PI * 2 }))
  bodies = Array.from({ length: props.bodies }, (_, index) => ({
    ring: index % RINGS.length,
    angle: (index / props.bodies) * Math.PI * 2 * 2.3,
    speed: (0.05 + Math.random() * 0.05) * (index % 2 ? 1 : 0.8),
    r: 1.8 + Math.random() * 2.2,
  }))
}

function resize() {
  const node = canvas.value
  if (!node) return
  ratio = Math.min(2, window.devicePixelRatio || 1)
  width = window.innerWidth
  height = window.innerHeight
  node.width = Math.round(width * ratio)
  node.height = Math.round(height * ratio)
  seed()
  draw()
}

/* ────────────────────────── 绘制 ────────────────────────── */

const mix = (a: number[], b: number[], t: number) => a.map((value, index) => Math.round(value + (b[index]! - value) * t)).join(',')

function drawStars(context: CanvasRenderingContext2D, color: string) {
  const scroll = window.scrollY
  stars.forEach((star) => {
    const twinkle = 0.55 + 0.45 * Math.sin(elapsed * (0.6 + star.depth) + star.phase)
    const alpha = 0.09 * star.depth * (1 - stage.night) + stage.night * (0.18 + 0.8 * twinkle) * star.depth
    if (alpha < 0.01) return
    const y = (((star.y * height - scroll * star.depth * 0.06) % height) + height) % height
    context.fillStyle = `rgba(${color},${alpha.toFixed(3)})`
    context.beginPath()
    context.arc(star.x * width, y, star.r * (0.8 + stage.night * 0.5), 0, Math.PI * 2)
    context.fill()
  })
}

function drawOrbit(context: CanvasRenderingContext2D, color: string) {
  const visible = stage.orbit * (1 - stage.night)
  if (visible < 0.01) return
  const narrow = width < 760
  const cx = narrow ? width * 0.62 : width * 0.72
  const cy = narrow ? height * 0.3 : height * 0.48
  const radius = Math.min(width, height) * (narrow ? 0.34 : 0.3)
  const squash = 0.34
  context.save()
  context.translate(cx, cy)
  context.rotate(TILT)
  RINGS.forEach((ring) => {
    context.strokeStyle = `rgba(${color},${(0.13 * visible).toFixed(3)})`
    context.lineWidth = 1
    context.beginPath()
    context.ellipse(0, 0, radius * ring, radius * ring * squash, 0, 0, Math.PI * 2)
    context.stroke()
  })
  const core = radius * 0.2
  const placed = bodies.map((body) => {
    const angle = body.angle + elapsed * body.speed
    const rx = radius * RINGS[body.ring]!
    return { x: Math.cos(angle) * rx, y: Math.sin(angle) * rx * squash, front: Math.sin(angle) > 0, r: body.r }
  })
  const paint = (front: boolean) => placed.filter((body) => body.front === front).forEach((body) => {
    const hidden = !front && Math.hypot(body.x, body.y / 0.9) < core
    context.fillStyle = `rgba(${color},${((hidden ? 0.08 : front ? 0.78 : 0.32) * visible).toFixed(3)})`
    context.beginPath()
    context.arc(body.x, body.y, body.r, 0, Math.PI * 2)
    context.fill()
  })
  paint(false)
  context.fillStyle = `rgba(250,250,248,${visible.toFixed(3)})`
  context.strokeStyle = `rgba(${color},${(0.5 * visible).toFixed(3)})`
  context.beginPath()
  context.arc(0, 0, core, 0, Math.PI * 2)
  context.fill()
  context.stroke()
  context.fillStyle = `rgba(${BRAND.join(',')},${(0.9 * visible).toFixed(3)})`
  context.beginPath()
  context.arc(core * 0.32, -core * 0.3, core * 0.12, 0, Math.PI * 2)
  context.fill()
  paint(true)
  context.restore()
}

function draw() {
  const context = canvas.value?.getContext('2d')
  if (!context) return
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  const color = mix(INK, NIGHT_INK, stage.night)
  drawStars(context, color)
  drawOrbit(context, mix(INK, NIGHT_INK, stage.night))
}

function loop(now: number) {
  frame = 0
  elapsed += Math.min(0.05, (now - (last || now)) / 1000)
  last = now
  draw()
  // 星系与夜空都不可见时，画面只随滚动变化：停下动画循环，由滚动事件唤醒。
  const animating = stage.orbit > 0.01 || stage.night > 0.01
  if (animating && !document.hidden && !still.matches) frame = requestAnimationFrame(loop)
}

function wake() {
  if (still.matches) { draw(); return }
  if (!frame && !document.hidden) { last = 0; frame = requestAnimationFrame(loop) }
}

onMounted(() => {
  resize()
  wake()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener(STAGE_EVENT, wake)
  document.addEventListener('visibilitychange', wake)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', wake)
  window.removeEventListener(STAGE_EVENT, wake)
  document.removeEventListener('visibilitychange', wake)
})
</script>

<template>
  <canvas ref="canvas" class="cz-stage" aria-hidden="true" />
</template>

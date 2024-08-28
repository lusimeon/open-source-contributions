<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { damp } from '@studiometa/js-toolkit/utils'
import rough from 'roughjs/bundled/rough.cjs.js'

class Vector {
  x
  y

  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  add(vec) {
    this.x += vec.x
    this.y += vec.y
  }

  multiply(vec) {
    this.x *= vec.x
    this.y *= vec.y
  }

  set(vec) {
    this.x = vec.x
    this.y = vec.y
  }

  getSum() {
    return Math.abs(this.x) + Math.abs(this.y)
  }
}

class Circle {
  rc
  pos
  vel
  r
  seed
  strokeColor
  strokeWidth
  dampening
  grabbing
  bowing
  rcCircle

  constructor(rc, pos: Vector, r) {
    this.rc = rc
    this.pos = pos
    this.vel = new Vector(1, 1)
    this.r = r
    this.seed = rough.newSeed()
    this.strokeColor = 'rgba(0,0,170,0.5)'
    this.strokeWidth = 2
    this.dampening = new Vector(0.6, 0.6)
    this.grabbing = false
    this.bowing = this.vel.getSum() * 0.4
  }

  update(timestamp: number) {
    const sin = Math.sin(Math.PI * timestamp)
    if (Math.floor(timestamp) % 10 === 0) {
      this.vel.y = sin * 10
    }

    this.seed = rough.newSeed()
    this.bounce()
    this.draw()
  }

  bounce() {
    this.bowing = this.vel.getSum() * 0.4
    this.vel.multiply(this.dampening)
  }

  draw() {
    this.rcCircle = this.rc.circle(this.pos.x, this.pos.y, this.r, {
      seed: this.seed,
      roughness: 5,
      bowing: this.bowing,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      fill: this.strokeColor,
      fillStyle: 'hachure',
      fillWeight: this.strokeWidth,
      hachureGap: 15,
    })
  }
}

function scaleCanvas(canvas, context, width, height) {
  const devicePixelRatio = window.devicePixelRatio || 1

  const backingStoreRatio = context.webkitBackingStorePixelRatio
    || context.mozBackingStorePixelRatio
    || context.msBackingStorePixelRatio
    || context.oBackingStorePixelRatio
    || context.backingStorePixelRatio
    || 1

  const ratio = devicePixelRatio / backingStoreRatio

  if (devicePixelRatio !== backingStoreRatio) {
    canvas.width = width * ratio
    canvas.height = height * ratio

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  }
  else {
    canvas.width = width
    canvas.height = height
    canvas.style.width = ''
    canvas.style.height = ''
  }

  context.scale(ratio, ratio)
}

function run() {
  if (!canvasRef.value) {
    throw new Error('your error message')
  }

  const canvas = canvasRef.value
  const rc = rough.canvas(canvas)
  const ctx = canvas.getContext('2d')
  let width = (canvas.width = window.innerWidth)
  let height = (canvas.height = window.innerHeight)

  scaleCanvas(canvas, ctx, width, height)

  const circleRadius = width / 20
  const circle = new Circle(
    rc,
    new Vector(width / 2, height / 2),
    circleRadius,
  )

  let reduced = false
  const mouse = {
    movement: new Vector(0, 0),
  }

  let fillStyle = 'rgba(251,254,251,1)'
  const htmlClassList = document.querySelector('html')?.classList

  if (htmlClassList.contains('theme-dark')) {
    fillStyle = 'rgba(47,55,65,1)'
    circle.strokeColor = 'rgba(26, 217, 217,1)'
  }

  function update(timestamp = 0) {
    ctx.fillStyle = fillStyle
    ctx.fillRect(0, 0, width, height)
    circle.update(timestamp)

    setTimeout(() => {
      requestAnimationFrame(update)
    }, 1000 / fps)
  }

  update()

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    scaleCanvas(canvas, ctx, width, height)
  })

  window.addEventListener('mousemove', (e) => {
    const posX = damp(e.clientX, circle.pos.x, dampFactor)
    const posY = damp(e.clientY, circle.pos.y, dampFactor)
    mouse.movement.set(new Vector(posX, posY))

    const shouldReduce = (e.target instanceof Element && e.target.matches(shrinkSelectors)) || false

    circle.pos.set(mouse.movement)
    circle.vel.multiply(new Vector(0, 0))

    if (shouldReduce) {
      if (!reduced) {
        reduced = true
        circle.r = damp(circle.r, circle.r / 10, dampFactor)
      }

      return
    }

    reduced = false
    circle.r = damp(circle.r, circleRadius, dampFactor)
  })
}

const canvasRef = ref(null)
const fps = 30
const dampFactor = 0.2
const shrinkSelectors = 'a, a *, button, button *, input, [data-cursor-shrink], [data-cursor-shrink] *'

onMounted(run)
</script>

<template>
  <canvas ref="canvasRef" class="hidden z-[-1] sm:block motion-reduce:hidden fixed inset-0" />
</template>

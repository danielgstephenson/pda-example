import { boxToSimplex, round, roundSimplex, simplexToBox, sqrt3, toInnerSimplex } from './math/math'
import { Vec2 } from './math/vec2'
import { Vec3 } from './math/vec3'

export class Triangle {
  static resolution = 100
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  imageData: ImageData
  offscreenCanvas: OffscreenCanvas
  offscreenContext: OffscreenCanvasRenderingContext2D
  strategy: Vec3 | null = null
  drawX = 0.1
  drawY = 0.1
  drawSize = 0.8

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = 1000
    this.canvas.height = 1000
    this.canvas.style.imageRendering = 'pixelated'
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.imageData = this.getImageData()
    this.offscreenCanvas = new OffscreenCanvas(Triangle.resolution, Triangle.resolution)
    this.offscreenContext = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event))
    this.draw()
  }

  getImageData (): ImageData {
    const width = Triangle.resolution
    const height = Triangle.resolution
    const imageArray = new Uint8ClampedArray(4 * width * height)
    imageArray.forEach((uint, i) => {
      if (i % 4 !== 0) return
      const pixel = Math.floor(i / 4)
      const x = (pixel % width + 0.5) / width
      const y = (Math.floor(pixel / width) + 0.5) / height
      const w = toInnerSimplex(boxToSimplex(new Vec2(x, y)))
      imageArray[i + 0] = 0 // R value
      imageArray[i + 1] = 170// G value
      imageArray[i + 2] = 0 // B value
      imageArray[i + 3] = 255 // A value
    })
    return new ImageData(imageArray, width, height)
  }

  draw (): void {
    this.resetContext()
    this.context.fillStyle = 'white'
    this.context.fillRect(0, 0, 1, 1)
    this.offscreenContext.putImageData(this.imageData, 0, 0)
    this.context.save()
    this.context.beginPath()
    const x = this.drawX
    const y = this.drawY
    const size = this.drawSize
    const xMid = x + 0.5 * size
    const height = 0.5 * sqrt3 * size
    this.context.moveTo(x, y)
    this.context.lineTo(x + size, y)
    this.context.lineTo(xMid, y + height)
    this.context.closePath()
    this.context.clip()
    this.context.drawImage(this.offscreenCanvas, x, y, size, size)
    this.context.restore()
    this.drawStrategy()
  }

  drawStrategy (): void {
    if (this.strategy == null) return
    this.resetContext()
    const b = simplexToBox(this.strategy)
    const x = this.drawX + this.drawSize * b.x
    const y = this.drawX + this.drawSize * b.y
    this.context.lineWidth = 0.005
    this.context.strokeStyle = 'blue'
    this.context.beginPath()
    this.context.arc(x, y, 0.01, 0, 2 * Math.PI)
    this.context.stroke()
  }

  resetContext (): void {
    this.context.resetTransform()
    this.context.translate(0, this.canvas.height)
    this.context.scale(this.canvas.width, -this.canvas.height)
    this.context.globalAlpha = 1
    this.context.imageSmoothingEnabled = false
  }

  onMouseDown (event: MouseEvent): void {
    const canvasX = event.offsetX / this.canvas.clientWidth
    const canvasY = 1 - event.offsetY / this.canvas.clientHeight
    const boxX = (canvasX - this.drawX) / this.drawSize
    const boxY = (canvasY - this.drawY) / this.drawSize
    const b = new Vec2(boxX, boxY)
    const s = boxToSimplex(b)
    if (Math.min(s.x, s.y, s.z) < -0.1) return
    this.strategy = toInnerSimplex(boxToSimplex(b))
    console.log(round(this.strategy.x, 2), round(this.strategy.y, 2), round(this.strategy.z, 2))
    this.draw()
  }
}

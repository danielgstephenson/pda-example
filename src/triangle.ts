import { boxToSimplex, sqrt3 } from './math/math'
import { Vec2 } from './math/vec2'

export class Triangle {
  static resolution = 300
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  imageData: ImageData
  offscreenCanvas: OffscreenCanvas
  offscreenContext: OffscreenCanvasRenderingContext2D

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = 1000
    this.canvas.height = 1000
    this.canvas.style.imageRendering = 'pixelated'
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.imageData = this.getImageData()
    this.offscreenCanvas = new OffscreenCanvas(Triangle.resolution, Triangle.resolution)
    this.offscreenContext = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
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
      const w = boxToSimplex(new Vec2(x, y))
      if (Math.min(w.x, w.y, w.z) < 0) return
      imageArray[i + 0] = 0 // R value
      imageArray[i + 1] = 170// G value
      imageArray[i + 2] = 0 // B value
      imageArray[i + 3] = 255 // A value
    })
    return new ImageData(imageArray, width, height)
  }

  draw (): void {
    this.resetContext()
    this.offscreenContext.putImageData(this.imageData, 0, 0)
    this.context.save()
    this.context.beginPath()
    const x = 0.25
    const y = 0.2
    const size = 0.5
    const xMid = x + 0.5 * size
    const height = 0.5 * sqrt3 * size
    const halfPixel = 0.5 * size / Triangle.resolution
    this.context.moveTo(x + halfPixel, y + halfPixel)
    this.context.lineTo(x + size - halfPixel, y + halfPixel)
    this.context.lineTo(xMid, y + height - halfPixel)
    this.context.closePath()
    this.context.clip()
    this.context.drawImage(this.offscreenCanvas, x, y, size, size)
    this.context.restore()
  }

  resetContext (): void {
    this.context.resetTransform()
    this.context.translate(0, this.canvas.height)
    this.context.scale(this.canvas.width, -this.canvas.height)
    this.context.globalAlpha = 1
    this.context.imageSmoothingEnabled = false
  }
}

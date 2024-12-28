import { boxToSimplex } from './math/math'
import { Vec2 } from './math/vec2'

export class Triangle {
  static resolution = 100
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
    for (let i = 0; i < imageArray.length; i += 4) {
      const pixel = Math.floor(i / 4)
      const x = (pixel % width + 0.5) / width
      const y = (Math.floor(pixel / width) + 0.5) / height
      const w = boxToSimplex(new Vec2(x, y))
      if (Math.min(w.x, w.y, w.z) < 0) continue
      imageArray[i + 0] = 0 // R value
      imageArray[i + 1] = 170// G value
      imageArray[i + 2] = 0 // B value
      imageArray[i + 3] = 255 // A value
    }
    return new ImageData(imageArray, width, height)
  }

  draw (): void {
    this.resetContext()
    this.offscreenContext.putImageData(this.imageData, 0, 0)
    this.context.drawImage(this.offscreenCanvas, 0.25, 0.25, 0.5, 0.5)
  }

  resetContext (): void {
    this.context.resetTransform()
    this.context.translate(0, this.canvas.height)
    this.context.scale(this.canvas.width, -this.canvas.height)
    this.context.globalAlpha = 1
    this.context.imageSmoothingEnabled = false
  }
}

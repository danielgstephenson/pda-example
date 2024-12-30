import { vecToPolicy, policyToVec, sqrt3, toValidPolicy, range } from './math/math'
import { Vec2 } from './math/vec2'
import { Policy } from './math/policy'
import { Game } from './game'

export class Player {
  static resolution = 50
  game: Game
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  offscreenCanvas: OffscreenCanvas
  offscreenContext: OffscreenCanvasRenderingContext2D
  produceSpan: HTMLSpanElement
  defendSpan: HTMLSpanElement
  attackSpan: HTMLSpanElement
  payoffSpan: HTMLSpanElement
  index: 1 | 2
  otherIndex: 1 | 2
  drawX = 0.1
  drawY = 0.1
  drawSize = 0.8
  policy = new Policy(1 / 3, 1 / 3, 1 / 3)
  payoff = 0
  maxPay = 1
  minPay = 0

  constructor (game: Game, index: 1 | 2) {
    this.game = game
    this.index = index
    this.otherIndex = index === 1 ? 2 : 1
    this.canvas = document.getElementById(`canvas${this.index}`) as HTMLCanvasElement
    this.canvas.width = 1000
    this.canvas.height = 1000
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.offscreenCanvas = new OffscreenCanvas(Player.resolution, Player.resolution)
    this.offscreenContext = this.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    this.produceSpan = document.getElementById(`produceSpan${this.index}`) as HTMLSpanElement
    this.defendSpan = document.getElementById(`defendSpan${this.index}`) as HTMLSpanElement
    this.attackSpan = document.getElementById(`attackSpan${this.index}`) as HTMLSpanElement
    this.payoffSpan = document.getElementById(`payoffSpan${this.index}`) as HTMLSpanElement
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event))
  }

  getImageData (): ImageData {
    const width = Player.resolution
    const height = Player.resolution
    const otherPolicy = this.game.players[this.otherIndex].policy
    const imageArray = new Uint8ClampedArray(4 * width * height)
    const pixels = range(width * height)
    const payoffs = pixels.map(pixel => {
      const x = (pixel % width + 0.5) / width
      const y = (Math.floor(pixel / width) + 0.5) / height
      const policy = toValidPolicy(vecToPolicy(new Vec2(x, y)))
      return this.game.getPayoff(policy, otherPolicy)
    })
    const maxPay = Math.max(...payoffs)
    const minPay = Math.max(0, Math.min(...payoffs, maxPay - 0.001))
    const payRange = maxPay - minPay
    this.minPay = minPay
    this.maxPay = maxPay
    pixels.forEach(pixel => {
      const index = 4 * pixel
      const level = (payoffs[pixel] - minPay) / payRange
      const green = Math.pow(level, 3)
      const red = Math.pow(green, 5)
      imageArray[index + 0] = red * 255 // R value
      imageArray[index + 1] = green * 255 // G value
      imageArray[index + 2] = 0 // B value
      imageArray[index + 3] = 255 // A value
    })
    return new ImageData(imageArray, width, height)
  }

  draw (): void {
    this.updateText()
    const imageData = this.getImageData()
    this.resetContext()
    this.context.fillStyle = 'white'
    this.context.fillRect(0, 0, 1, 1)
    this.offscreenContext.putImageData(imageData, 0, 0)
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

  updateText (): void {
    this.produceSpan.innerHTML = (this.game.income * this.policy.produce).toFixed(1)
    this.defendSpan.innerHTML = (this.game.income * this.policy.defend).toFixed(1)
    this.attackSpan.innerHTML = (this.game.income * this.policy.attack).toFixed(1)
    this.payoffSpan.innerHTML = this.payoff.toFixed(1)
  }

  drawStrategy (): void {
    if (this.policy == null) return
    this.resetContext()
    const b = policyToVec(this.policy)
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
    const s = vecToPolicy(b)
    if (s.min() < -0.1) return
    this.policy = toValidPolicy(vecToPolicy(b))
    const otherPolicy = this.game.players[this.otherIndex].policy
    this.payoff = this.game.getPayoff(this.policy, otherPolicy)
    console.log('myPolicy', this.policy.toString())
    console.log('otherPolicy', otherPolicy.toString())
    console.log('myPayoff', this.payoff.toFixed(1))
    console.log('payRange', this.minPay.toFixed(1), this.maxPay.toFixed(1))
    this.game.draw()
  }
}
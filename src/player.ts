import { vecToPolicy, policyToVec, sqrt3, toValidPolicy, range } from './math/math'
import { Vec2 } from './math/vec2'
import { Policy } from './math/policy'
import { Game } from './game'

export class Player {
  static resolution = 200
  game: Game
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  offscreenCanvas: OffscreenCanvas
  offscreenContext: OffscreenCanvasRenderingContext2D
  produceSpan: HTMLSpanElement
  defendSpan: HTMLSpanElement
  attackSpan: HTMLSpanElement
  payoffSpan: HTMLSpanElement
  producePurchaseSpan: HTMLSpanElement
  defendPurchaseSpan: HTMLSpanElement
  attackPurchaseSpan: HTMLSpanElement
  labelSpace: HTMLSpanElement
  index: 1 | 2
  otherIndex: 1 | 2
  drawX = 0.0
  drawY = 0.0
  drawSize = 1
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
    this.producePurchaseSpan = document.getElementById(`producePurchaseSpan${this.index}`) as HTMLSpanElement
    this.defendPurchaseSpan = document.getElementById(`defendPurchaseSpan${this.index}`) as HTMLSpanElement
    this.attackPurchaseSpan = document.getElementById(`attackPurchaseSpan${this.index}`) as HTMLSpanElement
    this.labelSpace = document.getElementById(`labelSpace${this.index}`) as HTMLSpanElement
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
    pixels.forEach((pixel, i) => {
      const index = 4 * pixel
      const level = (payoffs[pixel] - minPay) / payRange
      const green = Math.pow(level, 7)
      const red = Math.pow(green, 10)
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
    this.setupCanvas()
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
    const otherPolicy = this.game.players[this.otherIndex].policy
    this.payoff = this.game.getPayoff(this.policy, otherPolicy)
    const produceSpend = this.game.income * this.policy.produce
    const defendSpend = this.game.income * this.policy.defend
    const attackSpend = this.game.income * this.policy.attack
    this.payoffSpan.innerHTML = this.payoff.toFixed(1)
    this.produceSpan.innerHTML = produceSpend.toFixed(1)
    this.defendSpan.innerHTML = defendSpend.toFixed(1)
    this.attackSpan.innerHTML = attackSpend.toFixed(1)
    this.producePurchaseSpan.innerHTML = produceSpend.toFixed(1)
    this.defendPurchaseSpan.innerHTML = defendSpend.toFixed(1)
    this.attackPurchaseSpan.innerHTML = (attackSpend / this.game.attackCost).toFixed(1)
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

  setupCanvas (): void {
    const W = 50
    const H = 0.5 * sqrt3 * W
    this.canvas.style.width = `${W}vmin`
    this.canvas.style.height = `${H}vmin`
    this.labelSpace.style.width = `${W - 10}vmin`
  }

  resetContext (): void {
    this.context.resetTransform()
    this.context.translate(0, this.canvas.height)
    this.context.scale(this.canvas.width, -this.canvas.height * 2 / sqrt3)
    this.context.globalAlpha = 1
    this.context.imageSmoothingEnabled = false
  }

  onMouseDown (event: MouseEvent): void {
    const canvasX = event.offsetX / this.canvas.clientWidth
    const canvasY = 1 - event.offsetY / this.canvas.clientHeight
    const boxX = (canvasX - this.drawX) / this.drawSize
    const boxY = (canvasY - this.drawY) / this.drawSize
    const b = new Vec2(boxX, 0.5 * sqrt3 * boxY)
    const s = vecToPolicy(b)
    if (s.min() < -0.01) return
    this.policy = toValidPolicy(vecToPolicy(b))
    this.game.draw()
  }
}

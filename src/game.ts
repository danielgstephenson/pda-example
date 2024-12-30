import { Player } from './player'

export class Game {
  player1: Player
  player2: Player
  cost = {
    y: 1,
    d: 1,
    a: 1
  }

  constructor () {
    const canvas1 = document.getElementById('leftCanvas') as HTMLCanvasElement
    const canvas2 = document.getElementById('rightCanvas') as HTMLCanvasElement
    this.player1 = new Player(canvas1)
    this.player2 = new Player(canvas2)
  }
}

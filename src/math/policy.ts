export class Policy {
  produce: number
  defend: number
  attack: number

  constructor (produce: number, defend: number, attack: number) {
    this.produce = produce
    this.defend = defend
    this.attack = attack
  }

  min (): number {
    return Math.min(this.produce, this.defend, this.attack)
  }

  toString (): string {
    return `produce: ${this.produce.toFixed(2)}, defend: ${this.defend.toFixed(2)}, attack: ${this.attack.toFixed(2)}`
  }
}

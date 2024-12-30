import { Policy } from './math/policy'
import { Purchase } from './math/purchase'
import { Player } from './player'

export class Game {
  income = 100
  productivity = 1
  defensePower = 2
  attackCost = 2
  defensePowerInput: HTMLInputElement
  attackCostInput: HTMLInputElement
  compositeSpan: HTMLSpanElement
  players: {
    1: Player
    2: Player
  }

  constructor () {
    this.players = {
      1: new Player(this, 1),
      2: new Player(this, 2)
    }
    this.defensePowerInput = document.getElementById('defensePowerInput') as HTMLInputElement
    this.attackCostInput = document.getElementById('attackCostInput') as HTMLInputElement
    this.compositeSpan = document.getElementById('compositeSpan') as HTMLSpanElement
    this.defensePowerInput.value = this.defensePower.toString()
    this.attackCostInput.value = this.attackCost.toString()
    this.defensePowerInput.onchange = () => this.draw()
    this.attackCostInput.onchange = () => this.draw()
    this.draw()
  }

  policyToPurchase (policy: Policy): Purchase {
    const produce = this.income * policy.produce
    const defend = this.income * policy.defend
    const attack = this.income * policy.attack / this.attackCost
    return new Purchase(produce, defend, attack)
  }

  getPayoff (myPolicy: Policy, otherPolicy: Policy): number {
    const myPurchase = this.policyToPurchase(myPolicy)
    const otherPurchase = this.policyToPurchase(otherPolicy)
    const myOutput = this.productivity * myPurchase.produce
    const otherOutput = this.productivity * otherPurchase.produce
    const myDefend = this.defensePower * myPurchase.defend
    const otherDefend = this.defensePower * otherPurchase.defend
    const myAttack = myPurchase.attack
    const otherAttack = otherPurchase.attack
    const myConflict = myDefend + otherAttack
    const otherConflict = otherDefend + myAttack
    const defended = myConflict === 0 ? myOutput : myOutput * myDefend / myConflict
    const seized = otherConflict === 0 ? 0 : otherOutput * myAttack / otherConflict
    return defended + seized
  }

  draw (): void {
    this.defensePower = Number(this.defensePowerInput.value)
    this.attackCost = Number(this.attackCostInput.value)
    this.players[1].draw()
    this.players[2].draw()
    this.compositeSpan.innerHTML = (this.defensePower * this.attackCost).toFixed(3)
  }
}

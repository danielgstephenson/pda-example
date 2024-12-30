import { Spend } from './spend'
import { Vec2 } from './vec2'

export const sqrt3 = Math.sqrt(3)

export function spendToVec (spend: Spend): Vec2 {
  return new Vec2(0.5 * spend.produce + spend.attack, 0.5 * sqrt3 * spend.produce)
}

export function vecToSpend (vec2: Vec2): Spend {
  const produce = 2 / sqrt3 * vec2.y
  const attack = vec2.x - 0.5 * produce
  const defend = 1 - produce - attack
  return new Spend(produce, defend, attack)
}

export function toValidSpend (spend: Spend): Spend {
  if (Math.min(spend.produce, spend.defend, spend.attack) >= 0) return spend
  const produce = Math.max(0, spend.produce)
  const defend = Math.max(0, spend.defend)
  const attack = Math.max(0, spend.attack)
  const sum = produce + defend + attack
  if (sum === 0) return new Spend(1 / 3, 1 / 3, 1 / 3)
  return new Spend(produce / sum, defend / sum, attack / sum)
}

export function round (x: number, digits: number): number {
  return Number(x.toFixed(digits))
}

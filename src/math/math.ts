import { Policy } from './policy'
import { Vec2 } from './vec2'

export const sqrt3 = Math.sqrt(3)

export function policyToVec (spend: Policy): Vec2 {
  return new Vec2(0.5 * spend.produce + spend.attack, 0.5 * sqrt3 * spend.produce)
}

export function vecToPolicy (vec2: Vec2): Policy {
  const produce = 2 / sqrt3 * vec2.y
  const attack = vec2.x - 0.5 * produce
  const defend = 1 - produce - attack
  return new Policy(produce, defend, attack)
}

export function toValidPolicy (spend: Policy): Policy {
  if (Math.min(spend.produce, spend.defend, spend.attack) >= 0) return spend
  const produce = Math.max(0, spend.produce)
  const defend = Math.max(0, spend.defend)
  const attack = Math.max(0, spend.attack)
  const sum = produce + defend + attack
  if (sum === 0) return new Policy(1 / 3, 1 / 3, 1 / 3)
  return new Policy(produce / sum, defend / sum, attack / sum)
}

export function round (x: number, digits: number): number {
  return Number(x.toFixed(digits))
}

export function sum (v: number[]): number {
  let result = 0
  v.forEach(x => {
    result += x
  })
  return result
}

export function mean (v: number[]): number {
  if (v.length === 0) return 0
  return sum(v) / v.length
}

export function range (length: number): number[] {
  return [...Array(length).keys()]
}

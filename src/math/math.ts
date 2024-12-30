import { Vec2 } from './vec2'
import { Vec3 } from './vec3'

export const sqrt3 = Math.sqrt(3)

export function simplexToBox (v: Vec3): Vec2 {
  return new Vec2(0.5 * v.z + v.y, 0.5 * sqrt3 * v.z)
}

export function boxToSimplex (v: Vec2): Vec3 {
  const z = 2 / sqrt3 * v.y
  const y = v.x - 0.5 * z
  const x = 1 - y - z
  return new Vec3(x, y, z)
}

export function roundSimplex (v: Vec3): Vec3 {
  const x = round(v.x, 2)
  const y = round(v.y, 2)
  const z = 1 - x - y
  return new Vec3(x, y, z)
}

export function toInnerSimplex (v: Vec3): Vec3 {
  if (Math.min(v.x, v.y, v.z) >= 0) return v
  const x = Math.max(0, v.x)
  const y = Math.max(0, v.y)
  const z = Math.max(0, v.z)
  const sum = x + y + z
  return new Vec3(x / sum, y / sum, z / sum)
}

export function round (x: number, digits: number): number {
  return Number(x.toFixed(digits))
}

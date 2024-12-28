import { Vec2 } from './vec2'
import { Vec3 } from './vec3'

const sqRt3 = Math.sqrt(3)

export function simplexToBox (v: Vec3): Vec2 {
  return new Vec2(0.5 * v.z + v.y, 0.5 * sqRt3 * v.z)
}

export function boxToSimplex (v: Vec2): Vec3 {
  const z = 2 / sqRt3 * v.y
  const y = v.x - 0.5 * z
  const x = 1 - y - z
  return new Vec3(x, y, z)
}

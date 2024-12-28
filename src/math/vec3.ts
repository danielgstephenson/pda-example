export class Vec3 {
  x: number
  y: number
  z: number

  constructor (x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  static add (v: Vec3, w: Vec3): Vec3 {
    return new Vec3(v.x + w.x, v.y + w.y, v.z + w.z)
  }

  static mul (a: number, v: Vec3): Vec3 {
    return new Vec3(a * v.x, a * v.y, a * v.z)
  }

  static combine (a: number, v: Vec3, b: number, w: Vec3): Vec3 {
    return new Vec3(a * v.x + b * w.x, a * v.y + b * w.y, a * v.z + b * w.z)
  }
}

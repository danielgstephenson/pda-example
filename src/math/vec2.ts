export class Vec2 {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  static add (v: Vec2, w: Vec2): Vec2 {
    return new Vec2(v.x + w.x, v.y + w.y)
  }

  static mul (a: number, v: Vec2): Vec2 {
    return new Vec2(a * v.x, a * v.y)
  }

  static combine (a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    return new Vec2(a * v.x + b * w.x, a * v.y + b * w.y)
  }
}

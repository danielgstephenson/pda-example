import { Triangle } from './triangle'

const canvas1 = document.getElementById('leftCanvas') as HTMLCanvasElement
const canvas2 = document.getElementById('rightCanvas') as HTMLCanvasElement

console.log('hello world')

const triangle1 = new Triangle(canvas1)
const triangle2 = new Triangle(canvas2)

export function difference(a: number, b: number) {
  return Math.abs(a - b)
}

export function clamp(a: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, a))
}

/**
 * @returns a blend between x and y, based on a fraction a
 */
export function lerp(x: number, y: number, a: number) {
  return x * (1 - a) + y * a
}

/**
 * @returns a fraction a, based on a value between x and y
 */
export function invlerp(x: number, y: number, a: number) {
  return clamp((a - x) / (y - x))
}

export function range (x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return lerp(outMin, outMax, invlerp(inMin, inMax, x))
}
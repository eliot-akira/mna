
/**
 * Creates an array of given size, filled with index as values
 *
 * createArray(3): [0, 1, 2]
 */
 export default function createArray(n:(number | string) = 0): number[] {

  if (!n) return []

  const num: number = typeof n==='string' ? parseInt(n, 10) : n
  const arr: number[] = Array.apply(null, Array(num)).map((x, i) => i)

  return arr
}

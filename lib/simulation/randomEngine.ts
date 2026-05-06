// randomEngine.ts

let seed = 1
let tick = 0

export function setSeed(newSeed: number) {
  seed = newSeed
  tick = 0
}

export function nextTick() {
  tick++
}

export function getTick() {
  return tick
}

export function random(): number {
  // LCG (Linear Congruential Generator)
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

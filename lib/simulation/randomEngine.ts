let seed = 123456

export function setSeed(newSeed: number) {
  seed = newSeed
}

export function getSeed() {
  return seed
}

//simple deterministic pseudo-random generator
export function random() {
  seed = (seed * 166425 + 1013904223) % 429467296
  return seed / 429467296
}

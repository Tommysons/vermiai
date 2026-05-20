let cache: any = null
let lastFetch = 0

export async function getCachedPrices(fetcher: () => Promise<any>) {
  const now = Date.now()

  if (cache && now - lastFetch < 30000) {
    return cache
  }

  cache = await fetcher()
  lastFetch = now

  return cache
}

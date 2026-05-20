export async function fetchPrices() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?...')
  return res.json()
}

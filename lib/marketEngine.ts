export async function getMarketPrices() {
  const [btc, eth, sol, ton, bnb, gomining] = await Promise.all([
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    ).then((r) => r.json()),
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    ).then((r) => r.json()),
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    ).then((r) => r.json()),
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd',
    ).then((r) => r.json()),
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    ).then((r) => r.json()),
    fetch('https://api.coingecko.com/api/v3/coins/gomining-token').then((r) =>
      r.json(),
    ),
  ])

  return {
    BTC: btc.bitcoin.usd,
    ETH: eth.ethereum.usd,
    SOL: sol.solana.usd,
    TON: ton['the-open-network'].usd,
    BNB: bnb.binancecoin.usd,

    GOMINING: gomining.market_data.current_price.usd,

    USDC: 1,
  }
}

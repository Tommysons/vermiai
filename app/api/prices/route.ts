export async function GET() {
  const [mainRes, gominingRes] = await Promise.all([
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network,binancecoin&vs_currencies=usd',
      {
        cache: 'no-store',
      },
    ),

    fetch('https://api.coingecko.com/api/v3/coins/gomining-token', {
      cache: 'no-store',
    }),
  ])

  const main = await mainRes.json()
  const gomining = await gominingRes.json()

  console.log(gomining)

  return Response.json({
    BTC: main.bitcoin?.usd ?? 0,
    ETH: main.ethereum?.usd ?? 0,
    SOL: main.solana?.usd ?? 0,
    TON: main['the-open-network']?.usd ?? 0,
    BNB: main.binancecoin?.usd ?? 0,

    USDC: 1,
  })
}

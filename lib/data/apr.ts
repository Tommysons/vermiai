export function getAPR(coin: string) {
  const aprs: Record<string, number> = {
    BTC: 0.02,
    ETH: 0.03,
    SOL: 0.05,
    TON: 0.04,
    BNB: 0.03,
    GOMINING: 0.08,
    USDC: 0,
  }

  return aprs[coin] ?? 0
}

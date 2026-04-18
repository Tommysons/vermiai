import { Event, PortfolioAsset } from './types'

export function applyEvents(
  cash: number,
  assets: PortfolioAsset[],
  events: Event[],
) {
  for (const e of events) {
    if (e.type === 'deposit') {
      cash += e.amount
    }
    if (e.type === 'withdraw') {
      cash = Math.max(0, cash - e.amount)
    }
    if (e.type === 'buy') {
      if (cash >= e.asset.value) {
        cash -= e.asset.value

        assets.push({
          ...e.asset,
          ownedValue: e.asset.value,
          cost: e.asset.value,
        })
      }
    }

    if (e.type == 'sell') {
      const index = assets.findIndex((a) => a.id === e.assetId)

      if (index !== -1) {
        cash += assets[index].ownedValue
        assets.slice(index, 1)
      }
    }
  }
  return { cash, assets }
}

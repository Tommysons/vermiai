import { PortfolioAsset, MaintenanceConfig } from './types'
import { getTotalDiscount } from './maintenance'

export function processAssets(
  assets: PortfolioAsset[],
  maintenance: MaintenanceConfig,
) {
  let income = 0
  const updated = assets.map((asset) => {
    let growth = 0
    if (asset.type === 'miner') {
      const power = asset.computingPower ?? 0
      const efficiency = asset.energyEfficiency ?? 30

      const reward = power * 0.02
      const electricity = ((power * efficiency) / 1000) * 0.1
      const service = power * 0.01

      const discount = getTotalDiscount(maintenance)

      const cost = (electricity + service) * (1 - discount)

      growth = reward - cost
    } else {
      growth = asset.ownedValue * (asset.apr / 12)
    }

    const newValue = Math.max(0, asset.ownedValue + growth)
    income += growth

    return {
      ...asset,
      ownedValue: newValue,
    }
  })
  return { updatedAssets: updated, income }
}

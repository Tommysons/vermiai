// lib/simulation/engine.ts

import {
  Event,
  PortfolioAsset,
  SimulationResult,
  MaintenanceConfig,
} from './types'

import { applyEvents } from './events'
import { processAssets } from './assets'

export function simulate(
  months: number,
  events: Event[],
  maintenance: MaintenanceConfig,
): SimulationResult {
  let cash = 0
  let assets: PortfolioAsset[] = []

  const history: number[] = []
  const incomeHistory: number[] = []

  for (let m = 0; m < months; m++) {
    const monthEvents = events.filter((e) => e.month === m)

    // 1. apply events
    const result = applyEvents(cash, assets, monthEvents)
    cash = result.cash
    assets = result.assets

    // 2. process assets
    const { updatedAssets, income } = processAssets(assets, maintenance)

    assets = updatedAssets

    incomeHistory.push(income)

    // 3. cash growth
    cash += cash * 0.002

    // 4. total
    const totalAssets = assets.reduce((sum, a) => sum + a.ownedValue, 0)

    history.push(cash + totalAssets)
  }

  const finalCapital = cash + assets.reduce((sum, a) => sum + a.ownedValue, 0)

  return {
    history,
    incomeHistory,
    finalCapital,
  }
}

// lib/simulationEngine.ts

export type AssetType = 'miner' | 'earn' | 'crypto' | 'stable'

export type Asset = {
  id: string
  type: AssetType

  value: number

  // mining system
  computingPower?: number // TH
  energyEfficiency?: number // W/TH

  // investment system
  apr: number
}

export type Event =
  | { type: 'deposit'; month: number; amount: number }
  | { type: 'withdraw'; month: number; amount: number }
  | { type: 'buy'; month: number; asset: Asset }
  | { type: 'sell'; month: number; assetId: string }

type PortfolioAsset = Asset & {
  ownedValue: number
  cost: number
}

type State = {
  cash: number
  assets: PortfolioAsset[]
}

export function simulate(months: number, events: Event[]) {
  const state: State = {
    cash: 0,
    assets: [],
  }

  const history: number[] = []
  const incomeHistory: number[] = [] // ✅ NEW

  for (let m = 0; m < months; m++) {
    const monthEvents = events.filter((e) => e.month === m)

    // =========================
    // 1. EVENTS
    // =========================
    for (const e of monthEvents) {
      if (e.type === 'deposit') {
        state.cash += e.amount
      }

      if (e.type === 'withdraw') {
        state.cash = Math.max(0, state.cash - e.amount)
      }

      if (e.type === 'buy') {
        if (state.cash >= e.asset.value) {
          state.cash -= e.asset.value

          state.assets.push({
            ...e.asset,
            ownedValue: e.asset.value,
            cost: e.asset.value,
          })
        }
      }

      if (e.type === 'sell') {
        const index = state.assets.findIndex((a) => a.id === e.assetId)

        if (index !== -1) {
          state.cash += state.assets[index].ownedValue
          state.assets.splice(index, 1)
        }
      }
    }

    // =========================
    // 2. MINING + APR SYSTEM
    // =========================
    let miningIncome = 0

    state.assets = state.assets.map((asset) => {
      let growth = 0

      // 🛠 MINER
      if (asset.type === 'miner') {
        const power = asset.computingPower ?? 0
        const efficiency = asset.energyEfficiency ?? 30

        const baseReward = power * 0.02

        const electricityCost = ((power * efficiency) / 1000) * 0.1

        growth = baseReward - electricityCost
      }

      // 💰 OTHER ASSETS
      if (asset.type !== 'miner') {
        growth = asset.ownedValue * (asset.apr / 12)
      }

      // prevent negative
      asset.ownedValue = Math.max(0, asset.ownedValue + growth)

      miningIncome += growth

      return asset
    })

    // ✅ SAVE MONTHLY INCOME
    incomeHistory.push(miningIncome)

    // =========================
    // 3. CASH SYSTEM
    // =========================
    const cashYield = state.cash * 0.002
    state.cash += cashYield

    // =========================
    // 4. PORTFOLIO VALUE
    // =========================
    const totalAssets = state.assets.reduce((sum, a) => sum + a.ownedValue, 0)

    const total = state.cash + totalAssets
    history.push(total)
  }

  const finalCapital =
    state.cash + state.assets.reduce((sum, a) => sum + a.ownedValue, 0)

  return {
    history,
    finalCapital,
    incomeHistory, // 🔥 IMPORTANT
  }
}

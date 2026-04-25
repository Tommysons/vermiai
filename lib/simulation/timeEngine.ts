import { setSeed } from './randomEngine'
import { simulateMarketDay } from './marketEngine'
import { getAIAdviceV2 } from './aiAdvisorV2'
import { runAIExecution } from './executionEngine'
import { buildPortfolio } from './portfolioEngine'
import { getPortfolioValue } from './valueEngine'

export type SimulationDay = {
  day: number
  portfolio: ReturnType<typeof buildPortfolio>
  value: number
  action: string
  note: string
  execution: ReturnType<typeof runAIExecution>
}

/**
 * Deterministic full market simulation
 * Same seed = same result every time
 */
export function runSimulation(
  days: number,
  seed: number = 12345,
): SimulationDay[] {
  const history: SimulationDay[] = []

  // -----------------------------
  // 1. RESET RANDOM ENGINE
  // -----------------------------
  setSeed(seed)

  // -----------------------------
  // 2. SIMULATION LOOP
  // -----------------------------
  for (let day = 1; day <= days; day++) {
    // Market evolves deterministically
    simulateMarketDay()

    // AI decision based on current state
    const ai = getAIAdviceV2()

    // Execute decision (writes transactions)
    const execution = runAIExecution()

    // Snapshot AFTER execution
    const portfolio = buildPortfolio()
    const value = getPortfolioValue()

    history.push({
      day,
      portfolio,
      value,
      action: ai.action,
      note: ai.reason,
      execution,
    })
  }

  return history
}

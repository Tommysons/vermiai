type RiskState = Record<
  string,
  {
    riskScore: number // 0 = safe, 1 = extreme risk
    lastUpdated: number
  }
>

const STORAGE_KEY = 'vermi_risk_state'

// -----------------------------
// DEFAULT BASELINE
// -----------------------------
const DEFAULT_RISK: RiskState = {
  BTC: { riskScore: 0.2, lastUpdated: Date.now() },
  ETH: { riskScore: 0.4, lastUpdated: Date.now() },
  BNB: { riskScore: 0.4, lastUpdated: Date.now() },
  SOL: { riskScore: 0.6, lastUpdated: Date.now() },
  TON: { riskScore: 0.7, lastUpdated: Date.now() },
  USDC: { riskScore: 0.0, lastUpdated: Date.now() },
}

// -----------------------------
// LOAD
// -----------------------------
function load(): RiskState {
  if (typeof window === 'undefined') return DEFAULT_RISK

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as RiskState) : DEFAULT_RISK
}

// -----------------------------
// SAVE
// -----------------------------
function save(state: RiskState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// GET FULL STATE
// -----------------------------
export function getRiskState(): RiskState {
  return load()
}

// -----------------------------
// GET SINGLE SCORE
// -----------------------------
export function getRiskScore(coin: string): number {
  const state = load()
  return state[coin]?.riskScore ?? 0.5
}

// -----------------------------
// SCORE → LEVEL (for AI)
// -----------------------------
export type DynamicRiskLevel = 'stable' | 'low' | 'medium' | 'high'

export function getDynamicRiskLevel(coin: string): DynamicRiskLevel {
  const score = getRiskScore(coin)

  if (score < 0.15) return 'stable'
  if (score < 0.35) return 'low'
  if (score < 0.65) return 'medium'
  return 'high'
}

// -----------------------------
// UPDATE (CORE ENGINE)
// -----------------------------
export function updateRiskState(updates: Record<string, number>) {
  const current = load()
  const updated: RiskState = { ...current }

  for (const coin in updates) {
    const prev = current[coin] ?? {
      riskScore: 0.5,
      lastUpdated: Date.now(),
    }

    // smooth evolution (prevents spikes)
    const blended = prev.riskScore * 0.7 + updates[coin] * 0.3

    const clamped = Math.max(0, Math.min(1, blended))

    updated[coin] = {
      riskScore: +clamped.toFixed(3),
      lastUpdated: Date.now(),
    }
  }

  save(updated)
}

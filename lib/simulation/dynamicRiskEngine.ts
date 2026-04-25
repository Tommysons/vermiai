type RiskState = Record<
  string,
  {
    riskScore: number // 0 = stable, 1 = extreme risk
    lastUpdated: number
  }
>

const STORAGE_KEY = 'vermi_risk_state'

const DEFAULT_RISK: RiskState = {
  BTC: { riskScore: 0.2, lastUpdated: Date.now() },
  ETH: { riskScore: 0.4, lastUpdated: Date.now() },
  BNB: { riskScore: 0.4, lastUpdated: Date.now() },
  SOL: { riskScore: 0.6, lastUpdated: Date.now() },
  TON: { riskScore: 0.7, lastUpdated: Date.now() },
  USDC: { riskScore: 0.0, lastUpdated: Date.now() },
}

// -----------------------------
function load(): RiskState {
  if (typeof window === 'undefined') return DEFAULT_RISK

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : DEFAULT_RISK
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function save(state: RiskState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
export function getRiskState(): RiskState {
  return load()
}

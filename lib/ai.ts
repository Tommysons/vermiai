export type Insight = {
  label: 'LOW' | 'MEDIUM' | 'HIGH'
  message: string
  recommendation: string
}

export function generateInsight(
  score: number,
  growth: number,
  reinvestRate: number,
): Insight {
  if (score > 75 && reinvestRate > 0.6) {
    return {
      label: 'HIGH',
      message: 'Aggressive compounding strategy detected.',
      recommendation: 'Consider reducing reinvestment to stabilize returns.',
    }
  }

  if (score > 50) {
    return {
      label: 'MEDIUM',
      message: 'Balanced growth strategy.',
      recommendation:
        'You are on a stable path. Slight reinvestment increase could improve results.',
    }
  }

  return {
    label: 'LOW',
    message: 'Weak compounding performance.',
    recommendation:
      'Increase reinvest rate or investment capital to improve growth.',
  }
}

import { random } from './randomEngine'

export type NewsEvent = {
  title: string
  impact: number // -1 to +1
  volatilityBoost: number
  affectedCoins?: string[]
}

let currentNews: NewsEvent | null = null

// -----------------------------
// GENERATE RANDOM NEWS EVENT
// -----------------------------
export function maybeTriggerNews(): NewsEvent | null {
  const roll = random()

  // 15% chance of news per day
  if (roll > 0.15) {
    currentNews = null
    return null
  }

  const events: NewsEvent[] = [
    {
      title: 'Bitcoin ETF approval rumors',
      impact: 0.03,
      volatilityBoost: 0.02,
      affectedCoins: ['BTC'],
    },
    {
      title: 'Major exchange hack reported',
      impact: -0.05,
      volatilityBoost: 0.05,
    },
    {
      title: 'Interest rates increased by Fed',
      impact: -0.02,
      volatilityBoost: 0.03,
    },
    {
      title: 'Crypto adoption surge in Asia',
      impact: 0.04,
      volatilityBoost: 0.02,
    },
    {
      title: 'Whale sells large BTC position',
      impact: -0.04,
      volatilityBoost: 0.04,
      affectedCoins: ['BTC'],
    },
  ]

  currentNews = events[Math.floor(random() * events.length)]
  return currentNews
}

export function getCurrentNews() {
  return currentNews
}

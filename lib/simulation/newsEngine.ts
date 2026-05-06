import { random, getTick } from './randomEngine'

export type NewsEvent = {
  title: string
  impact: number
  volatilityBoost: number
  affectedCoins?: string[]
}

let currentNews: NewsEvent | null = null

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

//fully deterministic news
export function maybeTriggerNews(): NewsEvent | null {
  const tick = getTick()

  //deterministic "chance"
  const roll = random()

  if (roll > 0.15) {
    currentNews = null
    return null
  }

  //deterministic selection based on tick
  const index = Math.floor(((random() + tick * 0.37) % 1) * events.length)

  currentNews = events[index]
  return currentNews
}

export function getCurrentNews() {
  return currentNews
}

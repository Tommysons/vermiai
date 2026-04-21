type Advice = 'buy_miner' | 'stake' | 'hold' | 'compound'

type AIResult = {
  action: Advice
  reason: string
  confidence: number
}

type Input = {
  cash: number
  aprSimpleEarn: number
  minerROI: number
  tokenAPR: number
}

export function getAIAdvice(input: Input): AIResult {
  const { aprSimpleEarn, minerROI, tokenAPR } = input

  if (minerROI > aprSimpleEarn && minerROI > tokenAPR) {
    return {
      action: 'buy_miner',
      reason: 'Minoer ROI is highest',
      confidence: 0.75,
    }
  }
  if (aprSimpleEarn > tokenAPR) {
    return {
      action: 'stake',
      reason: 'Simple Earn gives best stable return',
      confidence: 0.7,
    }
  }
  return {
    action: 'compound',
    reason: 'Token rewards are highest',
    confidence: 0.65,
  }
}

import { AIResult, AIInput } from '../data/types'

function calcConfidence(best: number, a: number, b: number): number {
  const avg = (a + b) / 2
  const diff = best - avg

  if (diff > 20) return 0.9
  if (diff > 10) return 0.8
  if (diff > 5) return 0.7
  return 0.6
}

export function getAIAdvice(input: AIInput): AIResult {
  const { cash, aprSimpleEarn, minerROI, tokenAPR } = input

  //1. no capital -> hold
  if (cash < 50) {
    return {
      action: 'hold',
      reason: 'Not enough cash to make meaningful investment',
      confidence: 0.9,
    }
  }

  const max = Math.max(minerROI, aprSimpleEarn, tokenAPR)

  //2. market too weak -> hold
  if (max < 5) {
    return {
      action: 'hold',
      reason: 'All returns are too low',
      confidence: 0.8,
    }
  }

  //3. Miner best
  if (minerROI === max) {
    return {
      action: 'buy_miner',
      reason: 'Miner ROI is highest',
      confidence: calcConfidence(minerROI, aprSimpleEarn, tokenAPR),
    }
  }

  //4. Stake best
  if (aprSimpleEarn === max) {
    return {
      action: 'stake',
      reason: 'Simple Earn gives best stable return',
      confidence: calcConfidence(aprSimpleEarn, minerROI, tokenAPR),
    }
  }

  //5. token best -> compound
  return {
    action: 'compound',
    reason: 'Token rewards are highest',
    confidence: calcConfidence(tokenAPR, minerROI, aprSimpleEarn),
  }
}

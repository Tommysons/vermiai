'use client'

import { getAPR } from '@/lib/data/apr'

export default function Test() {
  console.log(getAPR('BTC'))
  return <h1>Test</h1>
}

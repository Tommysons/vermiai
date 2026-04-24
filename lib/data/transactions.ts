export type Transaction =
  | {
      id: string
      type: 'buy'
      coin: string
      amount: number
      date: string
    }
  | {
      id: string
      type: 'earn'
      coin: string
      amount: number
      date: string
    }
  | {
      id: string
      type: 'swap'
      from: string
      to: string
      amount: number
      date: string
    }

const STORAGE_KEY = 'vermi_transactions'

function load(): Transaction[] {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as Transaction[]) : []
}

function save(data: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getTransactions(): Transaction[] {
  return load()
}

// IMPORTANT: MUST be explicit per type
export function addTransaction(tx: Omit<Transaction, 'id'>) {
  const current = load()

  const newTx: Transaction = {
    ...tx,
    id: crypto.randomUUID(),
  } as Transaction

  current.push(newTx)
  save(current)
}

export function resetTransactions() {
  save([])
}

export function seedTransactions() {
  save([
    {
      id: crypto.randomUUID(),
      type: 'buy',
      coin: 'USDC',
      amount: 1000,
      date: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'earn',
      coin: 'USDC',
      amount: 50,
      date: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'swap',
      from: 'USDC',
      to: 'BTC',
      amount: 200,
      date: new Date().toISOString(),
    },
  ])
}

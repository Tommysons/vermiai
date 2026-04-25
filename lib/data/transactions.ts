// -----------------------------
// TYPES
// -----------------------------
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

// input type (NO id)
type Base = {
  amount: number
  date: string
}

export type NewTransaction =
  | ({ type: 'buy'; coin: string } & Base)
  | ({ type: 'earn'; coin: string } & Base)
  | ({ type: 'swap'; from: string; to: string } & Base)

// -----------------------------
// STORAGE KEY
// -----------------------------
const STORAGE_KEY = 'vermi_transactions'

// -----------------------------
// LOAD
// -----------------------------
function load(): Transaction[] {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as Transaction[]) : []
}

// -----------------------------
// SAVE
// -----------------------------
function save(data: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// -----------------------------
// GET
// -----------------------------
export function getTransactions(): Transaction[] {
  return load()
}

// -----------------------------
// ADD
// -----------------------------
export function addTransaction(tx: NewTransaction) {
  const current = load()

  const newTx: Transaction = {
    ...tx,
    id: crypto.randomUUID(),
  }

  current.push(newTx)
  save(current)
}

// -----------------------------
// RESET
// -----------------------------
export function resetTransactions() {
  save([])
}

// -----------------------------
// SEED (DEV TEST DATA)
// -----------------------------
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
      type: 'buy',
      coin: 'BTC',
      amount: 500,
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
      to: 'ETH',
      amount: 200,
      date: new Date().toISOString(),
    },
  ])
}

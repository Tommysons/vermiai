export type Investment = {
  coin: string
  amount: number
}

const STORAGE_KEY = 'vermi_investments'

// --------------------
// LOAD
// --------------------
function load(): Investment[] {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// --------------------
// SAVE
// --------------------
function save(data: Investment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// --------------------
// GET
// --------------------
export function getInvestments(): Investment[] {
  return load()
}

// --------------------
// ADD
// --------------------
export function addInvestment(inv: Investment) {
  const current = load()

  const existing = current.find(
    (i) => i.coin.toUpperCase() === inv.coin.toUpperCase(),
  )

  if (existing) {
    existing.amount += inv.amount
  } else {
    current.push(inv)
  }

  save(current)
}

//remove

export function removeInvestment(coin: string, amount: number) {
  const current = load()

  const existing = current.find(
    (i) => i.coin.toUpperCase() === coin.toUpperCase(),
  )

  if (!existing) return
  existing.amount -= amount

  if (existing.amount <= 0) {
    const index = current.indexOf(existing)
    current.splice(index, 1)
  }

  save(current)
}

// --------------------
// RESET
// --------------------
export function resetInvestments() {
  save([])
}

// Local order history. There is no backend Orders API yet (that's a future
// backend module), so placing an order here just records it in this browser
// against the logged-in user's id — enough to make Checkout -> "My Orders"
// feel real while we're focused on the frontend.

const STORAGE_KEY = 'lumora_orders'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function listOrders(userId) {
  return loadAll()
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.placedAt - a.placedAt)
}

export function saveOrder(userId, { items, subtotal, shipping, total, address }) {
  const orders = loadAll()
  const order = {
    id: `LUM-${Date.now().toString().slice(-6)}`,
    userId,
    items,
    subtotal,
    shipping,
    total,
    address,
    status: 'Processing',
    placedAt: Date.now(),
  }
  orders.push(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  return order
}

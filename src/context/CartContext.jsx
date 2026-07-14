import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'lumora_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    const maxQty = product.stock ?? Infinity
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, maxQty) } : i
        )
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: product.stock ?? null,
        qty: Math.min(qty, maxQty),
      }]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, qty) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i
      const maxQty = i.stock ?? Infinity
      return { ...i, qty: Math.max(1, Math.min(qty, maxQty)) }
    }))
  }

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

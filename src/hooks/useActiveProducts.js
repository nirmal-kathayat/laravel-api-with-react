import { useEffect, useState } from 'react'
import { listProducts } from '../lib/products'

/** Fetches the real product catalog and filters to active listings. */
export function useActiveProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listProducts()
      .then((data) => {
        const active = (Array.isArray(data) ? data : []).filter((p) => p.is_active)
        setProducts(active)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}

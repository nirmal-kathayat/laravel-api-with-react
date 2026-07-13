// Calls the Products API (routes/api.php -> Api\ProductController).

import { apiFetch, apiUpload } from './api'

export function listProducts() {
  return apiFetch('/products')
}

export function getProduct(id) {
  return apiFetch(`/products/${id}`)
}

// payload.image, if present, is a File object from an <input type="file">.
function toFormData(payload) {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    if (key === 'is_active') { formData.append(key, value ? '1' : '0'); return }
    formData.append(key, value)
  })

  return formData
}

export function createProduct(payload) {
  return apiUpload('/products', toFormData(payload))
}

export function updateProduct(id, payload) {
  return apiUpload(`/products/${id}`, toFormData(payload), { method: 'PUT' })
}

export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' })
}

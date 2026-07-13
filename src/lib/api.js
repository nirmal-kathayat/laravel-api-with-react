// Thin authenticated fetch wrapper shared by every API call in the app.
// Centralizing this means the token header and error shape only live in one place.

import { getToken, clearSession } from './auth'

const BASE_URL = 'http://localhost:8000/api'

export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) clearSession()

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = res.status
    error.errors = data?.errors || null
    throw error
  }

  return data
}

// For requests that upload a file (multipart/form-data). Laravel only parses
// file uploads on a real POST, so PUT/PATCH are spoofed via a `_method` field
// on a POST request — Laravel's built-in method-override handles the rest.
// Content-Type is deliberately left unset so the browser can add its own
// multipart boundary; setting it manually breaks the upload.
export async function apiUpload(path, formData, { method = 'POST' } = {}) {
  const token = getToken()

  if (method !== 'POST') {
    formData.append('_method', method)
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (res.status === 401) clearSession()

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = res.status
    error.errors = data?.errors || null
    throw error
  }

  return data
}

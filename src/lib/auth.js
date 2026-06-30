// Centralized auth/session helpers.
//
// IMPORTANT: localStorage never expires on its own, so we stamp an explicit
// expiry on login and treat the session as logged-out once it passes. This is
// what stops "still logged in the next day". Keep SESSION_TTL_MS in sync with
// the Sanctum 'expiration' value in homepage_backend/config/sanctum.php.

const TOKEN_KEY  = 'token'
const USER_KEY   = 'user'
const EXPIRY_KEY = 'session_expires_at'

// Session lifetime: 8 hours.
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000

// Where each role lands after login / when redirected away from guest pages.
export const ROLE_HOME = {
  'super admin': '/dashboard/admin',
  'admin':       '/dashboard/admin',
  'customer':    '/',
}

export function roleHome(role) {
  return ROLE_HOME[role] || '/'
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + SESSION_TTL_MS))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(EXPIRY_KEY)
}

export function isSessionExpired() {
  const exp = Number(localStorage.getItem(EXPIRY_KEY))
  if (!exp) return true            // no/invalid stamp → treat as expired
  return Date.now() > exp
}

// Returns the token only if the session is still valid; clears it otherwise.
export function getToken() {
  if (isSessionExpired()) { clearSession(); return null }
  return localStorage.getItem(TOKEN_KEY)
}

// Returns the parsed user only if the session is still valid; clears otherwise.
export function getUser() {
  if (isSessionExpired()) { clearSession(); return null }
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    clearSession()
    return null
  }
}

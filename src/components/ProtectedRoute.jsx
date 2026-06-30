import { Navigate } from 'react-router-dom'
import { getUser } from '../lib/auth'

// Centralized route guard. Replaces the per-page localStorage checks so the
// rule lives in one place and an expired session is always redirected out.
//
// NOTE: this is convenience/UX only — a determined user can edit the role in
// DevTools. Real authorization MUST be enforced on the backend per route
// (Sanctum auth + a role middleware), never trusted from the client.
export default function ProtectedRoute({ allow, children }) {
  const user = getUser()

  if (!user) return <Navigate to="/login" replace />
  if (allow && !allow.includes(user.role)) return <Navigate to="/login" replace />

  return children
}

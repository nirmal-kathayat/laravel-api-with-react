import { Navigate } from 'react-router-dom'
import { getUser, roleHome } from '../lib/auth'

// Guest-only guard: if the user is already logged in (valid session), keep them
// out of /login and /signup and send them to their role's home instead.
export default function GuestRoute({ children }) {
  const user = getUser()
  if (user) return <Navigate to={roleHome(user.role)} replace />
  return children
}

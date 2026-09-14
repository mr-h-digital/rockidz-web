import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireEducator = false, requireAdmin = false }) {
  const { user, hasToken, loading, isAdmin, isEducator } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user || !hasToken) {
    // Remember where they were headed so sign-in can bounce them back —
    // this is what powers the "?action=enroll" deep link from the main site.
    sessionStorage.setItem('rockidz_redirect_after_auth', location.pathname + location.search)
    return <Navigate to="/sign-in" replace />
  }

  if (requireEducator && !isEducator) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

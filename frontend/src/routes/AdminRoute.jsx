/*
 * Purpose: Restricts access to admin-only routes.
 * API Integration: Uses AuthContext user role, which originates from backend auth payloads.
 * State Management: Reads global auth state and role from context.
 * Navigation Flow: Redirects non-admin users to home and unauthenticated users to login.
 * Backend Connection: Backend should assign role='admin' in JWT/profile responses for admin users.
 */
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

function AdminRoute({ children }) {
  const { user, authChecked } = useAuth()

  if (!authChecked) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const normalizedRole = String(user.role || '').toLowerCase().trim()
  if (normalizedRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute

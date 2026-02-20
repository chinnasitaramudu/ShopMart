/*
 * Purpose: Restricts access to authenticated-only routes.
 * API Integration: Relies on AuthContext state set by auth API responses.
 * State Management: Reads user state from global auth context.
 * Navigation Flow: Redirects unauthenticated users to /login while preserving intended path.
 * Backend Connection: Token validity comes from backend JWT auth middleware during API calls.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, authChecked } = useAuth()
  const location = useLocation()

  if (!authChecked) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute

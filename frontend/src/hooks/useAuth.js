/*
 * Purpose: Convenience hook for consuming AuthContext in components.
 * API Integration: API actions are exposed through context methods (login/register/refresh).
 * State Management: Returns current auth state from the shared context provider.
 * Navigation Flow: Route guards and pages use this hook to decide redirects.
 * Backend Connection: Depends on AuthContext which is backed by authApi endpoints.
 */
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => useContext(AuthContext)

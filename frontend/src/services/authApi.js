/*
 * Purpose: Auth API wrappers for login/register/profile endpoints.
 * API Integration: Calls backend /auth routes using shared Axios client.
 * State Management: Returns payloads to AuthContext, which stores user/session state.
 * Navigation Flow: Login/register success lets pages redirect users to intended routes.
 * Backend Connection: Requires backend auth routes (/api/auth/login, /api/auth/register, /api/auth/profile).
 */
import apiClient from './apiClient'

export const authApi = {
  async login(payload) {
    const { data } = await apiClient.post('/auth/login', payload)
    return data
  },
  async register(payload) {
    const { data } = await apiClient.post('/auth/register', payload)
    return data
  },
  async getProfile() {
    const { data } = await apiClient.get('/auth/profile')
    return data
  }
}

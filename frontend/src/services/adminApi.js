/*
 * Purpose: Admin API wrappers for dashboard analytics and product management data.
 * API Integration: Calls backend admin endpoints using JWT-authenticated Axios client.
 * State Management: Admin pages keep API responses in local page state.
 * Navigation Flow: Admin pages consume these APIs under /admin routes.
 * Backend Connection: Requires backend /api/admin/dashboard and /api/products admin routes.
 */
import apiClient from './apiClient'

export const adminApi = {
  async dashboard() {
    const { data } = await apiClient.get('/admin/dashboard')
    return data
  }
}

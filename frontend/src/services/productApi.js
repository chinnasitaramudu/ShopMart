/*
 * Purpose: Product API wrappers for listing, details, and admin CRUD operations.
 * API Integration: Calls /products endpoints and returns parsed response objects.
 * State Management: Pages store returned product data in component state or context.
 * Navigation Flow: Product list/detail pages use these calls before route transitions like cart or checkout.
 * Backend Connection: Connects to backend routes (/api/products and admin-protected CRUD variants).
 */
import apiClient from './apiClient'

export const productApi = {
  async list(params = {}) {
    const { data } = await apiClient.get('/products', { params })
    return data
  },
  async details(id) {
    const { data } = await apiClient.get(`/products/${id}`)
    return data
  },
  async create(payload) {
    const { data } = await apiClient.post('/products', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await apiClient.put(`/products/${id}`, payload)
    return data
  },
  async remove(id) {
    const { data } = await apiClient.delete(`/products/${id}`)
    return data
  }
}

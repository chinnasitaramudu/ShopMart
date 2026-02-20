/*
 * Purpose: Cart API wrappers for user-specific cart management in backend.
 * API Integration: Calls protected /cart endpoints with JWT bearer auth from Axios interceptor.
 * State Management: Used by CartContext to sync cart state with MongoDB per logged-in user.
 * Navigation Flow: Cart and checkout pages consume the synchronized cart state.
 * Backend Connection: Requires backend cart routes under /api/cart.
 */
import apiClient from './apiClient'

export const cartApi = {
  async getMyCart() {
    const { data } = await apiClient.get('/cart')
    return data
  },
  async addItem(payload) {
    const { data } = await apiClient.post('/cart/items', payload)
    return data
  },
  async updateItem(productId, payload) {
    const { data } = await apiClient.put(`/cart/items/${productId}`, payload)
    return data
  },
  async removeItem(productId) {
    const { data } = await apiClient.delete(`/cart/items/${productId}`)
    return data
  },
  async clearCart() {
    const { data } = await apiClient.delete('/cart/clear')
    return data
  }
}

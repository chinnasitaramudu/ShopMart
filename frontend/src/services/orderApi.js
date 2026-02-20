/*
 * Purpose: Order API wrappers for checkout, order history, and mock payment calls.
 * API Integration: Calls backend /orders endpoints and returns order payloads.
 * State Management: Orders pages keep fetched data in local state.
 * Navigation Flow: After successful createOrder/markPaid, UI navigates to Orders page.
 * Backend Connection: Requires backend protected routes under /api/orders.
 */
import apiClient from './apiClient'

export const orderApi = {
  async createOrder(payload) {
    const { data } = await apiClient.post('/orders', payload)
    return data
  },
  async myOrders() {
    const { data } = await apiClient.get('/orders/my-orders')
    return data
  },
  async markPaid(orderId, payload) {
    const { data } = await apiClient.put(`/orders/${orderId}/pay`, payload)
    return data
  }
}

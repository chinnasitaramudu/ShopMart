/*
 * Purpose: Category API wrappers for fetching available category records.
 * API Integration: Calls backend /categories endpoints through shared Axios client.
 * State Management: Admin product page stores category list in local component state.
 * Navigation Flow: Category ids are used in product create/update forms.
 * Backend Connection: Requires backend categories routes under /api/categories.
 */
import apiClient from './apiClient'

export const categoryApi = {
  async list() {
    const { data } = await apiClient.get('/categories')
    return data
  }
}

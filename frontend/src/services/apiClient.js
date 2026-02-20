/*
 * Purpose: Central Axios client for all frontend to backend HTTP calls.
 * API Integration: Reads VITE_API_BASE_URL and adds JWT bearer token to outgoing requests.
 * State Management: Reads auth token from localStorage; does not hold React state itself.
 * Navigation Flow: Errors are surfaced to pages/components, which can redirect based on auth status.
 * Backend Connection: Set VITE_API_BASE_URL in frontend/.env to your backend API root.
 */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopsmart_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getApiErrorMessage = (error) => {
  if (!error?.response) {
    return 'Cannot connect to backend API. Start backend on http://localhost:5000 and verify CORS/URL.'
  }
  return error?.response?.data?.message || error?.message || 'Something went wrong'
}

export default apiClient

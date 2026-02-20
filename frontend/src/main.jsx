/*
 * Purpose: React entry point that mounts ShopSmart app with MUI theme, router, global providers, and toast layer.
 * API Integration: Network calls are not made here; Axios services are consumed inside page components and contexts.
 * State Management: AuthProvider and CartProvider expose global state for authentication and cart operations.
 * Navigation Flow: BrowserRouter enables route-based page transitions defined in AppRouter.
 * Backend Connection: Ensure VITE_API_BASE_URL in .env points to backend /api (example: http://localhost:5000/api).
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import App from './app/App'
import { appTheme } from './theme/theme'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

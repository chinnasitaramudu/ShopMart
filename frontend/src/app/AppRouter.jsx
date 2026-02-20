/*
 * Purpose: Defines all ShopSmart routes (shop, auth, cart/orders, checkout, and admin).
 * API Integration: Route components fetch data from backend via Axios services.
 * State Management: ProtectedRoute and AdminRoute depend on AuthContext user state.
 * Navigation Flow: Users move between public, protected, and admin-only paths through React Router.
 * Backend Connection: Components under each route call backend endpoints like /products, /auth, /orders, /admin.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../routes/ProtectedRoute'
import AdminRoute from '../routes/AdminRoute'
import HomePage from '../pages/shop/HomePage'
import ProductListPage from '../pages/shop/ProductListPage'
import ProductDetailsPage from '../pages/shop/ProductDetailsPage'
import CartPage from '../pages/shop/CartPage'
import CheckoutPage from '../pages/shop/CheckoutPage'
import OrdersPage from '../pages/shop/OrdersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminProductManagementPage from '../pages/admin/AdminProductManagementPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <AdminRoute>
              <AdminProductManagementPage />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter

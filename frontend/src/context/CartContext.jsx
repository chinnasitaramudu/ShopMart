/*
 * Purpose: Global cart state with user-isolated backend synchronization.
 * API Integration: Logged-in users read/write cart through /api/cart endpoints; guests use localStorage.
 * State Management: React context stores items and totals; source-of-truth is backend cart for authenticated users.
 * Navigation Flow: Navbar badge, product cards, cart, and checkout pages consume this shared state.
 * Backend Connection: Cart model is linked to userId, so each authenticated user has an independent cart.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { cartApi } from '../services/cartApi'
import { getApiErrorMessage } from '../services/apiClient'
import { AuthContext } from './AuthContext'

export const CartContext = createContext(null)

const GUEST_CART_KEY = 'shopsmart_cart_guest'

const mapBackendItemsToUiItems = (items = []) => {
  return items.map((item) => ({
    product: item.product?._id || item.product,
    name: item.product?.title || item.product?.name || item.title || item.name || 'Product',
    image: item.product?.image || item.product?.images?.[0] || item.image || '',
    price: item.product?.price ?? item.price ?? 0,
    stock: item.product?.stock ?? item.stock ?? 99,
    qty: item.quantity ?? item.qty ?? 1
  }))
}

export function CartProvider({ children }) {
  const { user, token, authChecked } = useContext(AuthContext)
  const userCartKey = user?._id ? `shopsmart_cart_${user._id}` : GUEST_CART_KEY
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(GUEST_CART_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const isLoggedIn = Boolean(user && token)

  const saveLocalCart = (nextItems) => {
    localStorage.setItem(userCartKey, JSON.stringify(nextItems))
    setItems(nextItems)
  }

  const loadLocalCart = () => {
    const saved = localStorage.getItem(userCartKey)
    setItems(saved ? JSON.parse(saved) : [])
  }

  const syncFromBackend = async () => {
    try {
      const response = await cartApi.getMyCart()
      const nextItems = mapBackendItemsToUiItems(response.data.items)
      saveLocalCart(nextItems)
    } catch (error) {
      // Fallback to user-scoped local cache when backend fetch fails.
      console.warn('Cart sync failed:', getApiErrorMessage(error))
      loadLocalCart()
    }
  }

  useEffect(() => {
    if (!authChecked) return

    if (isLoggedIn) {
      syncFromBackend()
      return
    }

    loadLocalCart()
  }, [authChecked, isLoggedIn, user?._id])

  useEffect(() => {
    localStorage.setItem(userCartKey, JSON.stringify(items))
  }, [items, userCartKey])

  const addItem = async (product) => {
    if (isLoggedIn) {
      try {
        const response = await cartApi.addItem({ productId: product._id, quantity: 1 })
        setItems(mapBackendItemsToUiItems(response.data.items))
        toast.success(`${product.title || product.name} added to cart`)
      } catch (error) {
        toast.error(getApiErrorMessage(error))
      }
      return
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product === product._id)
      if (existing) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, qty: Math.min(item.qty + 1, product.stock || 99) }
            : item
        )
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.title || product.name,
          image: product.image || product.images?.[0] || '',
          price: product.price,
          stock: product.stock || 99,
          qty: 1
        }
      ]
    })
    toast.success(`${product.title || product.name} added to cart`)
  }

  const updateQty = async (productId, qty) => {
    const normalizedQty = Math.max(1, Number(qty) || 1)

    if (isLoggedIn) {
      try {
        const response = await cartApi.updateItem(productId, { quantity: normalizedQty })
        setItems(mapBackendItemsToUiItems(response.data.items))
      } catch (error) {
        toast.error(getApiErrorMessage(error))
      }
      return
    }

    setItems((prev) =>
      prev.map((item) => (item.product === productId ? { ...item, qty: normalizedQty } : item))
    )
  }

  const removeItem = async (productId) => {
    if (isLoggedIn) {
      try {
        const response = await cartApi.removeItem(productId)
        setItems(mapBackendItemsToUiItems(response.data.items))
      } catch (error) {
        toast.error(getApiErrorMessage(error))
      }
      return
    }

    setItems((prev) => prev.filter((item) => item.product !== productId))
  }

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await cartApi.clearCart()
      } catch (error) {
        console.warn('Failed to clear backend cart:', getApiErrorMessage(error))
      }
    }
    setItems([])
  }

  const totals = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0)
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0)
    return { count, subtotal: Number(subtotal.toFixed(2)) }
  }, [items])

  const value = useMemo(
    () => ({ items, ...totals, addItem, updateQty, removeItem, clearCart, refreshCart: syncFromBackend }),
    [items, totals, isLoggedIn]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

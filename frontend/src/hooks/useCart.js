/*
 * Purpose: Convenience hook for consuming CartContext in components.
 * API Integration: Checkout components use cart state to build API payloads.
 * State Management: Reads and updates centralized cart state.
 * Navigation Flow: Enables cart badge updates and cart/checkout interactions across routes.
 * Backend Connection: Works with order API payload structure for backend checkout.
 */
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export const useCart = () => useContext(CartContext)

/*
 * Purpose: Checkout page collecting address and payment option, then placing order.
 * API Integration: Sends order payload to orderApi.createOrder and follows with mock payment call.
 * State Management: Local form/processing state plus cart context for order items.
 * Navigation Flow: On success clears cart and navigates to Orders page.
 * Backend Connection: Requires protected /api/orders create and /api/orders/:id/pay endpoints.
 */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { useCart } from '../../hooks/useCart'
import { orderApi } from '../../services/orderApi'
import { formatCurrency } from '../../utils/format'

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'cod'
  })

  const pricing = useMemo(() => {
    const shippingPrice = subtotal > 600 ? 0 : 40
    const taxPrice = Math.round(subtotal * 0.05)
    const totalPrice = subtotal + shippingPrice + taxPrice
    return { shippingPrice, taxPrice, totalPrice }
  }, [subtotal])

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    if (!items.length) {
      setError('Cart is empty. Please add items before placing order.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const createResponse = await orderApi.createOrder({
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      })

      if (form.paymentMethod === 'mock') {
        await orderApi.markPaid(createResponse.data._id, { status: 'COMPLETED' })
      }

      clearCart()
      await refreshCart()
      toast.success('Order placed successfully')
      navigate('/orders')
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>Delivery and Payment</Typography>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        <Stack component="form" spacing={1.7} onSubmit={handlePlaceOrder}>
          <TextField label="Address" required value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField fullWidth label="City" required value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            <TextField fullWidth label="Postal code" required value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
          </Stack>
          <TextField label="Country" required value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
          <TextField
            select
            label="Payment method"
            value={form.paymentMethod}
            onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
          >
            <MenuItem value="cod">Cash on Delivery</MenuItem>
            <MenuItem value="mock">Mock Online Payment</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Placing order...' : 'Place Order'}
          </Button>
        </Stack>
      </Card>

      <Card sx={{ p: 2.5, borderRadius: 3, height: 'fit-content' }}>
        <Typography variant="h6" mb={2}>Order Summary</Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between"><Typography>Items</Typography><Typography>{formatCurrency(subtotal)}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between"><Typography>Shipping</Typography><Typography>{formatCurrency(pricing.shippingPrice)}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between"><Typography>Tax</Typography><Typography>{formatCurrency(pricing.taxPrice)}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>Total</Typography><Typography fontWeight={700}>{formatCurrency(pricing.totalPrice)}</Typography></Stack>
        </Stack>
      </Card>
    </Box>
  )
}

export default CheckoutPage

/*
 * Purpose: User order history page showing past purchases and payment/shipping status.
 * API Integration: Calls orderApi.myOrders from protected backend endpoint.
 * State Management: Local loading and orders state.
 * Navigation Flow: Displays history after checkout and from navbar profile navigation.
 * Backend Connection: Requires authenticated GET /api/orders/my-orders endpoint.
 */
import { useEffect, useState } from 'react'
import { Card, Chip, Stack, Typography } from '@mui/material'
import EmptyState from '../../components/common/EmptyState'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import { orderApi } from '../../services/orderApi'
import { formatCurrency, formatDate } from '../../utils/format'

function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const response = await orderApi.myOrders()
        setOrders(response.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) return <ProductSkeletonGrid count={3} />
  if (!orders.length) {
    return (
      <EmptyState
        emoji="📦"
        title="No orders yet"
        description="Your placed orders will appear here."
      />
    )
  }

  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <Card key={order._id} sx={{ p: 2.2, borderRadius: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1.2}
          >
            <Stack spacing={0.5}>
              <Typography fontWeight={700}>Order #{order._id}</Typography>
              <Typography variant="body2" color="text.secondary">{formatDate(order.createdAt)}</Typography>
            </Stack>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Typography fontWeight={600}>{formatCurrency(order.totalPrice)}</Typography>
              <Chip size="small" color={order.isPaid ? 'success' : 'default'} label={order.isPaid ? 'Paid' : 'Pending'} />
              <Chip size="small" label={order.status} />
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}

export default OrdersPage

/*
 * Purpose: Shopping cart page with quantity controls, item removal, and order summary.
 * API Integration: No direct API call here; proceeds to checkout where order API is called.
 * State Management: Uses CartContext for cart items and subtotal calculations.
 * Navigation Flow: Users can continue shopping or proceed to checkout route.
 * Backend Connection: Cart payload is converted to backend orderItems format during checkout.
 */
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EmptyState from '../../components/common/EmptyState'
import QuantityControl from '../../components/common/QuantityControl'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/format'

function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal, updateQty, removeItem } = useCart()

  if (!items.length) {
    return (
      <EmptyState
        emoji="🧺"
        title="Your cart is empty"
        description="Add fresh groceries to get started."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    )
  }

  const deliveryFee = subtotal > 600 ? 0 : 40
  const total = subtotal + deliveryFee

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
      <Stack spacing={1.2}>
        {items.map((item) => (
          <Card key={item.product} sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  component="img"
                  src={item.image || 'https://source.unsplash.com/300x300/?grocery'}
                  alt={item.name}
                  sx={{ width: 72, height: 72, borderRadius: 2, objectFit: 'cover' }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{formatCurrency(item.price)}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <QuantityControl
                  value={item.qty}
                  onDecrease={() => updateQty(item.product, Math.max(1, item.qty - 1))}
                  onIncrease={() => updateQty(item.product, Math.min(item.stock, item.qty + 1))}
                />
                <IconButton color="error" onClick={() => removeItem(item.product)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Card sx={{ p: 2.5, borderRadius: 3, height: 'fit-content' }}>
        <Typography variant="h6" mb={2}>Price Summary</Typography>
        <Stack spacing={1.1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>{formatCurrency(subtotal)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Delivery fee</Typography>
            <Typography>{deliveryFee ? formatCurrency(deliveryFee) : 'Free'}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700}>{formatCurrency(total)}</Typography>
          </Stack>
          <Button variant="contained" size="large" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </Stack>
      </Card>
    </Box>
  )
}

export default CartPage

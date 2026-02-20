/*
 * Purpose: Reusable quantity selector used in cart and checkout item lists.
 * API Integration: Updated quantity impacts order payload sent to backend checkout API.
 * State Management: Controlled component that receives current value and emits changes.
 * Navigation Flow: Helps users adjust quantities before moving to checkout.
 * Backend Connection: Quantity values should be included in orderItems qty fields.
 */
import { IconButton, Stack, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

function QuantityControl({ value, onDecrease, onIncrease }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <IconButton size="small" onClick={onDecrease}><RemoveIcon fontSize="small" /></IconButton>
      <Typography minWidth={24} textAlign="center">{value}</Typography>
      <IconButton size="small" onClick={onIncrease}><AddIcon fontSize="small" /></IconButton>
    </Stack>
  )
}

export default QuantityControl

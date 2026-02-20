/*
 * Purpose: Compact rating visualization used in product cards and product details.
 * API Integration: Uses rating values returned from product API payloads.
 * State Management: Stateless display based on rating prop.
 * Navigation Flow: Improves product discoverability before navigation to details/cart.
 * Backend Connection: Ensure backend products include numeric rating field.
 */
import { Box, Rating, Typography } from '@mui/material'

function RatingStars({ rating }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Rating value={Number(rating || 0)} precision={0.1} readOnly size="small" />
      <Typography variant="caption" color="text.secondary">
        {Number(rating || 0).toFixed(1)}
      </Typography>
    </Box>
  )
}

export default RatingStars

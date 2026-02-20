/*
 * Purpose: Empty-state panel used for no products, empty cart, and no orders scenarios.
 * API Integration: Rendered when API returns empty arrays or local cart is empty.
 * State Management: Driven by parent component state/props.
 * Navigation Flow: Optional CTA helps users move back into active shopping paths.
 * Backend Connection: Works with backend responses returning empty datasets.
 */
import { Box, Button, Typography } from '@mui/material'

function EmptyState({ emoji = '🛒', title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        p: 4,
        borderRadius: 3,
        backgroundColor: '#fff',
        border: '1px dashed #c9ddcf'
      }}
    >
      <Typography fontSize={48} mb={1}>{emoji}</Typography>
      <Typography variant="h6" mb={0.8}>{title}</Typography>
      <Typography color="text.secondary" mb={2}>{description}</Typography>
      {actionLabel ? <Button variant="contained" onClick={onAction}>{actionLabel}</Button> : null}
    </Box>
  )
}

export default EmptyState

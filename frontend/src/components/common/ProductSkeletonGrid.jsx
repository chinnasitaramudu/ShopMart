/*
 * Purpose: Skeleton shimmer grid used while product API calls are loading.
 * API Integration: Displayed during pending state before products API resolves.
 * State Management: Controlled by loading flags in parent pages.
 * Navigation Flow: Keeps layout stable during route transitions to product-heavy pages.
 * Backend Connection: Independent placeholder shown while waiting for backend responses.
 */
import { Box } from '@mui/material'
import Grid2 from '@mui/material/Grid2'

function ProductSkeletonGrid({ count = 8 }) {
  return (
    <Grid2 container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid2 key={i} size={{ xs: 6, md: 3 }}>
          <Box className="shimmer" sx={{ borderRadius: 3, height: 260 }} />
        </Grid2>
      ))}
    </Grid2>
  )
}

export default ProductSkeletonGrid


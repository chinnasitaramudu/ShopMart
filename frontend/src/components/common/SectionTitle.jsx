/*
 * Purpose: Reusable section heading block with title and subtitle for visual consistency.
 * API Integration: No direct API calls; used by API-driven and static sections.
 * State Management: Stateless presentational component.
 * Navigation Flow: Helps users understand section progression in shopping journey.
 * Backend Connection: Independent from backend; purely UI structure.
 */
import { Stack, Typography } from '@mui/material'

function SectionTitle({ title, subtitle }) {
  return (
    <Stack spacing={0.4} sx={{ mb: 2 }}>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Stack>
  )
}

export default SectionTitle

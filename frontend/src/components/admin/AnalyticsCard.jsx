/*
 * Purpose: Compact KPI card used in admin dashboard analytics section.
 * API Integration: Displays values returned from admin analytics API.
 * State Management: Purely prop-driven from parent dashboard state.
 * Navigation Flow: Helps admins scan operational metrics before drilling into pages.
 * Backend Connection: Expects aggregated counts/revenue from backend /admin/dashboard endpoint.
 */
import { Card, CardContent, Stack, Typography } from '@mui/material'

function AnalyticsCard({ title, value, accent = '#2e7d32' }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={0.4}>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: accent }}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCard

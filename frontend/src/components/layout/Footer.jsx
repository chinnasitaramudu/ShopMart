/*
 * Purpose: Production-style footer with company info, quick links, and social icons.
 * API Integration: Static component, no direct API calls.
 * State Management: Stateless presentation component.
 * Navigation Flow: Provides quick route links for easier browsing.
 * Backend Connection: No backend dependency; informational and navigational only.
 */
import { Box, Container, IconButton, Link, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import XIcon from '@mui/icons-material/X'
import InstagramIcon from '@mui/icons-material/Instagram'

function Footer() {
  return (
    <Box sx={{ mt: 6, py: 5, backgroundColor: '#123523', color: '#e3f2e7' }}>
      <Container maxWidth="xl">
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              ShopSmart Grocery
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Farm-fresh groceries delivered in minutes. Trusted quality, low prices, and quick delivery.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Company</Typography>
            <Stack spacing={0.6}>
              <Link href="#" color="inherit" underline="hover">About Us</Link>
              <Link href="#" color="inherit" underline="hover">Careers</Link>
              <Link href="#" color="inherit" underline="hover">Support</Link>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Follow Us</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: '#e3f2e7' }}><FacebookOutlinedIcon /></IconButton>
              <IconButton sx={{ color: '#e3f2e7' }}><InstagramIcon /></IconButton>
              <IconButton sx={{ color: '#e3f2e7' }}><XIcon /></IconButton>
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  )
}

export default Footer


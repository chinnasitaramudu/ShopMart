/*
 * Purpose: Shared shell wrapping all pages with navbar, footer, and route outlet.
 * API Integration: No direct API calls; nested pages perform data fetching.
 * State Management: Reads global cart/auth state indirectly through child components.
 * Navigation Flow: Outlet renders the active route while maintaining consistent top/bottom layout.
 * Backend Connection: Child pages call backend APIs through shared service modules.
 */
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, flex: 1 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  )
}

export default MainLayout

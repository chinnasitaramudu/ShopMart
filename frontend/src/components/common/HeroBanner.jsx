/*
 * Purpose: Hero section highlighting grocery promotions, delivery speed, and CTA buttons.
 * API Integration: CTA navigates users to Product List where API-driven catalog is loaded.
 * State Management: Stateless component driven by props and route navigation.
 * Navigation Flow: Buttons move users to shopping and cart flows.
 * Backend Connection: Product browsing route consumes backend product APIs.
 */
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function HeroBanner() {
  const navigate = useNavigate()

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="hero-gradient"
      sx={{
        color: '#fff',
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Stack spacing={2} maxWidth={620}>
        <Chip
          icon={<BoltOutlinedIcon sx={{ color: '#fff !important' }} />}
          label="Mega Grocery Weekend Sale"
          sx={{ width: 'fit-content', backgroundColor: 'rgba(255,255,255,.2)', color: '#fff' }}
        />
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 46 }, lineHeight: 1.1 }}>
          Fresh groceries delivered in 10 minutes
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.95 }}>
          Flat 30% off on vegetables, fruits and dairy. Limited-time festive grocery deals.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/products')}>
            Shop Now
          </Button>
          <Button
            variant="outlined"
            sx={{ color: '#fff', borderColor: '#fff' }}
            startIcon={<LocalShippingOutlinedIcon />}
            onClick={() => navigate('/cart')}
          >
            Track Cart
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default HeroBanner

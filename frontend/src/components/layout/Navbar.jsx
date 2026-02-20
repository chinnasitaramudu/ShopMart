/*
 * Purpose: Responsive grocery navbar with brand logo, location selector, search, auth actions, and cart badge.
 * API Integration: Search query flows to Product List route where products API is called.
 * State Management: Uses AuthContext and CartContext for login state and live cart count.
 * Navigation Flow: Buttons navigate users to products/cart/login/orders/admin pages.
 * Backend Connection: Auth and cart-backed pages trigger backend APIs after navigation.
 */
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { count } = useCart()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Hyderabad')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <AppBar position="sticky" color="inherit" sx={{ borderBottom: '1px solid #e5eee7' }}>
      <Toolbar sx={{ py: 1, gap: 2, flexWrap: 'wrap' }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: 0.2
          }}
        >
          ShopSmart
        </Typography>

        <Button
          startIcon={<PlaceOutlinedIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ borderRadius: 10, backgroundColor: '#e9f6ec', px: 2 }}
        >
          {location}
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi'].map((city) => (
            <MenuItem
              key={city}
              onClick={() => {
                setLocation(city)
                setAnchorEl(null)
              }}
            >
              {city}
            </MenuItem>
          ))}
        </Menu>

        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', md: 240 },
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.6,
            borderRadius: 99,
            boxShadow: '0 4px 14px rgba(21,71,45,.08)'
          }}
        >
          <InputBase
            placeholder="Search vegetables, fruits, dairy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton type="submit" color="primary">
            <SearchIcon />
          </IconButton>
        </Paper>

        <Stack direction="row" spacing={1.2} alignItems="center">
          {user ? (
            <>
              <Button onClick={() => navigate('/orders')}>{user.name}</Button>
              {user.role === 'admin' && (
                <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
                  Admin
                </Button>
              )}
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<PersonOutlineIcon />}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}

          <IconButton color="primary" onClick={() => navigate('/cart')}>
            <Badge badgeContent={count} color="secondary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

/*
 * Purpose: Login page for existing users with form validation and session creation.
 * API Integration: Calls AuthContext login(), which triggers POST /auth/login through authApi.
 * State Management: Local form/error state + global auth context state.
 * Navigation Flow: Redirects to intended route (or home) after successful login.
 * Backend Connection: Backend must return token/user payload from /api/auth/login.
 */
import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const redirectTo = location.state?.from || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError('')
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="72vh">
      <Card sx={{ width: '100%', maxWidth: 460, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" mb={1}>Welcome back</Typography>
          <Typography color="text.secondary" mb={3}>Login to continue grocery shopping.</Typography>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>

          <Typography mt={2} variant="body2">
            New to ShopSmart? <Link component={RouterLink} to="/register">Create account</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage

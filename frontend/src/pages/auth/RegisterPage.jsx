/*
 * Purpose: Registration page for new customers to create authenticated accounts.
 * API Integration: Calls AuthContext register(), which invokes POST /auth/register.
 * State Management: Local form/error state with global auth context updates on success.
 * Navigation Flow: On successful signup user is redirected to home.
 * Backend Connection: Backend /api/auth/register should return token + user object.
 */
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      setError('')
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="72vh">
      <Card sx={{ width: '100%', maxWidth: 500, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" mb={1}>Create account</Typography>
          <Typography color="text.secondary" mb={3}>Start ordering fresh groceries in minutes.</Typography>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField label="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
            <TextField label="Confirm password" type="password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} required />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Stack>

          <Typography mt={2} variant="body2">
            Already have an account? <Link component={RouterLink} to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterPage

/*
 * Purpose: Admin dashboard page with sidebar, analytics cards, and quick operational insights.
 * API Integration: Calls adminApi.dashboard; falls back to computed mock stats if API fails.
 * State Management: Local loading and dashboard data state.
 * Navigation Flow: Sidebar enables switching between dashboard and product management routes.
 * Backend Connection: Requires authenticated admin endpoint GET /api/admin/dashboard.
 */
import { useEffect, useState } from 'react'
import { Box, Card, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AnalyticsCard from '../../components/admin/AnalyticsCard'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import { adminApi } from '../../services/adminApi'
import { mockProducts } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const response = await adminApi.dashboard()
        setData(response.data)
      } catch {
        const totalRevenue = mockProducts.reduce((sum, item) => sum + item.price * 8, 0)
        setData({
          counts: { users: 240, products: mockProducts.length, orders: 189, categories: 6 },
          revenue: { total: totalRevenue },
          recentOrders: [
            { _id: 'A1001', user: { name: 'Rahul' }, totalPrice: 840, status: 'processing' },
            { _id: 'A1002', user: { name: 'Anitha' }, totalPrice: 640, status: 'delivered' }
          ],
          lowStockProducts: mockProducts.slice(0, 4).map((p) => ({ ...p, stock: 6 }))
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <Grid2 container spacing={2.2}>
      <Grid2 size={{ xs: 12, md: 3 }}>
        <AdminSidebar />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
        {loading ? (
          <ProductSkeletonGrid count={4} />
        ) : (
          <Stack spacing={2.2}>
            <Grid2 container spacing={1.5}>
              <Grid2 size={{ xs: 6, md: 3 }}><AnalyticsCard title="Users" value={data.counts.users} /></Grid2>
              <Grid2 size={{ xs: 6, md: 3 }}><AnalyticsCard title="Products" value={data.counts.products} /></Grid2>
              <Grid2 size={{ xs: 6, md: 3 }}><AnalyticsCard title="Orders" value={data.counts.orders} /></Grid2>
              <Grid2 size={{ xs: 6, md: 3 }}><AnalyticsCard title="Revenue" value={formatCurrency(data.revenue.total)} /></Grid2>
            </Grid2>

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Card sx={{ p: 2.2, borderRadius: 3 }}>
                  <Typography variant="h6" mb={1.5}>Recent orders</Typography>
                  <Stack spacing={1.2}>
                    {data.recentOrders.map((item) => (
                      <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.2, borderRadius: 2, backgroundColor: '#f6faf7' }}>
                        <Typography>{item._id} - {item.user?.name || 'Guest'}</Typography>
                        <Typography fontWeight={600}>{formatCurrency(item.totalPrice)}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <Card sx={{ p: 2.2, borderRadius: 3 }}>
                  <Typography variant="h6" mb={1.5}>Low stock alerts</Typography>
                  <Stack spacing={1.2}>
                    {data.lowStockProducts.map((item) => (
                      <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>{item.name}</Typography>
                        <Typography color="error.main">{item.stock} left</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid2>
            </Grid2>
          </Stack>
        )}
      </Grid2>
    </Grid2>
  )
}

export default AdminDashboardPage


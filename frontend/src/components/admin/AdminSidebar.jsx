/*
 * Purpose: Admin navigation sidebar for dashboard and product management modules.
 * API Integration: No direct API calls; selected admin pages trigger API fetches.
 * State Management: Stateless component driven by current route.
 * Navigation Flow: Provides quick route transitions within admin area.
 * Backend Connection: Admin pages behind these links consume protected backend admin endpoints.
 */
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { useLocation, useNavigate } from 'react-router-dom'

const LINKS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Products', path: '/admin/products', icon: <Inventory2OutlinedIcon /> }
]

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Paper sx={{ p: 1.2, borderRadius: 3 }}>
      <List>
        {LINKS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}

export default AdminSidebar

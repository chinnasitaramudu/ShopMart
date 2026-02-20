/*
 * Purpose: Admin product management page for CRUD operations on catalog inventory.
 * API Integration: Uses productApi list/create/update/remove endpoints for full product administration.
 * State Management: Local form state + local products collection with loading/editing flags.
 * Navigation Flow: Accessed from admin sidebar and kept inside admin route guard.
 * Backend Connection: Requires admin-protected product endpoints under /api/products.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import toast from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import { mockProducts } from '../../data/mockData'
import { categoryApi } from '../../services/categoryApi'
import { productApi } from '../../services/productApi'
import { formatCurrency } from '../../utils/format'

const initialForm = {
  name: '',
  price: '',
  stock: '',
  category: '',
  imageUrl: ''
}

function AdminProductManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        productApi.list({ limit: 100 }),
        categoryApi.list()
      ])

      const loadedProducts = productsResponse.data || []
      const loadedCategories = categoriesResponse.data || []

      setProducts(loadedProducts)
      setCategories(loadedCategories)
      setForm((previous) => ({
        ...previous,
        category: previous.category || loadedCategories[0]?._id || ''
      }))
    } catch {
      setProducts(mockProducts)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const submitLabel = useMemo(() => (editingId ? 'Update product' : 'Create product'), [editingId])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      title: form.name,
      description: `${form.name} premium grocery product`,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.imageUrl || 'https://source.unsplash.com/300x300/?grocery'
    }

    try {
      setSaving(true)
      setError('')
      if (!payload.category) {
        throw new Error('Please select a valid category.')
      }

      if (editingId) {
        await productApi.update(editingId, payload)
        toast.success('Product updated')
      } else {
        await productApi.create(payload)
        toast.success('Product created')
      }
      setForm((previous) => ({
        ...initialForm,
        category: categories[0]?._id || ''
      }))
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || product.category || categories[0]?._id || '',
      imageUrl: product.images?.[0] || ''
    })
  }

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id)
      toast.success('Product removed')
      await loadData()
    } catch {
      setProducts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Removed from local list')
    }
  }

  return (
    <Grid2 container spacing={2.2}>
      <Grid2 size={{ xs: 12, md: 3 }}>
        <AdminSidebar />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Typography variant="h4" mb={2}>Admin Product Management</Typography>

        <Card sx={{ p: 2.2, borderRadius: 3, mb: 2.2 }}>
          <Typography variant="h6" mb={1.5}>{submitLabel}</Typography>
          {error ? <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert> : null}
          {!categories.length ? (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              No categories found. Create at least one category first, then add products.
            </Alert>
          ) : null}
          <Stack component="form" spacing={1.2} onSubmit={handleSubmit}>
            <TextField label="Product name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
              <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required fullWidth />
              <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required fullWidth />
            </Stack>
            <TextField select label="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={saving || !categories.length}>{saving ? 'Saving...' : submitLabel}</Button>
              {editingId ? <Button variant="outlined" onClick={() => { setEditingId(null); setForm({ ...initialForm, category: categories[0]?._id || '' }) }}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: 2.2, borderRadius: 3 }}>
          <Typography variant="h6" mb={1.5}>Products</Typography>
          {loading ? (
            <ProductSkeletonGrid count={4} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title || item.name}</TableCell>
                    <TableCell>{item.category?.name || item.category || 'General'}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(item)}><EditOutlinedIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(item._id)}><DeleteOutlineIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Grid2>
    </Grid2>
  )
}

export default AdminProductManagementPage



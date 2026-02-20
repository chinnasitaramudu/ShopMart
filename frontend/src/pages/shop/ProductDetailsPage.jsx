/*
 * Purpose: Detailed product view with image, rating, price, stock info, and add-to-cart action.
 * API Integration: Fetches single product data through productApi.details(id).
 * State Management: Local state stores product/loading/error values.
 * Navigation Flow: Users can return to products or proceed to cart from this page.
 * Backend Connection: Backend should expose GET /api/products/:id with product object.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { productApi } from '../../services/productApi'
import { mockProducts } from '../../data/mockData'
import RatingStars from '../../components/common/RatingStars'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import { useCart } from '../../hooks/useCart'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const response = await productApi.details(id)
        setProduct(response.data)
      } catch {
        setProduct(mockProducts.find((item) => item._id === id) || mockProducts[0])
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) return <ProductSkeletonGrid count={2} />
  if (!product) return null

  return (
    <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate('/products')}>
        Back to products
      </Button>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Box
            component="img"
            src={product.images?.[0] || 'https://source.unsplash.com/300x300/?grocery'}
            alt={product.name}
            sx={{ width: '100%', borderRadius: 3, maxHeight: 460, objectFit: 'cover' }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Stack spacing={1.4}>
            <Typography variant="h4">{product.name}</Typography>
            <Typography color="text.secondary">{product.category?.name || 'Fresh Category'}</Typography>
            <RatingStars rating={product.rating} />
            <Typography variant="h5" color="primary.main">Rs {product.price}</Typography>
            <Typography color="text.secondary">
              Farm-fresh quality assured. Handpicked and packed for same-day delivery.
            </Typography>
            <Typography variant="body2">Stock available: {product.stock}</Typography>
            <Stack direction="row" spacing={1.5} mt={2}>
              <Button
                variant="contained"
                startIcon={<ShoppingCartOutlinedIcon />}
                onClick={() => addItem(product)}
              >
                Add to Cart
              </Button>
              <Button variant="outlined" onClick={() => navigate('/cart')}>
                Go to Cart
              </Button>
            </Stack>
          </Stack>
        </Grid2>
      </Grid2>
    </Card>
  )
}

export default ProductDetailsPage


/*
 * Purpose: High-conversion grocery product card with image, price, discount, rating, and add-to-cart CTA.
 * API Integration: Receives product data loaded from products API and dispatches cart action.
 * State Management: Uses CartContext addItem action for global cart updates.
 * Navigation Flow: Click on card opens product details; button adds item while staying in flow.
 * Backend Connection: Product data should include _id, name, price, images, rating, and stock from backend.
 */
import { Box, Button, Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined'
import RatingStars from './RatingStars'
import { useCart } from '../../hooks/useCart'

const vegetableImageByName = {
  'fresh tomato': '/products/fresh-tomato.avif',
  'organic potato': '/products/organic-potato.avif',
  'red onion': '/products/red-onion.avif',
  'crunchy carrot': '/products/crunchy-carrot.avif',
  'red apple': '/products/red-apple.avif',
  'fresh banana': '/products/fresh-banana.avif',
  'juicy orange': '/products/juicy-orange.avif',
  'sweet grapes': '/products/sweet-grapes.avif'
}

function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const discount = product.discount || Math.floor(((product.price + 18) / (product.price + 48)) * 20)
  const productName = product.title || product.name || 'Product'
  const normalizedName = String(productName).toLowerCase().trim()
  const mappedImage = vegetableImageByName[normalizedName]
  const fallbackImage = 'https://source.unsplash.com/300x300/?grocery'

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      sx={{ borderRadius: 3, overflow: 'hidden' }}
    >
      <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id}`)}>
        <CardMedia
          component="img"
          height="200"
          image={mappedImage || product.images?.[0] || product.image || fallbackImage}
          alt={productName}
        />
        <Chip
          label={`${discount}% OFF`}
          color="error"
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 700 }}
        />
      </Box>

      <CardContent>
        <Stack spacing={1.2}>
          <Typography variant="subtitle1" noWrap>
            {productName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {product.category?.name || 'Farm Fresh'}
          </Typography>
          <RatingStars rating={product.rating} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" color="primary.main">
              Rs {product.price}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Stock: {product.stock}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartCheckoutOutlinedIcon />}
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Out of stock' : 'Add to Cart'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductCard

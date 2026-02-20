/*
 * Purpose: Landing page combining hero banner, category discovery, and featured product grid.
 * API Integration: Fetches products from productApi; falls back to mock products if API is unavailable.
 * State Management: Local state tracks product list and loading indicator.
 * Navigation Flow: Users can jump into categories/products/cart from this page.
 * Backend Connection: Replace fallback by ensuring /api/products returns populated product catalog.
 */
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import HeroBanner from '../../components/common/HeroBanner'
import SectionTitle from '../../components/common/SectionTitle'
import CategoryGrid from '../../components/common/CategoryGrid'
import ProductCard from '../../components/common/ProductCard'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import { categoryData, mockProducts } from '../../data/mockData'
import { productApi } from '../../services/productApi'
import { getApiErrorMessage } from '../../services/apiClient'

const normalizeCategoryName = (product) =>
  String(product?.category?.name || product?.category || '').toLowerCase().trim()

const getMixedProducts = (items = [], count = 8) => {
  const byCategory = new Map()

  items.forEach((item) => {
    const key = normalizeCategoryName(item) || 'uncategorized'
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key).push(item)
  })

  const result = []
  const categories = Array.from(byCategory.keys())
  let index = 0

  while (result.length < count && categories.length) {
    let addedInRound = false

    categories.forEach((category) => {
      const bucket = byCategory.get(category) || []
      if (bucket[index]) {
        result.push(bucket[index])
        addedInRound = true
      }
    })

    if (!addedInRound) break
    index += 1
  }

  return result.slice(0, count)
}

const getMixedPopularPicks = (primaryProducts = [], fallbackProducts = [], count = 8) => {
  const primaryMixed = getMixedProducts(primaryProducts, count)
  if (primaryMixed.length >= count) return primaryMixed

  const seenIds = new Set(
    primaryMixed.map((item) => String(item?._id || item?.id || item?.name || '').trim())
  )
  const remainingFallback = fallbackProducts.filter((item) => {
    const key = String(item?._id || item?.id || item?.name || '').trim()
    return key && !seenIds.has(key)
  })

  const needed = count - primaryMixed.length
  return [...primaryMixed, ...getMixedProducts(remainingFallback, needed)]
}

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await productApi.list({ limit: 8 })
        setProducts(getMixedPopularPicks(response.data || [], mockProducts, 8))
      } catch (error) {
        console.warn('Using mock products because API failed:', getApiErrorMessage(error))
        setProducts(getMixedProducts(mockProducts, 8))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <Box>
      <HeroBanner />

      <SectionTitle title="Shop by category" subtitle="Daily essentials curated for faster shopping." />
      <CategoryGrid categories={categoryData} />

      <Box mt={4}>
        <SectionTitle title="Popular picks" subtitle="Most-loved grocery items this week." />
        {loading ? <ProductSkeletonGrid count={8} /> : null}
        {!loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              gap: 2
            }}
          >
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

export default HomePage

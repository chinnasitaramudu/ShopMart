/*
 * Purpose: Product listing page with search/category filters and animated product cards.
 * API Integration: Calls productApi.list with query params from URL and local controls.
 * State Management: Local state handles filters, loading, and fetched product collection.
 * Navigation Flow: Product cards route users to Product Details or Cart action.
 * Backend Connection: Backend should support query params like search/category/minPrice/maxPrice.
 */
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, MenuItem, Stack, TextField } from '@mui/material'
import SectionTitle from '../../components/common/SectionTitle'
import ProductCard from '../../components/common/ProductCard'
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid'
import EmptyState from '../../components/common/EmptyState'
import { categoryData, mockProducts } from '../../data/mockData'
import { productApi } from '../../services/productApi'

function ProductListPage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [sort, setSort] = useState('newest')

  const query = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await productApi.list({ keyword: query, category, sort })
        setProducts(response.data || [])
      } catch {
        const local = mockProducts.filter((item) => {
          const queryMatch = query ? item.name.toLowerCase().includes(query.toLowerCase()) : true
          const categoryMatch = category ? item.category.name.toLowerCase().includes(category.toLowerCase()) : true
          return queryMatch && categoryMatch
        })
        setProducts(local)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [query, category, sort])

  const subtitle = useMemo(() => {
    if (query) return `Search results for "${query}"`
    if (category) {
      const match = categoryData.find((item) => item.id === category)
      return `Showing ${match?.title || category} items`
    }
    return 'Fresh and affordable grocery essentials'
  }, [query, category])

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={2} gap={2}>
        <SectionTitle title="All groceries" subtitle={subtitle} />
        <TextField
          select
          size="small"
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ width: 170 }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="priceAsc">Price low to high</MenuItem>
          <MenuItem value="priceDesc">Price high to low</MenuItem>
        </TextField>
      </Stack>

      {loading ? <ProductSkeletonGrid count={10} /> : null}
      {!loading && !products.length ? (
        <EmptyState
          emoji="🥕"
          title="No products found"
          description="Try another search or category."
        />
      ) : null}
      {!loading && products.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' },
            gap: 2
          }}
        >
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </Box>
      ) : null}
    </Box>
  )
}

export default ProductListPage

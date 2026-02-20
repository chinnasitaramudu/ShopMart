/*
 * Purpose: Category card grid for key grocery verticals (vegetables, fruits, dairy, etc.).
 * API Integration: Category click navigates to Product List where API filtering can be applied.
 * State Management: Uses static/fetched category list passed via props.
 * Navigation Flow: Clicking a category routes users to pre-filtered product listing.
 * Backend Connection: Later map category IDs to backend query params (e.g., /products?category=vegetables).
 */
import { Card, CardActionArea, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function CategoryGrid({ categories }) {
  const navigate = useNavigate()

  return (
    <Grid2 container spacing={2}>
      {categories.map((category, index) => (
        <Grid2 key={category.id} size={{ xs: 6, sm: 4, md: 2 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            viewport={{ once: true }}
            sx={{ borderRadius: 3 }}
          >
            <CardActionArea onClick={() => navigate(`/products?category=${category.id}`)} sx={{ p: 2 }}>
              <Stack alignItems="center" spacing={1}>
                <Typography fontSize={34}>{category.icon}</Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {category.title}
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  )
}

export default CategoryGrid


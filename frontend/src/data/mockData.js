/*
 * Purpose: Mock grocery categories/products for UI fallback when backend is unavailable.
 * API Integration: Product pages use this data only if API calls fail.
 * State Management: Components can hydrate local state from these constants.
 * Navigation Flow: Mock items still support route navigation to details/cart flows.
 * Backend Connection: Replace fallback usage by ensuring backend product APIs return data.
 */

export const categoryData = [
  { id: 'vegetables', title: 'Vegetables', icon: '🥦' },
  { id: 'fruits', title: 'Fruits', icon: '🍎' },
  { id: 'dairy', title: 'Dairy', icon: '🥛' },
  { id: 'rice', title: 'Rice', icon: '🍚' },
  { id: 'snacks', title: 'Snacks', icon: '🍪' },
  { id: 'beverages', title: 'Beverages', icon: '🧃' }
]

export const placeholderImages = [
  '/products/fresh-tomato.avif',
  '/products/organic-potato.avif',
  '/products/red-onion.avif',
  '/products/crunchy-carrot.avif',
  'https://source.unsplash.com/300x300/?cabbage',
  'https://source.unsplash.com/300x300/?broccoli',
  'https://source.unsplash.com/300x300/?spinach',
  'https://source.unsplash.com/300x300/?beans',
  'https://source.unsplash.com/300x300/?eggplant',
  'https://source.unsplash.com/300x300/?cucumber',
  '/products/red-apple.avif',
  '/products/fresh-banana.avif',
  '/products/juicy-orange.avif',
  '/products/sweet-grapes.avif',
  'https://source.unsplash.com/300x300/?basmati-rice',
  'https://source.unsplash.com/300x300/?brown-rice',
  'https://source.unsplash.com/300x300/?jasmine-rice',
  'https://source.unsplash.com/300x300/?rice-bag',
  'https://source.unsplash.com/300x300/?chips',
  'https://source.unsplash.com/300x300/?cookies',
  'https://source.unsplash.com/300x300/?nachos',
  'https://source.unsplash.com/300x300/?popcorn'
]

export const mockProducts = [
  { _id: 'p1', name: 'Fresh Tomato', price: 42, rating: 4.3, discount: 15, stock: 120, category: { name: 'Vegetables' }, images: [placeholderImages[0]] },
  { _id: 'p2', name: 'Organic Potato', price: 35, rating: 4.1, discount: 10, stock: 150, category: { name: 'Vegetables' }, images: [placeholderImages[1]] },
  { _id: 'p3', name: 'Red Onion', price: 50, rating: 4.4, discount: 18, stock: 95, category: { name: 'Vegetables' }, images: [placeholderImages[2]] },
  { _id: 'p4', name: 'Crunchy Carrot', price: 58, rating: 4.6, discount: 20, stock: 80, category: { name: 'Vegetables' }, images: [placeholderImages[3]] },
  { _id: 'p5', name: 'Green Cabbage', price: 46, rating: 4.0, discount: 12, stock: 90, category: { name: 'Vegetables' }, images: [placeholderImages[4]] },
  { _id: 'p6', name: 'Fresh Broccoli', price: 82, rating: 4.7, discount: 22, stock: 50, category: { name: 'Vegetables' }, images: [placeholderImages[5]] },
  { _id: 'p7', name: 'Baby Spinach', price: 60, rating: 4.2, discount: 14, stock: 70, category: { name: 'Vegetables' }, images: [placeholderImages[6]] },
  { _id: 'p8', name: 'French Beans', price: 66, rating: 4.3, discount: 17, stock: 60, category: { name: 'Vegetables' }, images: [placeholderImages[7]] },
  { _id: 'p9', name: 'Purple Eggplant', price: 72, rating: 4.5, discount: 19, stock: 55, category: { name: 'Vegetables' }, images: [placeholderImages[8]] },
  { _id: 'p10', name: 'Cool Cucumber', price: 39, rating: 4.1, discount: 11, stock: 130, category: { name: 'Vegetables' }, images: [placeholderImages[9]] },
  { _id: 'p11', name: 'Red Apple', price: 120, rating: 4.5, discount: 10, stock: 80, category: { name: 'Fruits' }, images: [placeholderImages[10]] },
  { _id: 'p12', name: 'Fresh Banana', price: 55, rating: 4.4, discount: 8, stock: 140, category: { name: 'Fruits' }, images: [placeholderImages[11]] },
  { _id: 'p13', name: 'Juicy Orange', price: 90, rating: 4.3, discount: 12, stock: 95, category: { name: 'Fruits' }, images: [placeholderImages[12]] },
  { _id: 'p14', name: 'Sweet Grapes', price: 160, rating: 4.6, discount: 15, stock: 65, category: { name: 'Fruits' }, images: [placeholderImages[13]] },
  { _id: 'p15', name: 'Premium Basmati Rice', price: 320, rating: 4.7, discount: 14, stock: 75, category: { name: 'Rice' }, images: [placeholderImages[14]] },
  { _id: 'p16', name: 'Organic Brown Rice', price: 280, rating: 4.4, discount: 10, stock: 70, category: { name: 'Rice' }, images: [placeholderImages[15]] },
  { _id: 'p17', name: 'Jasmine Rice', price: 350, rating: 4.5, discount: 13, stock: 52, category: { name: 'Rice' }, images: [placeholderImages[16]] },
  { _id: 'p18', name: 'Everyday Rice Pack', price: 260, rating: 4.2, discount: 9, stock: 110, category: { name: 'Rice' }, images: [placeholderImages[17]] },
  { _id: 'p19', name: 'Classic Potato Chips', price: 40, rating: 4.1, discount: 5, stock: 180, category: { name: 'Snacks' }, images: [placeholderImages[18]] },
  { _id: 'p20', name: 'Butter Cookies', price: 85, rating: 4.3, discount: 11, stock: 120, category: { name: 'Snacks' }, images: [placeholderImages[19]] },
  { _id: 'p21', name: 'Masala Nachos', price: 75, rating: 4.2, discount: 7, stock: 135, category: { name: 'Snacks' }, images: [placeholderImages[20]] },
  { _id: 'p22', name: 'Salted Popcorn', price: 65, rating: 4.0, discount: 6, stock: 150, category: { name: 'Snacks' }, images: [placeholderImages[21]] }
]

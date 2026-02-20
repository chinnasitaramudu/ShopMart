/*
 * File Purpose: Backend service module (services/dashboardService.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Encapsulate analytics queries used by the admin dashboard endpoint.
import Category from '../models/Category.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

export const getDashboardAnalyticsData = async () => {
  const [totalUsers, totalProducts, totalOrders, totalCategories] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments()
  ])

  const [salesSummary] = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'COMPLETED' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' }
      }
    }
  ])

  const monthlySales = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'COMPLETED' } },
    {
      $group: {
        _id: { $month: '$paymentInfo.paidAt' },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ])

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)

  const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
    .sort({ stock: 1 })
    .limit(10)

  return {
    counts: {
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      categories: totalCategories
    },
    revenue: {
      total: salesSummary?.totalRevenue || 0,
      monthlySales
    },
    recentOrders,
    lowStockProducts
  }
}

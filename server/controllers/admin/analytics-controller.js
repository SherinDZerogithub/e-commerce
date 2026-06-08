const Order = require("../../models/Order");
const Product = require("../../models/Products");
const User = require("../../models/User");

/**
 * GET /api/admin/analytics
 * Returns aggregated data for the admin analytics dashboard:
 *  - revenueByMonth: monthly revenue for the last 12 months
 *  - ordersByMonth:  monthly order count for the last 12 months
 *  - topProducts:    top 5 best-selling products by units sold
 *  - userSignups:    monthly new user count for the last 12 months
 *  - summaryStats:   total revenue, total orders, total users, total products
 */
const getAnalytics = async (req, res) => {
  try {
    // ── Date boundary: first day of the month 12 months ago ──────────────
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // ── 1. Revenue & Orders by month ─────────────────────────────────────
    const revenueAndOrders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: twelveMonthsAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ── 2. Top 5 products by units sold ──────────────────────────────────
    const topProductsRaw = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          title: { $first: "$cartItems.title" },
          image: { $first: "$cartItems.image" },
          totalSold: { $sum: "$cartItems.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $toDouble: "$cartItems.price" },
                "$cartItems.quantity",
              ],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // ── 3. User signups by month ──────────────────────────────────────────
    // User model has no timestamps, so we fall back to the ObjectId creation time
    const userSignups = await User.aggregate([
      {
        $addFields: {
          createdAt: {
            $toDate: "$_id",
          },
        },
      },
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          signups: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ── 4. Summary stats ─────────────────────────────────────────────────
    const [totalRevenueResult, totalOrders, totalUsers, totalProducts] =
      await Promise.all([
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
      ]);

    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // ── 5. Orders by status breakdown ────────────────────────────────────
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // ── Build a complete 12-month timeline (fill gaps with 0) ────────────
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const revenueMap = {};
    const ordersMap = {};
    const signupsMap = {};

    revenueAndOrders.forEach(({ _id, revenue, orders }) => {
      const key = `${_id.year}-${_id.month}`;
      revenueMap[key] = revenue;
      ordersMap[key] = orders;
    });

    userSignups.forEach(({ _id, signups }) => {
      const key = `${_id.year}-${_id.month}`;
      signupsMap[key] = signups;
    });

    const timeline = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-based
      const key = `${year}-${month}`;
      timeline.push({
        month: `${monthNames[month - 1]} ${year}`,
        revenue: revenueMap[key] || 0,
        orders: ordersMap[key] || 0,
        signups: signupsMap[key] || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        timeline,
        topProducts: topProductsRaw,
        ordersByStatus,
        summary: {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
        },
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

module.exports = { getAnalytics };

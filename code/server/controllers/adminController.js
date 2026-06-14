const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AdminSettings = require('../models/Admin');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
      monthlySales,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['Cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Product.find({ isActive: true, stock: { $lt: 10 } }).select('name stock category').limit(5),
      Order.find().populate('user', 'username email').sort({ createdAt: -1 }).limit(5),
      Product.find({ isActive: true }).sort({ soldCount: -1 }).limit(5).select('name soldCount price image category'),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        pendingOrders,
        lowStockProducts,
        recentOrders,
        topProducts,
        monthlySales,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get/Update site settings
// @route   GET/PUT /api/admin/settings
// @access  Admin
const getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create(req.body);
    else Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, message: 'Settings updated', settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add banner
// @route   POST /api/admin/banners
// @access  Admin
const addBanner = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    settings.banners.push(req.body);
    await settings.save();
    res.status(201).json({ success: true, message: 'Banner added', banners: settings.banners });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Admin
const deleteBanner = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne();
    settings.banners = settings.banners.filter(b => b._id.toString() !== req.params.id);
    await settings.save();
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/update category
// @route   POST /api/admin/categories
// @access  Admin
const addCategory = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    settings.categories.push(req.body);
    await settings.save();
    res.status(201).json({ success: true, message: 'Category added', categories: settings.categories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getSettings, updateSettings, addBanner, deleteBanner, addCategory };

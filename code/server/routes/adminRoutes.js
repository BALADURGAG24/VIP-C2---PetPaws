const express = require('express');
const router = express.Router();
const { getDashboardStats, getSettings, updateSettings, addBanner, deleteBanner, addCategory } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/banners', addBanner);
router.delete('/banners/:id', deleteBanner);
router.post('/categories', addCategory);

module.exports = router;

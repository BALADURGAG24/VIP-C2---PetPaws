const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getFeaturedProducts, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, getBrands
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Admin
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

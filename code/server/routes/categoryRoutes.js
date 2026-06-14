const express = require('express');
const router = express.Router();
const { getCategories, getProductCategories } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/product-categories', getProductCategories);

module.exports = router;

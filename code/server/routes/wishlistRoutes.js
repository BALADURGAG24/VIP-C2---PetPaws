const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/:productId', protect, toggleWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;

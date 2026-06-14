const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getAllUsers, toggleUserStatus } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addrId', protect, updateAddress);
router.delete('/addresses/:addrId', protect, deleteAddress);

// Admin
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;

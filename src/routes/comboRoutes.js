const express = require('express');
const combo = require('@controllers/ComboController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

// Public
router.get('/getPackages', combo.getPackages);

// User
router.get('/getMyCombo', authMiddleware(['user', 'admin']), combo.getMyCombo);
router.post('/purchasePackage', authMiddleware(['user', 'admin']), combo.purchasePackage);
router.post('/useLesson', authMiddleware(['user', 'admin']), combo.useLesson);

// Admin
router.post('/createPackage', authMiddleware(['admin']), combo.createPackage);
router.post('/updatePackage', authMiddleware(['admin']), combo.updatePackage);
router.post('/deletePackage', authMiddleware(['admin']), combo.deletePackage);
router.post('/togglePackageActive', authMiddleware(['admin']), combo.togglePackageActive);

module.exports = router;

const express = require('express');
const payment = require('@controllers/paymentController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

router.post('/createPaymentRequest', authMiddleware(['user', 'admin', 'instructer']), payment.createPaymentRequest);
router.post('/api/swish/callback', payment.updatepaymentdata); // Swish callback (no auth)

module.exports = router;

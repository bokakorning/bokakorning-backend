const express = require('express');
const payment = require('@controllers/paymentController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

router.post('/createPaymentRequest', payment.createPaymentRequest);
router.post('/api/swish/callback', payment.updatepaymentdata); // Swish callback (no auth)
router.get('/paymentStatus/:paymentId', payment.paymentStatus);

module.exports = router;

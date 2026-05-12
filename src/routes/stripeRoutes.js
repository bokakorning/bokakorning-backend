const express = require('express');
const stripe = require('@controllers/stripeController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.post('/poststripe', stripe.poststripe);
router.post('/createBooking',authMiddleware(['user', 'admin', 'instructer']), stripe.createBooking);

module.exports = router;
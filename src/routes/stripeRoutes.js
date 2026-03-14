const express = require('express');
const stripe = require('@controllers/stripeController');

const router = express.Router();
router.post('/poststripe', stripe.poststripe);
router.post('/createBooking', stripe.createBooking);

module.exports = router;
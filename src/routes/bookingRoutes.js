const express = require('express');
const booking = require('@controllers/bookingController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.post('/createBooking',authMiddleware(["user", "admin","instructer"]),booking.createBooking);
router.get('/getinstructerreqs',authMiddleware(["admin","instructer"]),booking.getinstructerreqs);
router.get('/getuserbookings',authMiddleware(["user", "admin"]),booking.getuserbookings);
router.put('/updatebookingstatus',authMiddleware(["user", "admin","instructer"]),booking.updatebookingstatus);

module.exports = router;

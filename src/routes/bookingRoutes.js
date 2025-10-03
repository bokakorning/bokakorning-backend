const express = require('express');
const booking = require('@controllers/bookingController');
const invoice = require('@controllers/invoiceController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.post('/createBooking',authMiddleware(['user', 'admin', 'instructer']),booking.createBooking,);
router.post('/reBooking',authMiddleware(['user', 'admin', 'instructer']),booking.reBooking,);
router.get('/getinstructerreqs',authMiddleware(['admin', 'instructer']),booking.getinstructerreqs,);
router.get('/getaccinstructerreqs',authMiddleware(['admin', 'instructer']),booking.getaccinstructerreqs,);
router.get('/getcompletesession',authMiddleware(['admin', 'instructer']),booking.getcompletesession,);
router.get('/getuserbookings',authMiddleware(['user', 'admin']),booking.getuserbookings,);
router.put('/updatebookingstatus',authMiddleware(['user', 'admin', 'instructer']),booking.updatebookingstatus,);
router.put('/finishbooking',authMiddleware(['user', 'admin', 'instructer']),booking.finishbooking,);
//////Invoice
router.get('/generateInvoice', invoice.generateBookingsInvoice);

module.exports = router;

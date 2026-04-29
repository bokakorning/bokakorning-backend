const express = require('express');
const courses = require('@controllers/CoursesBookingController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

router.get('/getCourseBooking', authMiddleware(['admin','user']), courses.getCourseBooking);
router.post('/createCourseBooking', authMiddleware(['admin','user']), courses.createCourseBooking);

module.exports = router;

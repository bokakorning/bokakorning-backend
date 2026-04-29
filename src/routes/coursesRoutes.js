const express = require('express');
const courses = require('@controllers/CoursesController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

router.get('/getCourses', courses.getCourses);
router.post('/createCourse', authMiddleware(['admin']), courses.createCourses);
router.post('/updateCourse', authMiddleware(['admin']), courses.updateCourses);
router.post('/deleteCourse', authMiddleware(['admin']), courses.deleteCourses);

module.exports = router;

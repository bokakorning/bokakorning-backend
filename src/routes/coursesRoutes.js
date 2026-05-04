const express = require('express');
const courses = require('@controllers/CoursesController');
const authMiddleware = require('@middlewares/authMiddleware');
const { courseMediaUpload } = require('@services/fileUpload');

const router = express.Router();

router.get('/getCourses', courses.getCourses);
router.get('/getEnrolledUsers', authMiddleware(['admin']), courses.getEnrolledUsers);
router.post('/createCourse', authMiddleware(['admin']), courses.createCourses);
router.post('/updateCourse', authMiddleware(['admin']), courses.updateCourses);
router.post('/deleteCourse', authMiddleware(['admin']), courses.deleteCourses);
router.post('/uploadMedia', authMiddleware(['admin']), courseMediaUpload.single('file'), courses.uploadCourseMedia);

module.exports = router;

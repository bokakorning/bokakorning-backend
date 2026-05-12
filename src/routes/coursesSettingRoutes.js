const express = require('express');
const coursesSettings = require('@controllers/CoursesSettingsController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();

router.get('/getCoursesSettings', coursesSettings.getCoursesSettings);
router.post('/addCityInCourseSetting', authMiddleware(['admin']), coursesSettings.addCityInCourseSetting);
router.post('/updateCityInCourseSetting', authMiddleware(['admin']), coursesSettings.updateCityInCourseSetting);
router.post('/deleteCityInCourseSetting', authMiddleware(['admin']), coursesSettings.deleteCityInCourseSetting);
router.post('/addCourseTypeInCourseSetting', authMiddleware(['admin']), coursesSettings.addCourseTypeInCourseSetting);
router.post('/toggleCourseTypePaidStatus', authMiddleware(['admin']), coursesSettings.toggleCourseTypePaidStatus);
router.post('/updateCourseTypeInCourseSetting', authMiddleware(['admin']), coursesSettings.updateCourseTypeInCourseSetting);
router.post('/deleteCourseTypeInCourseSetting', authMiddleware(['admin']), coursesSettings.deleteCourseTypeInCourseSetting);

module.exports = router;

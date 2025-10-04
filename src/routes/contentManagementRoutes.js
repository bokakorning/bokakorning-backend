const express = require('express');
const content = require('@controllers/contentManagementController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.post('/createContent',authMiddleware(['user', 'admin', 'instructer']),content.createContent);
router.get('/getContent',content.getContent);
router.post('/updateContent',authMiddleware(['user', 'admin', 'instructer']),content.updateContent);

module.exports = router;

const express = require('express');
const setting = require('@controllers/settingController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.post('/createSetting',authMiddleware(['user', 'admin', 'instructer']),setting.createSetting);
router.get('/getSetting',setting.getSetting);
router.get('/getSettingForUser',setting.getSettingForUser);

router.post('/updateSetting',authMiddleware(['user', 'admin', 'instructer']),setting.updateSetting);

module.exports = router;

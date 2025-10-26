const express = require('express');
const progress = require('@controllers/moduleController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.get('/getprogress',authMiddleware(['user', 'admin', 'instructer']),progress.getmodule,);
router.post('/updateprogress',authMiddleware(['user', 'admin', 'instructer']),progress.updatemodule,);

module.exports = router;

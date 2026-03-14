const express = require('express');
const prReq = require('@controllers/prReqController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.get('/getPrReq',prReq.getPrReq);
router.post('/updatePrReq',authMiddleware(['user', 'admin', 'instructer']),prReq.updatePrReq);

module.exports = router;

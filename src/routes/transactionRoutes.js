const express = require('express');
const transaction = require('@controllers/transactionController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.get('/getTransaction',authMiddleware(['user', 'admin', 'instructer']),transaction.getTransaction,);

module.exports = router;

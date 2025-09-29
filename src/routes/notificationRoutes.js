const express = require('express');
const notification = require('@controllers/notificationController');
const authMiddleware = require('@middlewares/authMiddleware');

const router = express.Router();
router.get(
  '/getnotification',
  authMiddleware(['user', 'admin', 'instructer']),
  notification.getnotification,
);

module.exports = router;

const express = require('express');
const {
  login,
  register,
  sendOTPForforgetpass,
  verifyOTP,
  changePassword,
  getprofile,
  updateprofile,
  fileUpload,
  getnearbyinstructer,
  updateInstLocation,
  getUser,
  updateInstRate,
  getInstructerBalence
} = require('@controllers/authController');
const authMiddleware = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

const router = express.Router();
router.post('/login', login);
router.post('/register', upload.single('doc'), register);
router.post('/sendOTPForforgetpass', sendOTPForforgetpass);
router.post('/verifyOTP', verifyOTP);
router.post('/changePassword', changePassword);
router.get(
  '/profile',
  authMiddleware(['user', 'admin', 'instructer']),
  getprofile,
);
router.post(
  '/updateprofile',
  authMiddleware(['user', 'admin', 'instructer']),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
  ]),
  updateprofile,
);
router.post(
  '/getnearbyinstructer',
  authMiddleware(['user', 'admin', 'instructer']),
  getnearbyinstructer,
);
router.post(
  '/updateInstLocation',
  authMiddleware(['user', 'admin', 'instructer']),
  updateInstLocation,
);
// router.post("/fileupload", upload.single("file"), fileUpload);
router.get('/getUser',authMiddleware(['user', 'admin', 'instructer']),getUser);
router.get('/getInstructersBalence',authMiddleware(['user', 'admin', 'instructer']),getInstructerBalence);
router.get('/resetInstBalence/:id',authMiddleware(['user', 'admin', 'instructer']),resetInstBalence);
router.post('/updateInstRate',authMiddleware([ 'admin']),updateInstRate,);

module.exports = router;

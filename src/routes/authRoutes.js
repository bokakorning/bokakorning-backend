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
    getUser,
} = require('@controllers/authController');
const authMiddleware = require('@middlewares/authMiddleware');
const { upload } = require("@services/fileUpload");

const router = express.Router();
router.post('/login', login);
router.post('/register',upload.single("doc"), register);
router.post("/sendOTPForforgetpass", sendOTPForforgetpass);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);
router.get("/profile",authMiddleware(["user", "admin","instructer"]), getprofile);
router.post("/updateprofile", authMiddleware(["user", "admin","instructer"]),upload.single("image"), updateprofile);
// router.post("/fileupload", upload.single("file"), fileUpload);
router.get("/getUser", authMiddleware(["user", "admin","instructer"]), getUser);

module.exports = router;

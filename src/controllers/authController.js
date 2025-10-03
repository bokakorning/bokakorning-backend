const User = require('@models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('@responses/index');
const Verification = require('@models/Verification');
const mailNotification = require('@services/mailNotification');
const userHelper = require('./../helper/user');
const Device = require('@models/Device');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, type } = req.body;
      let doc;
      if (req.file) {
        doc = req.file.location;
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Password must be at least 8 characters long' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userobj = {
        name,
        email,
        password: hashedPassword,
        phone,
        type,
      };
      if (doc) {
        userobj.doc = doc;
      }
      const newUser = new User(userobj);

      await newUser.save();

      const userResponse = await User.findById(newUser._id).select('-password');

      response.created(res, {
        message: 'User registered successfully',
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );
      await Device.updateOne(
        { device_token: req.body.device_token },
        { $set: { player_id: req.body.player_id, user: user._id } },
        { upsert: true },
      );
      response.ok(res, {
        message: 'Login successful',
        token,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  sendOTPForforgetpass: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      if (!user) {
        return response.badReq(res, { message: 'Email does not exist.' });
      }

      // let ran_otp = Math.floor(1000 + Math.random() * 9000);
      let ran_otp = '0000';
      // await mailNotification.sendOTPmailForSignup({
      //   email: email,
      //   code: ran_otp,
      // });
      let ver = new Verification({
        user: user._id,
        otp: ran_otp,
        expiration_at: userHelper.getDatewithAddedMinutes(5),
      });
      await ver.save();
      let token = await userHelper.encode(ver._id);
      return response.ok(res, { message: 'OTP sent.', token });
    } catch (error) {
      return response.error(res, error);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const otp = req.body.otp;
      const token = req.body.token;
      console.log(otp, token);
      if (!(otp && token)) {
        return response.badReq(res, { message: 'otp and token required.' });
      }
      let verId = await userHelper.decode(token);
      let ver = await Verification.findById(verId);
      if (
        otp == ver.otp &&
        !ver.verified &&
        new Date().getTime() < new Date(ver.expiration_at).getTime()
      ) {
        let token = await userHelper.encode(
          ver._id + ':' + userHelper.getDatewithAddedMinutes(5).getTime(),
        );
        ver.verified = true;
        await ver.save();
        return response.ok(res, { message: 'OTP verified', token });
      } else {
        return response.notFound(res, { message: 'Invalid OTP' });
      }
    } catch (error) {
      return response.error(res, error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const token = req.body.token;
      const password = req.body.password;
      const data = await userHelper.decode(token);
      const [verID, date] = data.split(':');
      if (new Date().getTime() > new Date(date).getTime()) {
        return response.forbidden(res, { message: 'Session expired.' });
      }
      let otp = await Verification.findById(verID);
      console.log('otp.verified', otp.verified);
      if (!otp.verified) {
        return response.forbidden(res, { message: 'unAuthorize' });
      }
      let user = await User.findById(otp.user);
      if (!user) {
        return response.forbidden(res, { message: 'unAuthorize' });
      }
      await Verification.findByIdAndDelete(verID);
      user.password = user.encryptPassword(password);
      await user.save();
      //mailNotification.passwordChange({ email: user.email });
      return response.ok(res, { message: 'Password changed! Login now.' });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getprofile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id, '-password');
      return response.ok(res, user);
    } catch (error) {
      return response.error(res, error);
    }
  },
  getnearbyinstructer: async (req, res) => {
    try {
      const payload = req.body;
      // const users = await User.find({
      //     type: "instructer",
      //     transmission: { $in: [payload.transmission, "Both"] },
      //     location: {
      //       $near: {
      //         $maxDistance: 1609.34 * 10,
      //         $geometry: payload.location,
      //       },
      //     },
      //   }).select('-password');
      const users = await User.aggregate([
        {
          $geoNear: {
            near: payload.location, // { type: "Point", coordinates: [lng, lat] }
            distanceField: 'distance', // field where distance will be stored
            maxDistance: 1609.34 * 8, // 8 miles in meters
            spherical: true,
            query: {
              type: 'instructer',
              transmission: { $in: [payload.transmission, 'Both'] },
            },
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ]);
      return response.ok(res, users);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateprofile: async (req, res) => {
    try {
      const payload = req.body;
      // console.log("req",req?.files)
      if (req.files && req.files?.image?.length > 0) {
        payload.image = req.files?.image?.[0].location;
      }
      if (req.files && req.files?.doc?.length > 0) {
        payload.doc = req.files?.doc?.[0].location;
      }
      const user = await User.findByIdAndUpdate(req.user.id, payload, {
        new: true,
        upsert: true,
      });
      return response.ok(res, { user, message: 'Profile Updated Succesfully' });
    } catch (error) {
      return response.error(res, error);
    }
  },
  updateInstLocation: async (req, res) => {
    try {
      const track = req.body?.track;
      if (!track) {
        return response.error(res, 'Location not provided');
      }
      await User.findByIdAndUpdate(req.user.id, { $set: { location: track } });
      return response.ok(res);
    } catch (error) {
      return response.error(res, error);
    }
  },
  updateInstRate: async (req, res) => {
    try {
      const payload = req.body;
      if (!payload?.instructer_id) {
        return response.error(res, 'Instructer id is not provided');
      }
      await User.findByIdAndUpdate(payload?.instructer_id, { $set: { rate_per_hour: payload?.rate_per_hour } });
      return response.ok(res);
    } catch (error) {
      return response.error(res, error);
    }
  },
  fileUpload: async (req, res) => {
    try {
      let key = req.file && req.file.key;
      console.log('DDDDDD', key);
      return response.ok(res, {
        message: 'File uploaded.',
        file: `${process.env.ASSET_ROOT}/${key}`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getUser: async (req, res) => {
    try {
      const { page = 1, limit = 20,type } = req.query;
      let user = await User.find({type:type}).sort({
          createdAt: -1,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);;
      return response.ok(res, user);
    } catch (err) {
      console.log(err);
      response.error(res, err);
    }
  },
};

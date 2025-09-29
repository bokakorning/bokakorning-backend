const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
    },
    type: {
      type: String,
      enum: ['user', 'admin','instructer'],
      default: 'user',
    },
    image: {
      type: String,
    },
    doc: {
      type: String,
    },
    location: {
      type: pointSchema,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
     status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },

    ///////Instructer Fields///
    vehicle_model: {
      type: String,
    },
    model_year: {
      type: String,
    },
    transmission: {
      type: String,
      enum: ["Both", "Automatic", "Manual"],
    },
    experience_year: {
      type: String,
    },
    experience_month: {
      type: String,
    },
    rate_per_hour: {
      type: String,
    },
    bio: {
      type: String,
    },
    available: {
      type: Boolean,
      default:false
    },

  },
  { timestamps: true },
);


userSchema.methods.isPasswordMatch = async function (password) {
  return password === this.password;
};

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);

module.exports = User;

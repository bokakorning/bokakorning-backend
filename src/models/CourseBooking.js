'use strict';

const mongoose = require('mongoose');
const coursesBookingSchema = new mongoose.Schema(
  {
      price: {
        type: Number,
      },
      participants: {
        type: Number,
        default: 1,
      },
      payment_mode: {
        type: String,
        enum: ['swish', 'stripe'],
      },
      payment_status: {
        type: String,
        default: 'PAID',
      },
      payment_id: {
        type: String,
      },
      courses_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
          },
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
  },
  {
    timestamps: true,
  },
);

coursesBookingSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('CoursesBooking', coursesBookingSchema);

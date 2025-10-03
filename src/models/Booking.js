'use strict';
const mongoose = require('mongoose');
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    instructer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedbyinstructer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    date: {
      type: Date,
      default: new Date(),
    },
    sheduleDate: {
      type: Date,
    },
    sheduleSeesion: {
      type: Boolean,
    },
    selectedTime: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
      // enum:['pending','started','cancel','complete']
    },
    paymentid: {
      type: String,
    },
    payment_mode: {
      type: String,
    },
    user_location: {
      type: pointSchema,
    },
    pickup_address: {
      type: String,
    },
    transmission: {
      type: String,
    },
    total: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

'use strict';
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    instructer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    rejectedbyinstructer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    date: {
      type: Date,
      default:new Date()
    },
    selectedTime: {
        type: String
    },
}, {
    timestamps: true
});

bookingSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking

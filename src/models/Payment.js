'use strict';

const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    //   enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Payment', paymentSchema);

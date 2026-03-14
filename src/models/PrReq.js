'use strict';

const mongoose = require('mongoose');
const prreqSchema = new mongoose.Schema(
  {
    pr_status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

prreqSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('PrReq', prreqSchema);

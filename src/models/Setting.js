'use strict';

const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema(
  {
    per_hour_hour: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

settingSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Setting', settingSchema);

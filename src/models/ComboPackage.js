'use strict';

const mongoose = require('mongoose');

const comboPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    driving_lessons: { type: Number, required: true, default: 0 },
    course_lessons: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

comboPackageSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret) => { delete ret.__v; return ret; },
});

module.exports = mongoose.model('ComboPackage', comboPackageSchema);

'use strict';

const mongoose = require('mongoose');
const coursesSettingsSchema = new mongoose.Schema(
  {
    course_types: [{
      name: { type: String },
      description: { type: String, default: '' },
      isPaid: { type: Boolean, default: false },
      questions: [{
        question_text: { type: String },
        options: [{ type: String }],
        correct_answer: { type: String },
        media_url: { type: String },
        media_type: { type: String },
      }],
    }],
    city: [{
      name: {
        type: String,
      }
    }],
    language: [{
      name: {
        type: String,
      }
    }],
  },
  {
    timestamps: true,
  },
);

coursesSettingsSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('CoursesSettings', coursesSettingsSchema);

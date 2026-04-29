'use strict';

const mongoose = require('mongoose');
const coursesSettingsSchema = new mongoose.Schema(
  {
    course_types: [{
      name: {
        type: String,
      },
      description: {
        type: String,
        default: '',
      },
      isPaid: {
        type: Boolean,
        default: false,
      }
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

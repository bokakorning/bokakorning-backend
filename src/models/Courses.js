'use strict';

const mongoose = require('mongoose');
const coursesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    course_types: {
      type: String,
    },
    time_from: {
      type: String,
    },
    price: {
      type: Number,
    },
    time_to: {
      type: String,
    },
    date: {
      type: Date,
    },
    available_slot: {
      type: Number,
    },
    language: {
      type: String,
      enum: ['en', 'sv'],
    },
    city: [{
      type: String,
    }],
    enrolled_user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    questions: [
      {
        question_text: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
          }
        ],
        correct_answer: {
          type: String, // OR Number (index-based, see below)
          required: true,
        },
        media_type: {
          type: String,
          enum: ['image', 'video', null],
          default: null,
        },
        media_url: {
          type: String,
        },
      }
    ],
  },
  {
    timestamps: true,
  },
);

coursesSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Courses', coursesSchema);

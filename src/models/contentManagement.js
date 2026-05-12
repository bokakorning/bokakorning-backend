"use strict";

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacyPolicy', 'termsAndConditions'],
    required: true,
  },
  name: {
    type: String,
  },
  language: {
    type: String,
    enum: ['en', 'sv'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});


contentSchema.set("toJSON", {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    },
})



module.exports = mongoose.model('Content', contentSchema);




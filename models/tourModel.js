const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: ['easy', 'medium', 'difficult'],
    },

    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: {
      type: [String],
    },

    startDates: {
      type: [String], // ⚠️ explained below
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

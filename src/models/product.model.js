const mongoose = require('mongoose'); // Erase if already required
const MODEL = require('../constants/models');

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL.DOCUMENT.USER,
  },
});

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: ratingSchema,
    },
  },
  { timestamps: true, collection: MODEL.COLLECTION.PRODUCT },
);

//Export the model
module.exports = mongoose.model(
  MODEL.DOCUMENT.PRODUCT,
  productSchema,
);

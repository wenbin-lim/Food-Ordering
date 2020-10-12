// ====================================================================================================
// Packages
// ====================================================================================================
const mongoose = require('mongoose');

// ====================================================================================================
// Variables
// ====================================================================================================

// ====================================================================================================
// Define Schema
// -------------
// Schema Types:
// 1. String - Options: lowercase(Boolean), uppercase(Boolean), trim(Boolean)
// 2. Number
// 3. Date
// 4. Boolean
// 5. ObjectId using {type: mongoose.Schema.Types.ObjectId, ref: 'Model'}
// 6. Array using []
// 7. Object using {}
// ------------------
// Schema Type Options
// 1. required(Boolean)
// 2. default
// 3. unique(Boolean)
// ====================================================================================================
const FoodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ' '),
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: String,
  availability: {
    type: Boolean,
    default: true,
  },
  promotionPrice: Number,
  portionSize: Number,
  desc: String,
  allergics: [String],
  preparationTime: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  foodGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodGroup',
  },
  customisations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customisation',
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('Food', FoodSchema);

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
  availability: {
    type: Boolean,
    default: true,
    required: true,
  },
  minQty: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  maxQty: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  image: String,
  promotionPrice: Number,
  portionSize: Number,
  desc: String,
  allergics: [
    {
      type: String,
      trim: true,
      set: allergy => allergy.replace(/\s+/g, ' '),
    },
  ],
  preparationTime: String,
  tags: [
    {
      type: String,
      trim: true,
      set: tag => tag.replace(/\s+/g, ' '),
    },
  ],
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
  ],
  customisations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customisation',
    },
  ],
  allowAdditionalInstruction: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
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

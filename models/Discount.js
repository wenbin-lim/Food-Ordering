// Packages
const mongoose = require('mongoose');
const config = require('config');

// Variables
const discountTypes = config.get('discountTypes');

const DiscountScheme = mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    set: code => code.replace(/\s+/g, ''),
  },
  expiry: Date,
  minSpending: {
    type: Number,
    min: 0,
    default: 0,
  },
  type: {
    type: String,
    enum: Object.values(discountTypes),
    default: discountTypes.cash,
  },
  value: {
    type: Number,
    required: true,
  },
  cap: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
module.exports = mongoose.model('Discount', DiscountScheme);

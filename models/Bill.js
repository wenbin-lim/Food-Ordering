// ====================================================================================================
// Packages
// ====================================================================================================
const mongoose = require('mongoose');
const config = require('config');

// ====================================================================================================
// Variables
// ====================================================================================================
const paymentMethods = config.get('paymentMethods');

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
const BillSchema = mongoose.Schema({
  total: {
    type: Number,
    min: 0,
    default: 0,
  },
  gst: {
    type: Number,
    min: 0,
    default: 0,
  },
  serviceCharge: {
    type: Number,
    min: 0,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: paymentMethods.split(','),
  },
  discountCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscountCode',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const autoPopulateTable = function (next) {
  this.populate('table');
  next();
};

BillSchema.pre('findOne', autoPopulateTable);
BillSchema.pre('find', autoPopulateTable);

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('Bill', BillSchema);

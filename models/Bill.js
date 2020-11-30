// Packages
const mongoose = require('mongoose');
const config = require('config');

// Variables
const paymentMethods = config.get('paymentMethods');
const billStatus = config.get('billStatus');

const BillSchema = mongoose.Schema({
  subTotal: {
    type: Number,
    min: 0,
    default: 0,
  },
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
  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  roundingAmt: {
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
  status: {
    type: String,
    enum: Object.values(billStatus),
    default: billStatus.occupied,
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

// Exports
module.exports = mongoose.model('Bill', BillSchema);

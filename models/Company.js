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
const CompanySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ''),
    unique: true,
  },
  displayedName: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ' '),
  },
  logo: {
    small: String,
    large: String,
  },
  socialMediaLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  acceptedPaymentMethods: [
    {
      type: String,
      enum: paymentMethods.split(','),
    },
  ],
  gstRegistered: {
    type: Boolean,
    default: true,
    required: true,
  },
  hasServiceCharge: {
    type: Boolean,
    default: true,
    required: true,
  },
  roundTotalPrice: {
    type: Boolean,
    default: true,
    required: true,
  },
  roundDownTotalPrice: {
    type: Boolean,
    default: true,
    required: true,
  },
  pricesIncludesGst: {
    type: Boolean,
    default: true,
  },
  pricesIncludesServiceCharge: {
    type: Boolean,
    default: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
});

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('Company', CompanySchema);

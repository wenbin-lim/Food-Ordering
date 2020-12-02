// Packages
const mongoose = require('mongoose');
const config = require('config');

// Variables
const paymentMethods = config.get('paymentMethods');

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
  companyCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  gstRegistered: {
    type: Boolean,
    default: true,
    required: true,
  },
  gstRegNo: String,
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
  acceptedPaymentMethods: [
    {
      type: String,
      enum: paymentMethods.split(','),
    },
  ],
  assistanceReasons: [String],
  logo: {
    small: String,
    large: String,
  },
  socialMediaLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
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

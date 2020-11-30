// ====================================================================================================
// Packages
// ====================================================================================================
const mongoose = require('mongoose');
const config = require('config');

// ====================================================================================================
// Variables
// ====================================================================================================
const orderStatus = config.get('orderStatus');

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
const Option = require('./Option');
const OptionSchema = mongoose.model('Option').schema;

const OrderSchema = mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  customisationsUsed: [
    {
      customisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customisation',
      },
      optionsSelected: [OptionSchema],
    },
  ],
  additionalInstruction: String,
  isAdditionalItem: {
    type: Boolean,
    default: false,
  },
  additionalItemName: String,
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  currentStatus: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.new,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  activities: [
    {
      status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.new,
      },
      remarks: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

const autoPopulate = function (next) {
  this.populate('food');
  this.populate({
    path: 'bill',
    model: 'Bill',
    populate: {
      path: 'table',
      model: 'Table',
      select: 'name',
    },
  });
  this.populate({
    path: 'customisationsUsed',
    populate: {
      path: 'customisation',
      model: 'Customisation',
    },
  });
  this.populate({
    path: 'activities',
    populate: {
      path: 'user',
      model: 'User',
      select: 'name',
    },
  });
  next();
};

OrderSchema.pre('findOne', autoPopulate);
OrderSchema.pre('find', autoPopulate);

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('Order', OrderSchema);

// ====================================================================================================
// Packages
// ====================================================================================================
const mongoose = require('mongoose');
const config = require('config');

// ====================================================================================================
// Variables
// ====================================================================================================
const foodStatus = config.get('foodStatus');

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
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: Object.keys(foodStatus),
    default: foodStatus.added,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

const autoPopulate = function (next) {
  this.populate('food');
  this.populate('bill');
  this.populate({
    path: 'customisationsUsed',
    populate: {
      path: 'customisation',
      model: 'Customisation',
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

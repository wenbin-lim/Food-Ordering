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
const OptionSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ' '),
  },
  availability: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('Option', OptionSchema);

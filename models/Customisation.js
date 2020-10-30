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
const CustomisationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ' '),
  },
  title: {
    type: String,
    required: true,
    trim: true,
    set: title => title.replace(/\s+/g, ' '),
  },
  availability: {
    type: Boolean,
    default: true,
    required: true,
  },
  selection: {
    type: String,
    required: true,
  },
  options: [
    {
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
    },
  ],
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
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
module.exports = mongoose.model('Customisation', CustomisationSchema);

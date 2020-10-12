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
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  access: {
    type: Number,
    required: true,
  },
  role: [String],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// ====================================================================================================
// Exports
// ====================================================================================================
module.exports = mongoose.model('User', UserSchema);

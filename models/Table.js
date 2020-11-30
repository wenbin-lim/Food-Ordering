// Packages
const mongoose = require('mongoose');

// Variables

const TableSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: name => name.replace(/\s+/g, ' '),
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

/* PLEASE DONT POPULATE BILL HERE THANKS!!! */

// Exports
module.exports = mongoose.model('Table', TableSchema);

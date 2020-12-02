// Packages
const mongoose = require('mongoose');
const config = require('config');

// Variables
const userRoles = config.get('userRoles');
const notificationTypes = config.get('notificationTypes');

const NotificationSchema = mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(notificationTypes),
  },
  content: {
    tableName: String,
    remarks: String,
    foodName: String,
    optionsSelected: [String],
    additionalInstruction: String,
    assistanceReason: String,
  },
  forWho: [
    {
      type: String,
      enum: Object.values(userRoles),
    },
  ],
  time: {
    type: Date,
    default: Date.now,
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
module.exports = mongoose.model('Notification', NotificationSchema);

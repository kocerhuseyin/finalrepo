const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  time: { type: String, required: true }, // Format: 'HH:MM'
  days: [{ type: String }], // ['Monday', 'Tuesday', ...]
  description: { type: String, required: true }
});

module.exports = mongoose.model('Alarm', alarmSchema);
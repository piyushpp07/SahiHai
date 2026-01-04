const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  fileType: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  geminiResponse: {
    type: mongoose.Schema.Types.Mixed, // Can store any type of data
    required: true,
  },
  groqResponse: {
    type: mongoose.Schema.Types.Mixed, // Can store any type of data
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // For future authentication
    ref: 'User',
    // required: true, // Make required once authentication is implemented
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scan', ScanSchema);

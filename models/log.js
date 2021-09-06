const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const logSchema = new mongoose.Schema({
  // Log
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  level: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR', 'FATAL'],
    default: 'ERROR',
  },
  message: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
});

logSchema.plugin(normalize);

module.exports = mongoose.model('Log', logSchema);

const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  selector: {
    type: String,
  },
});

module.exports = mongoose.model('Target', targetSchema);

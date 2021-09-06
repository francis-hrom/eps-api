const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

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

targetSchema.plugin(normalize);

module.exports = mongoose.model('Target', targetSchema);

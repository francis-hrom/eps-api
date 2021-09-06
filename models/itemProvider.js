const mongoose = require('mongoose');

const itemProviderSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  item_clean: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
  provider_clean: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ItemProvider', itemProviderSchema);

const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(normalize);

module.exports = mongoose.model('user', userSchema);

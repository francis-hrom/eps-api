const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const rankingSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

rankingSchema.plugin(normalize);

module.exports = mongoose.model('Ranking', rankingSchema);

/*
const rankSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
})


const rankingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  values: [rankSchema],
});

*/

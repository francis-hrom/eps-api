const Ranking = require('../../models/ranking');
const cleanup = require('./cleanup');

module.exports = async () => {
  const rankings = await Ranking.find({}).lean();

  rankings.forEach((ranking) => cleanup(ranking));

  return rankings;
};

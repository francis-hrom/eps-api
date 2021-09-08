const Target = require('../../models/target');
const { today } = require('../../utils');
const getRankingsByDate = require('./get-rankings-by-date');
const cleanup = require('./cleanup');

module.exports = async () => {
  const todaysRankings = await getRankingsByDate(today());
  const urlsWithTodaysRanking = new Set();

  todaysRankings.forEach((ranking) => urlsWithTodaysRanking.add(ranking.url));

  const targets = await Target.find({
    url: { $not: { $in: [...urlsWithTodaysRanking] } },
  }).lean();

  // targets.forEach((target) => cleanup(target));

  return targets;
};

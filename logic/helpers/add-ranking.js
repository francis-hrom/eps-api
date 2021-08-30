const Ranking = require('../../models/ranking');

module.exports = async (item, url, rank) => {
  const ranking = new Ranking({
    item: item.toLowerCase(),
    url,
    rank: rank + 1,
  });

  const newRanking = await ranking.save();

  return newRanking;
};

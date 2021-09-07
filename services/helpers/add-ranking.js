const Ranking = require('../../models/ranking');
const validUrl = require('valid-url');

module.exports = async (item, url, rank) => {
  if (!validUrl.isUri(url)) throw new TypeError(`${url} is not valid URL.`);

  const ranking = new Ranking({
    item: item.toLowerCase(),
    url: url.toLowerCase(),
    rank: rank + 1,
  });

  const newRanking = await ranking.save();

  return newRanking;
};

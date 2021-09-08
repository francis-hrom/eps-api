const Ranking = require('../../models/ranking');
const isValidDate = require('../../utils/is-valid-date');
const cleanup = require('./cleanup');

module.exports = (dateString, url) => {
  if (typeof dateString !== 'string') {
    throw new TypeError(`${dateString} is not a string.`);
  }
  if (!isValidDate(dateString)) {
    throw new TypeError(
      `${dateString} is invalid date or in invalid format (required YYYY-MM-DD).`
    );
  }
  if (typeof url !== 'string') {
    throw new TypeError(`${url} is not a string.`);
  }

  return (async () => {
    const rankings = await Ranking.find({
      date: {
        $gte: `${dateString}T00:00:00.000Z`,
        $lt: `${dateString}T23:59:59.999Z`,
      },
      url,
    }).lean();

    // rankings.forEach((ranking) => cleanup(ranking));

    return rankings;
  })();
};

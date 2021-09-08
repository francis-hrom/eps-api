const Ranking = require('../../models/ranking');
const isValidDate = require('../../utils/is-valid-date');
const cleanup = require('./cleanup');

module.exports = (dateString) => {
  if (typeof dateString !== 'string') {
    throw new TypeError(`${dateString} is not a string.`);
  }
  if (!isValidDate(dateString)) {
    throw new TypeError(
      `${dateString} is invalid date or invalid format (required YYYY-MM-DD).`
    );
  }

  return (async () => {
    const rankings = await Ranking.find({
      date: {
        $gte: `${dateString}T00:00:00.000Z`,
        $lte: `${dateString}T23:59:59.999Z`,
      },
    })
      .sort({ item: 'ascending' })
      .lean();

    // rankings.forEach((ranking) => cleanup(ranking));

    return rankings;
  })();
};

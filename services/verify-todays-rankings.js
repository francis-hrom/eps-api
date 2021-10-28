const getAllUrlsFromAllTargets = require('./helpers/get-all-urls-from-all-targets');
const compareRankings = require('./compare-rankings');
const { today, otherDate } = require('../utils');

module.exports = async () => {
  const urls = await getAllUrlsFromAllTargets();
  const todayVal = today();
  const yesterday = otherDate(todayVal, -1);

  const results = [];
  await Promise.all(
    urls.map(async (url) => {
      const result = await compareRankings(url, todayVal, yesterday);

      if (result) {
        results.push({ url, difference: result });
      }
    })
  );

  return results;
};

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { isValidDate } = require('../utils');
const getRankingsByDate = require('./helpers/get-rankings-by-date');

module.exports = (dateString) => {
  if (typeof dateString !== 'string') {
    throw new TypeError('Input dateString is not a string.');
  }
  if (!isValidDate(dateString)) {
    throw new Error(
      `${dateString} is invalid date or invalid date format (required YYYY-MM-DD).`
    );
  }

  return (async () => {
    const rankings = await getRankingsByDate(dateString);

    const urls = rankings.map(({ url }) => url);
    const urlCounts = _.countBy(urls);
    const urlCountsSorted = Object.fromEntries(
      Object.entries(urlCounts).sort(([, a], [, b]) => b - a)
    );
    const uniqueUrls = _.keys(urlCountsSorted);

    await new Promise((resolve, reject) => {
      const file = path.join(
        process.cwd(),
        'export-csv',
        `export_${dateString}_overview.csv`
      );
      const writeStream = fs.createWriteStream(file);
      // Write Headers to CSV
      writeStream.write(`Url,Date,Rankings\n`);

      uniqueUrls.forEach((url) => {
        // write Row to CSV
        writeStream.write(`${url},${dateString},${urlCounts[url]}\n`);
      });

      writeStream.end(resolve);
      writeStream.on('error', reject);
    });
  })();
};

const fs = require('fs');
const path = require('path');
const {
  isValidDate,
  cleanTextKeepSpaces,
  cleanTextRemoveSpaces,
} = require('../utils');

module.exports = async (rankings, dateString) => {
  if (!Array.isArray(rankings)) {
    throw new TypeError(`${rankings} is not an array.`);
  }

  let file;

  if (dateString && !isValidDate(dateString)) {
    throw new Error(
      `${dateString} is invalid date or invalid date format (required YYYY-MM-DD).`
    );
  } else if (dateString) {
    file = path.join(process.cwd(), 'export-csv', `export_${dateString}.csv`);
  } else {
    file = path.join(process.cwd(), 'export-csv', `export_all.csv`);
  }

  return (async () => {
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);

      // Write Headers to CSV
      writeStream.write(`Item,Item_clean,Item_no_spaces,Date,Rank,Url\n`);

      rankings.forEach((ranking) => {
        // write Row to CSV
        writeStream.write(
          `"${ranking.item}",${cleanTextKeepSpaces(
            ranking.item
          )},${cleanTextRemoveSpaces(ranking.item)},${ranking.date
            .toISOString()
            .slice(0, 10)},${ranking.rank},${ranking.url}\n`
        );
      });

      writeStream.end(resolve);
      writeStream.on('error', reject);
    });
  })();
};

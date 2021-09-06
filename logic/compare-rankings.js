const getRankingsByDateAndUrl = require('./helpers/get-rankings-by-date-and-url');
const { isValidDate } = require('../utils');

module.exports = (url, dateString1, dateString2) => {
  if (typeof url !== 'string') {
    throw new TypeError(`${url} is not a string`);
  }

  if (typeof dateString1 !== 'string') {
    throw new TypeError(`${dateString1} is not a string.`);
  }

  if (!isValidDate(dateString1)) {
    throw new TypeError(
      `${dateString1} is invalid date or invalid format (required YYYY-MM-DD).`
    );
  }

  if (typeof dateString2 !== 'string') {
    throw new TypeError(`${dateString2} is not a string.`);
  }

  if (!isValidDate(dateString2)) {
    throw new TypeError(
      `${dateString2} is invalid date or invalid format (required YYYY-MM-DD).`
    );
  }

  return (async () => {
    const rankings1 = await getRankingsByDateAndUrl(dateString1, url);
    const rankings2 = await getRankingsByDateAndUrl(dateString2, url);

    const rankings1Length = rankings1.length;
    const rankings2Length = rankings2.length;

    if (!rankings1Length) {
      console.log(
        `There are no rankings for ${url} on ${dateString1}, comparison is not possible.`
      );
      return null;
    }

    if (!rankings2Length) {
      console.log(
        `There are no rankings for ${url} on ${dateString2}, comparison is not possible.`
      );
      return null;
    }

    if (rankings1Length === rankings2Length) return true;

    const differenceAmount = Math.abs(rankings1Length - rankings2Length);

    const arr1 = rankings1.map(({ item }) => item);
    const arr2 = rankings2.map(({ item }) => item);
    const difference = arr1
      .filter((x) => !arr2.includes(x))
      .concat(arr2.filter((x) => !arr1.includes(x)));

    console.log(
      `There are difference (${differenceAmount}) in rankings for ${url} on ${dateString1} (${rankings1Length}) and ${dateString2} (${rankings2Length}).`
    );
    // console.log(
    //   `There are difference (${differenceAmount}) in rankings for ${url} on ${dateString1} (${rankings1Length}) and ${dateString2} (${rankings2Length}) in following items: ${difference}.`
    // );
    // return false;
  })();
};

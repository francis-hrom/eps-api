const PromisePool = require('@supercharge/promise-pool');
const scrapeViaPuppeteer = require('../utils/scrape-via-puppeteer');
const addRanking = require('./helpers/add-ranking');
const getAllTargetsWithoutTodaysRankings = require('./helpers/get-all-targets-without-todays-result');

module.exports = async (targets) => {
  const { results, errors } = await PromisePool.for(targets)
    .withConcurrency(10)
    .process(async (target) => {
      const items = await scrapeViaPuppeteer(target.url, target.selector);

      await Promise.all(
        items.map(
          async (item, index) => await addRanking(item, target.url, index)
        )
      );

      return items;
    });

  if (errors.length) {
    // console.log(
    //   `PromisePool finished with following errors: ${errors.join('; ')}`
    // );
    let targets = await getAllTargetsWithoutTodaysRankings();
    console.log(
      `After last attempt TargetsWithoutTodaysRankings: ${targets.length}`
    );
    targets.forEach((target) => console.log(target.url));

    throw new Error(
      `PromisePool finished with following errors: ${errors.join('; ')}`
    );
  }

  /*
  await Promise.allSettled(
    targets.map(async (target) => {
      const items = await scrapeViaPuppeteer(target.url, target.selector);

      await Promise.all(
        items.map(
          async (item, index) => await addRanking(item, target.url, index)
        )
      );
    })
  );
  */
};

require('dotenv').config();

const mongoose = require('mongoose');
const exportUpToDateData = require('./logic/export-up-to-date-data');
const addLog = require('./logic/helpers/add-log');
const addRanking = require('./logic/helpers/add-ranking');
const { today, isValidDate } = require('./utils');
const getRankingsByDate = require('./logic/helpers/get-rankings-by-date');
const scrapeViaPuppeteer = require('./utils/scrape-via-puppeteer');
const addTarget = require('./logic/helpers/add-target');
const getTargetsFromGsheet = require('./logic/helpers/get-targets-from-gsheet');
const exportOverviewToCsv = require('./logic/export-overview-to-csv');

const {
  env: { DATABASE_URL },
} = process;
(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    await exportOverviewToCsv(today());
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

// const addRanking = require('./logic/helpers/add-ranking');

// (async () => {
//   try {
//     const ranking = {
//       item: 'Nokia 123',
//       url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
//       rank: 1,
//     };
//     const res = await addRanking(ranking.item, ranking.url, ranking.rank);
//     console.log(res);
//   } catch (err) {
//     console.error(err);
// addLog(
//   "ERROR",
//   err,
//   `Target.url:${target.url}, Target.selector:${target.selector}`
// ).catch((err) =>
//   console.error(
//     `ERROR at saving an error to DB. Failed to save this error: ${err} Other details: Target.url:${target.url}, Target.selector:${target.selector}`
//   )
// );
//   }
// })();

// //const addResult = require("./helpers/add-result");
// const scrapeTargets = require("./logic/scrape-targets");

// (async () => {
//   try {
//     const res = await scrapeTargets(
//       "https://webscraper.io/test-sites/e-commerce/allinone/phones/touch",
//       "div > div.caption > h4:nth-child(2) > a"
//     );
//     console.log(res);
//   } catch (err) {
//     console.error(err);
//     // addLog(
//     //   "ERROR",
//     //   err,
//     //   `Target.url:${target.url}, Target.selector:${target.selector}`
//     // ).catch((err) =>
//     //   console.error(
//     //     `ERROR at saving an error to DB. Failed to save this error: ${err} Other details: Target.url:${target.url}, Target.selector:${target.selector}`
//     //   )
//     // );
//   }
// })();

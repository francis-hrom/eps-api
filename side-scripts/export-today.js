require('dotenv').config();

const mongoose = require('mongoose');
const getAllTargetsWithoutTodaysResult = require('../logic/helpers/get-all-targets-without-todays-result');
const getRankingsByDate = require('../logic/helpers/get-rankings-by-date');
const { today } = require('../utils');
const exportRankingsToCsv = require('../logic/export-rankings-to-csv');
const exportOverviewToCsv = require('../logic/export-overview-to-csv');

const DATABASE_URL = process.env.DATABASE_URL3;
(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    const targetsNoResults = await getAllTargetsWithoutTodaysResult();
    console.log(`TargetsWithoutTodaysResult: ${targetsNoResults.length}`);

    const todayVal = today();
    // const todayVal = '2021-08-01';
    const targets = await getRankingsByDate(todayVal);
    await exportRankingsToCsv(targets, todayVal);
    await exportOverviewToCsv(todayVal);

    console.log('Export DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

const exportRankingsToCsv = require('./export-rankings-to-csv');
const getAllTargetsWithoutTodaysRankings = require('./helpers/get-all-targets-without-todays-result');
const getRankingsByDate = require('./helpers/get-rankings-by-date');
const verifyTodaysRankings = require('./verify-todays-rankings');
const scrapeTargets = require('./scrape-targets');
const { today } = require('../utils');
const exportOverviewToCsv = require('./export-overview-to-csv');

module.exports = async () => {
  let targets = await getAllTargetsWithoutTodaysRankings();

  let attempt = 1;

  while (targets.length > 0) {
    if (attempt > 3) {
      continue;
    }
    console.log(
      `Attempt: ${attempt} TargetsWithoutTodaysRankings: ${targets.length}`
    );

    await scrapeTargets(targets);
    targets = await getAllTargetsWithoutTodaysRankings();

    attempt += 1;
  }

  if (targets.length === 0) {
    const todayVal = today();
    targets = await getRankingsByDate(todayVal);
    await exportRankingsToCsv(targets, todayVal);
    await exportOverviewToCsv(todayVal);
  } else {
    throw new Error('Rankings for today were not updated after 3 attempts.');
  }
};

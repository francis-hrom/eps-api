require('dotenv').config();
const mongoose = require('mongoose');
const exportUpToDateData = require('./services/export-up-to-date-data');
const addLog = require('./services/helpers/add-log');
const getAllTargetsWithoutTodaysRankings = require('./services/helpers/get-all-targets-without-todays-result');
const verifyTodaysRankings = require('./services/verify-todays-rankings');
const addNewTargetsFromGsheet = require('./services/helpers/add-new-targets-from-gsheet');
const scrapePriorityTargets = require('./services/scrape-priority-targets');
const sendEmail = require('./services/send-email');

const DATABASE_URL = process.env.DATABASE_URL3;

(async () => {
  console.time('executionTime');
  console.log('Started: ' + new Date());

  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`Connected to MongoDB ${DATABASE_URL}`);

    try {
      await addNewTargetsFromGsheet();
    } catch (error) {
      await sendEmail('ERROR - EPS GSHEET', `${error}`);
    }

    let targets = await getAllTargetsWithoutTodaysRankings();
    console.log(`TargetsWithoutTodaysRankings: ${targets.length}`);

    if (targets.length > 0) {
      console.log(
        'There are targets without updated rankings for today, starting the update process now ...'
      );
      await exportUpToDateData();
      console.log('Export to CSV complete.');
      targets = await getAllTargetsWithoutTodaysRankings();
      console.log(
        `TargetsWithoutTodaysRankings (second check): ${targets.length}`
      );
    } else {
      console.log(
        'All targets have up to date rankings for today, no need for further update.'
      );
    }

    // await verifyTodaysRankings();
    // console.log('Verification of todays rankings is complete.');

    await sendEmail('SUCCESS - EPS', 'EPS completed task without error.');
    console.log('DONE WITHOUT ERRORS.');
  } catch (error) {
    console.log('<<< --- ERROR! --- >>>');
    console.error(error);
    await sendEmail('ERROR - EPS', `${error}`);
    try {
      await addLog('ERROR', error);
    } catch (error) {
      console.error(`ERROR! Failed to save following error: ${error}`);
    }
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    console.log('Finished: ' + new Date());
    console.timeEnd('executionTime');
  }
})();

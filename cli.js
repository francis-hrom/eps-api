require('dotenv').config();
const mongoose = require('mongoose');
const exportUpToDateData = require('./logic/export-up-to-date-data');
const addLog = require('./logic/helpers/add-log');
const getAllTargetsWithoutTodaysRankings = require('./logic/helpers/get-all-targets-without-todays-result');
const verifyTodaysRankings = require('./logic/verify-todays-rankings');
const addNewTargetsFromGsheet = require('./logic/helpers/add-new-targets-from-gsheet');

const DATABASE_URL = process.env.DATABASE_URL3;

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`Connected to MongoDB ${DATABASE_URL}`);

    await addNewTargetsFromGsheet();

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

    await verifyTodaysRankings();
    console.log('Verification of todays rankings is complete.');

    console.log('DONE WITHOUT ERRORS.');
  } catch (error) {
    console.log('<<< --- ERROR! --- >>>');
    console.error(error);
    try {
      await addLog('ERROR', error);
    } catch (error) {
      console.error(`ERROR! Failed to save following error: ${error}`);
    }
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
})();

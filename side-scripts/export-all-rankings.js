require('dotenv').config();

const mongoose = require('mongoose');
const getAllRankings = require('../logic/helpers/get-all-rankings');

const exportRankingsToCsv = require('../logic/export-rankings-to-csv');

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

    const rankings = await getAllRankings();
    await exportRankingsToCsv(rankings);

    console.log('Export DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

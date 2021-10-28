require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL3;
const Ranking = require('../models/ranking');
const getDatesBetweenDates = require('../utils/get-dates-between-dates');
const today = require('../utils/today');

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    const dates = getDatesBetweenDates('2021-07-23', today());

    const dailyAmountsOfTargets = [];
    for (const date of dates) {
      const uniqueTargetUrls = await Ranking.find({
        date: {
          $gte: `${date}T00:00:00.000Z`,
          $lte: `${date}T23:59:59.999Z`,
        },
      })
        .distinct('url')
        .lean();

      dailyAmountsOfTargets.push({
        date,
        targetsAmount: uniqueTargetUrls.length,
      });
    }

    const file = path.join(
      process.cwd(),
      'export-csv',
      `_export_daily_amounts_of_targets.csv`
    );

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);

      // Write Headers to CSV
      writeStream.write(`Date,Targets_amount`);

      dailyAmountsOfTargets.forEach((day) => {
        // write Row to CSV
        writeStream.write(`\n${day.date},${day.targetsAmount}`);
      });

      writeStream.end(resolve);
      writeStream.on('error', reject);
    });

    console.log('DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    const items = await ItemProvider.distinct('item').lean();
    console.log('ItemProviders amount: ' + items.length);

    const textArr = [];
    items.forEach((item) => {
      const words = item.toLowerCase().split(' ');
      textArr.push(...words);
    });

    const wordCounts = _.countBy(textArr);

    const wordCountsSorted = Object.fromEntries(
      Object.entries(wordCounts).sort(([, a], [, b]) => b - a)
    );

    const uniqueWords = _.keys(wordCountsSorted);
    console.log('uniqueWords amount: ' + uniqueWords.length);

    const file = path.join(
      process.cwd(),
      'export-csv',
      `_word_count_from_itemProviders.csv`
    );

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);

      // Write Headers to CSV
      writeStream.write(`Word,Count\n`);

      uniqueWords.forEach((word) => {
        // write Row to CSV
        writeStream.write(`"${word}",${wordCounts[word]}\n`);
      });

      writeStream.end(resolve);
      writeStream.on('error', reject);

      console.log('DONE.');
    });
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

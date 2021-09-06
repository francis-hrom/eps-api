require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');
const Ranking = require('../models/ranking');
const { cleanTextRemoveSpaces } = require('../utils');
const wordBlacklist = require('./word-blacklist');
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

    const itemProviders = await ItemProvider.find().lean();
    const itemsWithProvidersClean = await ItemProvider.distinct(
      'item_clean'
    ).lean();

    console.log(
      'itemsWithProvidersClean amount: ' + itemsWithProvidersClean.length
    );

    const items = await Ranking.find({ rank: { $gte: 1, $lte: 100 } })
      .distinct('item')
      .sort()
      .lean();
    console.log('items amount: ' + items.length);

    const itemsWithoutProvider = [];
    const alreadyAddedClean = [];
    items.forEach((item) => {
      const itemClean = cleanTextRemoveSpaces(item);
      if (
        !itemsWithProvidersClean.includes(itemClean) &&
        !alreadyAddedClean.includes(itemClean)
      ) {
        itemsWithoutProvider.push(item);
        alreadyAddedClean.push(itemClean);
      }
    });
    console.log('itemsWithoutProvider amount: ' + itemsWithoutProvider.length);

    const itemsWithPossibleMatches = [];
    itemsWithoutProvider.forEach((item) => {
      const itemWords = item.split(' ');
      const possibleMatches = [];

      itemWords.forEach((word) => {
        if (!wordBlacklist.includes(word)) {
          itemProviders.forEach((itemProvider) => {
            const itemProviderWords = itemProvider.item.split(' ');
            if (itemProviderWords.includes(word)) {
              // if (!possibleMatches.includes(itemProvider)) {
              possibleMatches.push(itemProvider);
              // }
            }
          });
        }
      });

      if (possibleMatches.length > 0) {
        const uniqueMatches = [...new Set(possibleMatches)];
        uniqueMatches.forEach((match) => {
          const matchCount = possibleMatches.filter(
            (obj) => obj.item === match.item
          ).length;
          itemsWithPossibleMatches.push({
            item,
            itemMatch: match.item,
            provider: match.provider,
            matchCount,
          });
        });
      }
    });

    console.log(
      'itemsWithPossibleMatches amount: ' + itemsWithPossibleMatches.length
    );

    itemsWithPossibleMatches.sort((a, b) =>
      a.matchCount > b.matchCount ? -1 : 1
    );

    const file = path.join(
      process.cwd(),
      'export-csv',
      `_export_export-items-without-provider-with-rank-1-100-possible-matches.csv`
    );

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);

      // Write Headers to CSV
      writeStream.write(
        `Item,Possible_match,Provider,Match_count,Item_clean\n`
      );

      itemsWithPossibleMatches.forEach((el) => {
        // write Row to CSV

        const cleanItem = cleanTextRemoveSpaces(el.item);
        writeStream.write(
          `"${el.item}","${el.itemMatch}","${el.provider}",${el.matchCount},${cleanItem}\n`
        );
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

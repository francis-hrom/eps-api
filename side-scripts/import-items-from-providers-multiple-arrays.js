require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');
const newItemProviders = require('./import-items-from-providers-multiple-arrays_INPUT');
const { cleanTextRemoveSpaces } = require('../utils');

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    console.log('New itemProviders amount: ' + newItemProviders.length);

    const existingItemProviders = await ItemProvider.find().lean();
    console.log(
      'existingItemProviders amount: ' + existingItemProviders.length
    );

    let existingItemsClean = new Set();
    existingItemProviders.forEach((el) =>
      existingItemsClean.add(el.item_clean)
    );
    existingItemsClean = [...existingItemsClean];
    console.log('existingItemsClean amount: ' + existingItemsClean.length);

    const itemProviderArr = [];
    const alreadyIncluded = [];
    newItemProviders.forEach((el) => {
      if (el.items && el.provider) {
        el.items.forEach((item) => {
          const item_clean = cleanTextRemoveSpaces(item);
          if (
            !existingItemsClean.includes(item_clean) &&
            !alreadyIncluded.includes(item_clean)
          ) {
            itemProviderArr.push({
              item: item,
              item_clean: item_clean,
              provider: el.provider,
              provider_clean: cleanTextRemoveSpaces(el.provider),
            });
            alreadyIncluded.push(item_clean);
          }
        });
      }
    });

    console.log('itemProviderArr amount:' + itemProviderArr.length);
    const savedItemProviders = await ItemProvider.insertMany(itemProviderArr, {
      ordered: false,
    });
    console.log('savedItemProviders: ' + savedItemProviders.length);

    console.log('DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

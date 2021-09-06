require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');
const newItemProviders = require('./import-itemProviders-mix_INPUT');
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
    newItemProviders.forEach((el) => {
      if (el.source && el.data) {
        el.data.forEach((item) => {
          if (!existingItemsClean.includes(cleanTextRemoveSpaces(item.name))) {
            itemProviderArr.push({
              item: item.name,
              item_clean: cleanTextRemoveSpaces(item.name),
              provider: item.provider,
              provider_clean: cleanTextRemoveSpaces(item.provider),
              source: el.source,
            });
          }
        });
      }
    });

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

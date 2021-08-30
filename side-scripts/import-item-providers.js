require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');
const newItemProviders = require('./import-item-providers_INPUT');
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
      if (el.name && el.provider) {
        if (!existingItemsClean.includes(cleanTextRemoveSpaces(el.name))) {
          itemProviderArr.push({
            item: el.name,
            item_clean: cleanTextRemoveSpaces(el.name),
            provider: el.provider,
            provider_clean: cleanTextRemoveSpaces(el.provider),
          });
        }
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

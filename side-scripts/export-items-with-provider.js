require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');

const fs = require('fs');
const path = require('path');

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    const itemProviders = await ItemProvider.find()
      .sort({ item: 'ascending' })
      .lean();
    console.log('ItemProviders amount: ' + itemProviders.length);

    const file = path.join(
      process.cwd(),
      'export-csv',
      `_export_items_with_provider.csv`
    );

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);

      // Write Headers to CSV
      writeStream.write(`Item,Item_clean,Provider,Provider_clean\n`);

      itemProviders.forEach((el) => {
        // write Row to CSV
        writeStream.write(
          `"${el.item}",${el.item_clean},"${el.provider}",${el.provider_clean}\n`
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

require('dotenv').config();
const mongoose = require('mongoose');
fs = require('fs');

const Ranking = require('../models/ranking');
const { cleanTextRemoveSpaces } = require('../utils');

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

    const rankings = await Ranking.find({}).lean();
    const names = new Set();

    rankings.forEach((ranking) =>
      names.add(cleanTextRemoveSpaces(ranking.item))
    );

    console.log([...names].length);
    fs.writeFileSync('./_export.txt', [...names].sort().join(','));
    console.log('DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

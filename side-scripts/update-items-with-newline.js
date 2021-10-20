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

    // const rankings = await Ranking.find("item": {new  RegExp('\n') }).lean();
    let rankings = await Ranking.find({
      item: { $regex: '\n' },
    });
    console.log('rankings.length: ' + rankings.length);

    rankings.forEach(async (ranking) => {
      const rkFind = await Ranking.findOne({ _id: ranking._id });
      console.log(rkFind);

      const updatedRanking = await Ranking.updateOne(
        { _id: ranking._id },
        { $set: { item: ranking.item.replace(/\s+/g, ' ').trim() } }
      );
      console.log('Updated ranking:');
      console.log(updatedRanking);
    });

    rankings = await Ranking.find({
      item: { $regex: '\n' },
    });

    console.log('rankings.length: ' + rankings.length);
    console.log('DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

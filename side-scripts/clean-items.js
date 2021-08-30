require('dotenv').config();

const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const PromisePool = require('@supercharge/promise-pool');

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

    let rankings = await Ranking.find({});
    console.log(rankings.length);
    // rankings = rankings.slice(0, 50);

    let mySet = new Set();
    rankings.forEach((ranking) => {
      const specialChars = ranking.item.replace(/[a-zA-Z0-9]/g, '');
      [...specialChars].forEach((char) => mySet.add(char));
    });

    console.log([...mySet].join(''));
    const charObj = {};
    mySet.forEach((char) => {
      charObj[char] = char.charCodeAt();
      // console.log(char);

      // console.log(char.charCodeAt());
    });

    console.log(charObj);

    // const { results, errors } = await PromisePool.for(rankings)
    //   .withConcurrency(10)
    //   .process(async (ranking) => {
    //     console.log(ranking.item);
    //     const oldItem = '' + ranking.item;
    //     ranking.item
    //       .replace(/['’`´]/g, '')
    //       .replace(/[^a-zA-Z0-9]/g, ' ')
    //       .replace(/  +/g, ' ')
    //       .toLowerCase()
    //       .trim();
    //     const updatedRanking = await ranking.save();
    //     console.log(oldItem);
    //     console.log(updatedRanking.item);
    //   });

    // if (errors.length) {
    //   throw new Error(
    //     `PromisePool finished with following errors: ${errors.join('; ')}`
    //   );
    // }

    console.log('DONE.');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

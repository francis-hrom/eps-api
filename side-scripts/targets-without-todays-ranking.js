require('dotenv').config();

const mongoose = require('mongoose');
const getAllTargetsWithoutTodaysResult = require('../services/helpers/get-all-targets-without-todays-result');

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

    const targets = await getAllTargetsWithoutTodaysResult();
    targets.forEach((target) => console.log(target.url));
    console.log(targets.length);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

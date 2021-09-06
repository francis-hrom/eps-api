require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const targetsRouter = require('./routes/targets');
const rankingsRouter = require('./routes/rankings');
const scrapeRouter = require('./routes/scrape');
const usersRouter = require('./routes/users');

const { DATABASE_URL, PORT, TOKEN_KEY } = process.env;

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(`connected to MongoDB ${DATABASE_URL}`);

    const app = express();

    app.use(express.json());
    app.use(cors());

    // routes
    app.use('/targets', targetsRouter);
    app.use('/rankings', rankingsRouter);
    app.use('/scrape', scrapeRouter);
    app.use('/users', usersRouter);

    app.listen(PORT, () => console.log(`server started on port ${PORT}`));

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();

        console.log('disconnected from MongoDB');
        console.log('stopping server');
      } catch (error) {
        console.error(error);
      } finally {
        process.exit(0);
      }
    });
  } catch (error) {
    console.error(error);
  }
})();

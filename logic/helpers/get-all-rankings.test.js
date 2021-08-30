const mongoose = require('mongoose');
const getAllRankings = require('./get-all-rankings');
const Ranking = require('../../models/ranking');

const rankingsData = [
  {
    item: 'Nokia XYZ',
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    rank: 1,
  },
  {
    item: 'Samsung Galaxy',
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    rank: 2,
  },
];

describe('get-all-rankings.js', () => {
  beforeAll(async () => {
    jest.resetAllMocks();

    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    await Promise.all(
      rankingsData.map(async (ranking) => {
        const newRanking = new Ranking(ranking);
        await newRanking.save();
      })
    );
  });

  test('getAllRankings function exists', () => {
    expect(typeof getAllRankings).toEqual('function');
  });

  test('return all rankings', async () => {
    const rankings = await getAllRankings();

    expect(rankings).toBeDefined();
    expect(rankings.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

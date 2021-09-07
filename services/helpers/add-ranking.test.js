const mongoose = require('mongoose');
const addRanking = require('./add-ranking');

const rankingData = {
  item: 'Nokia XYZ',
  url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
  rank: 1,
};

describe('add-ranking.js', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  test('addRanking function exists', () => {
    expect(typeof addRanking).toEqual('function');
  });

  it('create & save ranking successfully', async () => {
    const savedRanking = await addRanking(
      rankingData.item,
      rankingData.url,
      rankingData.rank
    );

    expect(savedRanking._id).toBeDefined();
    expect(savedRanking.item).toBe(rankingData.item.toLowerCase());
    expect(savedRanking.url).toBe(rankingData.url);
    expect(savedRanking.rank).toBe(rankingData.rank + 1);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

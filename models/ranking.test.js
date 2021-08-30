const mongoose = require('mongoose');
const Ranking = require('./ranking');

const rankingData = {
  item: 'Nokia 123',
  url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
  rank: 1,
};

describe('Ranking Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  it('create & save ranking successfully', async () => {
    const validRanking = new Ranking({
      item: rankingData.item,
      url: rankingData.url,
      rank: rankingData.rank,
    });
    const savedRanking = await validRanking.save();

    expect(savedRanking._id).toBeDefined();
    expect(savedRanking.item).toBe(rankingData.item);
    expect(savedRanking.url).toBe(rankingData.url);
    expect(savedRanking.rank).toBe(rankingData.rank);
  });

  it('insert ranking successfully, but the field does not defined in schema should be undefined', async () => {
    const rankingWithInvalidField = new Ranking({
      item: 'Nokia 123',
      url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
      rank: 1,
      type: 'smartphone',
    });
    const savedRankingWithInvalidField = await rankingWithInvalidField.save();
    expect(savedRankingWithInvalidField._id).toBeDefined();
    expect(savedRankingWithInvalidField.type).toBeUndefined();
  });

  it('create ranking without required field should failed', async () => {
    const rankingWithoutRequiredField = new Ranking({ item: 'Nokia 123' });
    let err;
    try {
      const savedRankingWithoutRequiredField =
        await rankingWithoutRequiredField.save();
      error = savedRankingWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

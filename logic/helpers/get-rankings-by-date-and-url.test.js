const mongoose = require('mongoose');
const getRankingsByDateAndUrl = require('./get-rankings-by-date-and-url');
const Ranking = require('../../models/ranking');
const { today } = require('../../utils');

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

describe('get-rankings-by-date-and-url.js', () => {
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

  test('getRankingsByDateAndUrl function exists', () => {
    expect(typeof getRankingsByDateAndUrl).toEqual('function');
  });

  test('should throw an error if called with dateString which is not a string', () => {
    expect(() => {
      getRankingsByDateAndUrl(20210228, rankingsData[0].url);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with invalid date', () => {
    expect(() => {
      getRankingsByDateAndUrl('2021-02-36', rankingsData[0].url);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with url which is not a string', () => {
    expect(() => {
      getRankingsByDateAndUrl(today(), 1);
    }).toThrow(TypeError);
  });

  test('return rankings with specified date', async () => {
    const rankings = await getRankingsByDateAndUrl(
      today(),
      rankingsData[0].url
    );

    expect(rankings).toBeDefined();
    expect(rankings.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

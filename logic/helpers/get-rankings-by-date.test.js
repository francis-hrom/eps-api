const mongoose = require('mongoose');
const getRankingsByDate = require('./get-rankings-by-date');
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

describe('get-rankings-by-date.js', () => {
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

  test('getRankingsByDate function exists', () => {
    expect(typeof getRankingsByDate).toEqual('function');
  });

  test('should throw an error if called with dateString which is not a string', () => {
    expect(() => {
      getRankingsByDate(20210228);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with invalid date', () => {
    expect(() => {
      getRankingsByDate('2021-02-36');
    }).toThrow(TypeError);
  });

  test('return rankings with todays date', async () => {
    // ? find a way how to test this without usage of today()

    const todaysRankings = await getRankingsByDate(today());

    expect(todaysRankings).toBeDefined();
    expect(todaysRankings.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

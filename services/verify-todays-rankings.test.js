const mongoose = require('mongoose');
const verifyTodaysRankings = require('./verify-todays-rankings');
const Ranking = require('../models/ranking');
const Target = require('../models/target');
const { today, otherDate } = require('../utils');

const urls = ['https://example-null.com', 'https://example-with-number.com'];
const todayVal = today();
const yesterday = otherDate(todayVal, -1);

const dateString1 = todayVal;
const dateString2 = yesterday;

const date1 = new Date(dateString1);
const date2 = new Date(dateString2);

const targetsData = [
  { url: urls[0], selector: 'h1' },
  { url: urls[1], selector: 'h2' },
];

const rankingsData = [
  {
    item: 'Item for https://example-null.com',
    url: 'https://example-null.com',
    rank: 1,
    date: date1,
  },
  {
    item: 'Item1',
    url: 'https://example-with-number.com',
    rank: 1,
    date: date1,
  },
  {
    item: 'Item2',
    rank: 2,
    url: 'https://example-with-number.com',
    date: date1,
  },
  {
    item: 'Item1',
    url: 'https://example-with-number.com',
    rank: 1,
    date: date2,
  },
  {
    item: 'Item2',
    rank: 2,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item3',
    url: 'https://example-with-number.com',
    rank: 3,
    date: date2,
  },
  {
    item: 'Item4',
    rank: 4,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item5',
    url: 'https://example-with-number.com',
    rank: 5,
    date: date2,
  },
  {
    item: 'Item6',
    rank: 6,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item7',
    url: 'https://example-with-number.com',
    rank: 7,
    date: date2,
  },
  {
    item: 'Item8',
    rank: 8,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item9',
    url: 'https://example-with-number.com',
    rank: 9,
    date: date2,
  },
  {
    item: 'Item10',
    rank: 10,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item11',
    url: 'https://example-with-number.com',
    rank: 11,
    date: date2,
  },
  {
    item: 'Item12',
    rank: 12,
    url: 'https://example-with-number.com',
    date: date2,
  },
  {
    item: 'Item13',
    rank: 13,
    url: 'https://example-with-number.com',
    date: date2,
  },
];

describe('verify-todays-rankings.js', () => {
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

    await Promise.all(
      targetsData.map(async (target) => {
        const newTarget = new Target(target);
        await newTarget.save();
      })
    );
  });

  describe('verifyTodaysRankings function exists', () => {
    it('should exist', () => {
      expect(typeof verifyTodaysRankings).toEqual('function');
    });
  });

  test('should return array with correct results', async () => {
    const result = await verifyTodaysRankings();

    expect(result.length).toBe(1);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify([{ url: urls[1], difference: 11 }])
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

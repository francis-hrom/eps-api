const mongoose = require('mongoose');
const compareRankings = require('./compare-rankings');
const Ranking = require('../models/ranking');

const urls = [
  'https://example-null.com/',
  'https://example-true.com/',
  'https://example-false.com/',
];
const dateString1 = '2021-01-20';
const dateString2 = '2021-01-21';

const date1 = new Date('2021-01-20');
const date2 = new Date('2021-01-21');

const rankingsData = [
  {
    item: 'Item for https://example-null.com/',
    url: 'https://example-null.com/',
    rank: 1,
    date: date1,
  },
  {
    item: 'Item1',
    url: 'https://example-true.com/',
    rank: 1,
    date: date1,
  },
  {
    item: 'Item2',
    rank: 2,
    url: 'https://example-true.com/',
    date: date1,
  },
  {
    item: 'Item3',
    url: 'https://example-true.com/',
    rank: 3,
    date: date2,
  },
  {
    item: 'Item4',
    rank: 4,
    url: 'https://example-true.com/',
    date: date2,
  },
  {
    item: 'Item1',
    url: 'https://example-false.com/',
    rank: 1,
    date: date1,
  },
  {
    item: 'Item2',
    rank: 2,
    url: 'https://example-false.com/',
    date: date1,
  },
  {
    item: 'Item3',
    url: 'https://example-false.com/',
    rank: 3,
    date: date2,
  },
];

describe('compare-rankings.js', () => {
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

  test('compareRankings function exists', () => {
    expect(typeof compareRankings).toEqual('function');
  });

  test('should throw an error if called with dateString which is not a string', () => {
    expect(() => {
      compareRankings('https://example.com', 123, dateString2);
    }).toThrow(TypeError);
    expect(() => {
      compareRankings('https://example.com', dateString1, 456);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with invalid date', () => {
    expect(() => {
      compareRankings('https://example.com', '2021-02-36', dateString2);
      compareRankings('https://example.com', dateString1, '2021-02-36');
    }).toThrow(TypeError);
  });

  test('return all rankings', async () => {
    const comparison1 = await compareRankings(
      urls[0],
      dateString1,
      dateString2
    );
    const comparison2 = await compareRankings(
      urls[1],
      dateString1,
      dateString2
    );
    const comparison3 = await compareRankings(
      urls[2],
      dateString1,
      dateString2
    );

    expect(comparison1).toBe(null);
    expect(comparison2).toBe(true);
    expect(comparison3).toBe(false);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

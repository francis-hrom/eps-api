const mongoose = require('mongoose');
const getAllTargetsWithoutTodaysResult = require('./get-all-targets-without-todays-result');
const Ranking = require('../../models/ranking');
const Target = require('../../models/target');
const { today, otherDate } = require('../../utils');

const yesterday = otherDate(today(), -1);
const rankingsData = [
  {
    item: 'Nokia XYZ',
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    rank: 1,
    date: yesterday,
  },
  {
    item: 'Samsung Galaxy',
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    rank: 2,
    date: yesterday,
  },
  {
    item: 'Example item',
    url: 'https://example.com',
    rank: 1,
  },
];
const targetData = [
  {
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    selector: 'div>h1',
  },
  {
    url: 'https://example.com',
    selector: 'div>h1>span',
  },
];

describe('get-all-targets-without-todays-result.js', () => {
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
      targetData.map(async (target) => {
        const newTarget = new Target(target);
        await newTarget.save();
      })
    );
  });

  test('getAllTargetsWithoutTodaysResult function exists', () => {
    expect(typeof getAllTargetsWithoutTodaysResult).toEqual('function');
  });

  test('return targets without ', async () => {
    const targets = await getAllTargetsWithoutTodaysResult();

    expect(targets).toBeDefined();
    expect(targets.length).toBe(1);
    expect(targets[0].url).toBe(targetData[0].url);
    expect(targets[0].selector).toBe(targetData[0].selector);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

const mongoose = require('mongoose');
const getAllUrlsFromAllTargets = require('./get-all-urls-from-all-targets');
const Target = require('../../models/target');

const targetsData = [
  {
    url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
    selector: 'div>h1',
  },
  {
    url: 'https://example.com',
    selector: 'div>h1>span',
  },
];

describe('get-all-urls-from-all-targets.js', () => {
  beforeAll(async () => {
    jest.resetAllMocks();

    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    await Promise.all(
      targetsData.map(async (target) => {
        const newTarget = new Target(target);
        await newTarget.save();
      })
    );
  });

  test('getAllUrlsFromAllTargets function exists', () => {
    expect(typeof getAllUrlsFromAllTargets).toEqual('function');
  });

  test('return all urls from all targets', async () => {
    const urls = await getAllUrlsFromAllTargets();

    expect(urls).toBeDefined();
    expect(urls.length).toBe(2);
    expect(urls[0]).toBe(targetsData[1].url);
    expect(urls[1]).toBe(targetsData[0].url);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

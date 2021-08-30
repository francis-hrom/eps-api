const mongoose = require('mongoose');
const getAllTargets = require('./get-all-targets');
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

describe('get-all-targets.js', () => {
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

  test('getAllTargets function exists', () => {
    expect(typeof getAllTargets).toEqual('function');
  });

  test('return all targets', async () => {
    const targets = await getAllTargets();

    expect(targets).toBeDefined();
    expect(targets.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

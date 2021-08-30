const mongoose = require('mongoose');
const addTarget = require('./add-target');

const targetData = {
  url: 'https://EXAMPLE.   com/test-sites////',
  selector: 'div>h1>span',
};

describe('add-target.js', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  test('addTarget function exists', () => {
    expect(typeof addTarget).toEqual('function');
  });

  it('create & save target successfully', async () => {
    const savedTarget = await addTarget(targetData.url, targetData.selector);

    expect(savedTarget._id).toBeDefined();
    expect(savedTarget.url).toBe('https://example.com/test-sites');
    expect(savedTarget.selector).toBe('div>h1>span');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});

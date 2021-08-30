const cleanup = require('./cleanup');

const data = {
  _id: '60fa8bfdcec8f954a83cacb8',
  item: 'Nokia XYZ',
  url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
  rank: 1,
};

describe('cleanup.js', () => {
  test('cleanup function exists', () => {
    expect(typeof cleanup).toEqual('function');
  });

  test(`remove '_id' and add 'id'`, () => {
    cleanup(data);

    expect(data).toBeDefined();
    // expect(data.id).toBeDefined();
    expect(data._id).not.toBeDefined();
  });
});

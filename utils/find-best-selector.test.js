const findBestSelector = require('./find-best-selector');

jest.setTimeout(30000);

describe('find-best-selector.js', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  test('findBestSelector function exists', () => {
    expect(typeof findBestSelector).toEqual('function');
  });

  test('should throw an error if called with url which is not a string', () => {
    expect(() => {
      findBestSelector(123, 'div>h1');
    }).toThrow(TypeError);
  });

  test('should throw an error if called with textArr which is not an array', () => {
    expect(() => {
      findBestSelector('https://example.com', 123);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with textArr which is empty', () => {
    expect(() => {
      findBestSelector('https://example.com', []);
    }).toThrow(Error);
  });

  test('return correct data from website', async () => {
    const url =
      'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch';
    const textArr = ['Nokia 123', 'LG Optimus', 'Samsung Galaxy'];

    const selector = await findBestSelector(url, textArr);
    expect(selector).toEqual(
      'html>body>div>div>div>div>div>div>div>div>h4>a:nth-of-type(1)'
    );
  });
});

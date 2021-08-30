const scrapeViaPuppeteer = require('./scrape-via-puppeteer');

jest.setTimeout(30000);

describe('scrape-via-puppeteer.js', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  test('scrapeViaPuppeteer function exists', () => {
    expect(typeof scrapeViaPuppeteer).toEqual('function');
  });

  test('should throw an error if called with url which is not a string', () => {
    expect(() => {
      scrapeViaPuppeteer(123, 'div>h1');
    }).toThrow(TypeError);
  });

  test('should throw an error if called with selector which is not a string', () => {
    expect(() => {
      scrapeViaPuppeteer('https://example.com', 123);
    }).toThrow(TypeError);
  });

  test('return correct data from website', async () => {
    const items = await scrapeViaPuppeteer(
      'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
      'div > div.caption > h4:nth-child(2) > a'
    );
    expect(items).toEqual([
      'Nokia 123',
      'LG Optimus',
      'Samsung Galaxy',
      'Nokia X',
      'Sony Xperia',
      'Ubuntu Edge',
      'Iphone',
      'Iphone',
      'Iphone',
    ]);
  });
});

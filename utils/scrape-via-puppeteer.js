//const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

module.exports = (url, selector) => {
  if (typeof url !== 'string') {
    throw new TypeError('Url is not a string.');
  }
  if (typeof selector !== 'string') {
    throw new TypeError('Selector is not a string.');
  }

  /* istanbul ignore next */
  return (async () => {
    let browser;
    const width = 1920;
    const height = 1048;

    try {
      // HEROKU
      // browser = await puppeteer.launch({
      //   headless: true,
      //   args: ['--no-sandbox'],
      // });

      // const page = await browser.newPage();

      // await page.goto(url, {
      //   timeout: 30000,
      //   waitUntil: ['load'],
      // });

      // try {
      //   await page.waitForSelector(selector, {
      //     visible: true,
      //     timeout: 30000,
      //   });
      // } catch (error) {
      //   throw new Error(
      //     `Puppeteer timeout at url: ${url}, selector:${selector} Error message: ${error}`
      //   );
      // }

      // for further testing
      puppeteer.use(StealthPlugin());

      browser = await puppeteer.launch({
        headless: true,
        args: [`--window-size=${width},${height}`],
        defaultViewport: {
          width,
          height,
        },
      });

      const page = await browser.newPage();

      //  https://github.com/puppeteer/puppeteer/issues/665
      // ? fake user agent generator
      // ? puppeteer-extra with stealth mode
      // EXPERIMENT

      // await page.setExtraHTTPHeaders({
      //   'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      // });

      // await page.setUserAgent(
      //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
      // );

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
      );

      // end of EXPERIMENT

      try {
        await page.goto(url, {
          // timeout: 180000,
          timeout: 300000,
          // waitUntil: ['load'],
        });
      } catch (error) {
        throw new Error(
          `goto timeout at url: ${url}, selector:${selector} Error message: ${error}`
        );
      }
      // waitUntil cause problems on certain websites
      // waitUntil all options: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
      //   waitUntil: ['load'], all except 1

      await page.waitForTimeout(30000);

      // waitForTimeout seem as the most universal solution for every website, however this would slow down things overall

      // 20s all except 7
      // 25s all except 1
      // 30s all except 1
      // 45s all except 1
      // 60s all except 2

      try {
        await page.waitForSelector(selector, {
          // visible: true,
          timeout: 120000,
        });
      } catch (error) {
        throw new Error(
          `waitForSelector timeout at url: ${url}, selector:${selector} Error message: ${error}`
        );
      }

      // waitForSelector visible: true cause around 34 pages not to throw error
      // ? every target should have custom config

      // with PromisePool.withConcurrency(1) it worked for all remaining pages

      const items = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) throw new Error('selector not present');

        const arr = [];

        Array.from(elements).forEach((el) => {
          arr.push(el.innerText.replace(/\s+/g, ' ').trim());
        });

        return arr;
      }, selector);

      return items;
    } finally {
      browser && (await browser.close());
    }
  })();
};

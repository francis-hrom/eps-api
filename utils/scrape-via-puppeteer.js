const puppeteer = require('puppeteer');

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
      // heroku
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
        // defaultViewport: {
        //   width,
        //   height,
        // },
      });

      // for further testing
      // browser = await puppeteer.launch({
      //   headless: true,
      //   args: [`--window-size=${width},${height}`],
      //   defaultViewport: {
      //     width,
      //     height,
      //   },
      // });

      const page = await browser.newPage();

      await page.goto(url, {
        timeout: 30000,
        waitUntil: ['load'],
      });
      // waitUntil cause problems on certain websites
      // waitUntil all options: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],

      // await page.waitForTimeout(30000);
      // waitForTimeout seem as the most universal solution for every website, however this would slow down things overall
      // 20s all except 7
      // 30 s all except 1

      try {
        await page.waitForSelector(selector, {
          // visible: true,
          timeout: 30000,
        });
      } catch (error) {
        throw new Error(
          `Puppeteer timeout at url: ${url}, selector:${selector} Error message: ${error}`
        );
      }

      const items = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) throw new Error('selector not present');

        const arr = [];

        Array.from(elements).forEach((el) => {
          arr.push(el.innerText.replace(/\s\s+/g, ''));
        });

        return arr;
      }, selector);

      return items;
    } finally {
      browser && (await browser.close());
    }
  })();
};

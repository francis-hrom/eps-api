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
      browser = await puppeteer.launch({
        headless: true,
        args: [`--window-size=${width},${height}`],
        defaultViewport: {
          width,
          height,
        },
      });

      const page = await browser.newPage();

      //await page.goto(url);

      // there might be situations when "waitUntil" will timeout, to be tested on the specific URLs
      // and then things can be removed in order to better match the use case scenario
      await page.goto(url, {
        timeout: 30000,
        // waitUntil: ['load'],
      });

      // ?waitUntil cause problems on certain websites, waitForSelector should be sufficient
      // WORKING: waitUntil: ['load'],
      // waitUntil all options: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],

      // if previous waitUntil has not resulted in timeout, then everything should be loaded,
      // so waitForSelector should possible to lower to 1000ms
      // waitForSelector option visible: true was causing problems on certain websites, but it was needed on other

      // ? increase to 10s
      // even with 10s waitForTimeout around 10 sites are not working, same domain based
      // waitForTimeout 20s seems to work for majority of websites except one (which was already visited several times, so captcha was there)
      // 20s all except 7
      // 30 s all except 1
      await page.waitForTimeout(30000);

      // await page.waitForTimeout(5000);
      // ? waitForTimeout is possibly universal solution for every website, however might slow down things overall

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

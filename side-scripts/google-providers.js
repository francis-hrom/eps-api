require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL3;
const ItemProvider = require('../models/itemProvider');
const Ranking = require('../models/ranking');
const { cleanTextRemoveSpaces } = require('../utils');

const PromisePool = require('@supercharge/promise-pool');
const puppeteer = require('puppeteer');
const sendEmail = require('../services/send-email');

(async (site) => {
  let browser;

  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`connected to MongoDB ${DATABASE_URL}`);

    // const itemProviders = await ItemProvider.find().lean();
    const itemsWithProvidersClean = await ItemProvider.distinct(
      'item_clean'
    ).lean();

    console.log(
      'itemsWithProvidersClean amount: ' + itemsWithProvidersClean.length
    );

    const items = await Ranking.distinct('item').sort().lean();
    console.log('items amount: ' + items.length);

    await mongoose.connection.close();
    console.log('disconnected from MongoDB');

    const itemsWithoutProvider = [];
    const alreadyAddedClean = [];
    items.forEach((item) => {
      const itemClean = cleanTextRemoveSpaces(item);
      if (
        !itemsWithProvidersClean.includes(itemClean) &&
        !alreadyAddedClean.includes(itemClean)
      ) {
        itemsWithoutProvider.push(item.replace(/\s+/g, ' ').trim());
        alreadyAddedClean.push(itemClean);
      }
    });

    console.log('itemsWithoutProvider amount: ' + itemsWithoutProvider.length);

    // load from  CSV

    const file = path.join(
      process.cwd(),
      'export-csv',
      `_export_googled_providers.csv`
    );

    let data = require('fs').readFileSync(file, 'utf8');

    const arr = data.split('\n');

    const objArr = [];
    const alreadySearchedUrls = [];
    const alreadySearchedItems = [];
    arr.forEach((row) => {
      const rowEls = row.split(',');
      if (rowEls[3]) {
        objArr.push({
          url: rowEls[0],
          item: rowEls[1].replace(/"/g, ''),
          provider: rowEls[3],
        });
        alreadySearchedItems.push(rowEls[1].replace(/"/g, ''));
        alreadySearchedUrls.push(rowEls[0]);
      }
    });

    const itemProviderSearches = objArr;

    const itemsWithoutProviderNotSearched = [];
    itemsWithoutProvider.forEach((item) => {
      const searchPhrase = item.replace(/[\s, +]+/g, '+');
      const url = `https://www.google.com/search?q=site%3A${site}+${searchPhrase}`;

      if (!alreadySearchedUrls.includes(url)) {
        itemsWithoutProviderNotSearched.push(item);
      }
    });

    const total = itemsWithoutProviderNotSearched.length;
    let count = 0;
    console.log('itemsWithoutProviderNotSearched: ' + total);

    // google it one by one

    browser = await puppeteer.launch({ headless: false });

    const { results, errors } = await PromisePool.for(
      itemsWithoutProviderNotSearched
    )
      .withConcurrency(1)
      .process(async (item) => {
        const searchPhrase = item.replace(/[\s, +]+/g, '+');
        const url = `https://www.google.com/search?q=site%3A${site}+${searchPhrase}`;

        if (alreadySearchedUrls.includes(item)) {
          // console.log('Already searched ' + url);
          return;
        }

        count = count + 1;
        console.log(`Progress: ${count}/${total}`);

        console.log(url);
        console.log('Time: ' + new Date());
        const page = await browser.newPage();

        try {
          await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          });

          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
          );

          await page.goto(url, {
            timeout: 10000,
          });

          await page.waitForTimeout(60000);

          await page.waitForSelector('div > cite > span', {
            // visible: true,
            timeout: 11000,
          });

          const provider = await page.evaluate(() => {
            return document
              .querySelector('div > cite > span')
              .innerText.replace(/ › /g, '');
          });

          itemProviderSearches.push({ url, item, provider });
          alreadySearchedUrls.push(url);
          alreadySearchedItems.push(item);

          try {
            // save it to CSV
            await new Promise((resolve, reject) => {
              const writeStream = fs.createWriteStream(file, { flags: 'a' });

              writeStream.write(
                `${url},"${item}",${cleanTextRemoveSpaces(item)},${provider}\n`
              );

              writeStream.end(resolve);
              writeStream.on('error', reject);

              console.log('CSV row added.');
            });
          } catch (error) {
            console.error('! ERROR during CSV write !');
            console.error(error);
          }
        } catch (error) {
          throw new Error(`Puppeteer error at ${url} Error message: ${error}`);
        } finally {
          page && (await page.close());
        }
      });

    await sendEmail(
      'SUCCESS - EPS GOOGLE PROVIDERS',
      'EPS GOOGLE PROVIDERS completed task without an error.'
    );
  } catch (error) {
    await sendEmail('ERROR - EPS GOOGLE PROVIDERS', `${error}`);
    console.error('! ERROR !');
    console.error(error);
  } finally {
    browser && (await browser.close());
    await mongoose.connection.close();
    console.log('disconnected from MongoDB');
  }
})();

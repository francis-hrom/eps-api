const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { scrapeViaPuppeteer, findBestSelector } = require('../utils');

router.post('/find-selector', auth, async (req, res) => {
  const { url, textArr } = req.body;

  if (!url) {
    res.status(400).send('Url is required');
  }
  if (textArr.length === 0) {
    res.status(400).send('At least one item in text array is required');
  }

  try {
    const selector = await findBestSelector(url, textArr);
    if (!selector) {
      res.status(400).send('No suitable selector was found.');
    } else {
      res.json(selector);
    }
  } catch (error) {
    console.error(error.message);

    if (error.message.startsWith('net::ERR_ABORTED')) {
      res.status(500).json('Invalid website URL.');
    } else {
      res.status(500).json('Server error. Please contact administrator.');
    }
  }
});

router.post('/scan-rankings', auth, async (req, res) => {
  const { url, selector } = req.body;
  if (!url) {
    res.status(400).send('Url is required');
  }
  if (!selector) {
    res.status(400).send('Selector is required');
  }

  try {
    const items = await scrapeViaPuppeteer(url, selector);
    if (items.length === 0) {
      res.status(400).send('No items were found.');
    } else {
      res.json(items);
    }
  } catch (error) {
    console.error(error.message);

    if (error.message.startsWith('net::ERR_ABORTED')) {
      res.status(500).json('Invalid website URL.');
    } else if (error.message.startsWith('Puppeteer timeout')) {
      res.status(500).json('Invalid selector.');
    } else {
      res.status(500).json('Server error. Please contact administrator.');
    }
  }
});

module.exports = router;

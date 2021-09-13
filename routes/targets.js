const express = require('express');
const router = express.Router();
const Target = require('../models/target');

const auth = require('../middleware/auth');

// Reset to default data
router.post('/reset-to-default-data', auth, async (req, res) => {
  const defaultTargets = [
    {
      url: 'https://geizhals.eu/?m=5',
      selector:
        'html>body>div>div>main>div>div>div>ol>li>div>div>div>a:nth-of-type(1)',
    },
    {
      url: 'https://www.amazon.com/Best-Sellers-Cell-Phones-Accessories/zgbs/wireless/7072561011',
      selector:
        'html>body>div>div>div>div>div>div>ol>li>span>div>span>a>div:nth-of-type(1)',
    },
    {
      url: 'https://www.idealo.de/preisvergleich/ProductCategory/19116.html?cmpReload=true',
      selector: '.offerList-item-description-title',
    },
  ];

  try {
    await Target.collection.drop();
    const targets = await Target.insertMany(defaultTargets);
    res.json(targets);
  } catch (err) {
    res.status(500).json('Server Error. Please contact the administrator.');
  }
});

// Get All
router.get('/', auth, async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create One
router.post('/', auth, async (req, res) => {
  const { url, selector } = req.body;
  if (!url) {
    return res.status(400).send('Url is required');
  }
  if (!selector) {
    return res.status(400).send('Selector is required');
  }

  const oldTarget = await Target.findOne({ url });
  if (oldTarget) {
    return res.status(409).send(`Target with url ${url} already exists.`);
  }

  const target = new Target({
    url,
    selector,
  });
  try {
    const newTarget = await target.save();
    res.status(201).json(newTarget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Getting One
// router.get('/:id', getTarget, (req, res) => {
//   res.json(res.target);
// });

// Updating One
router.patch('/:id', getTarget, async (req, res) => {
  const { selector } = req.body;
  if (!selector) {
    return res.status(400).send('Selector is required');
  }
  res.target.selector = selector;

  try {
    const updatedTarget = await res.target.save();
    res.json(updatedTarget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete('/:id', getTarget, async (req, res) => {
  try {
    await res.target.remove();
    res.json({ message: 'Target has been deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTarget(req, res, next) {
  let target;
  try {
    target = await Target.findById(req.params.id);
    if (target == null) {
      return res.status(404).json({ message: 'Cannot find target' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.target = target;
  next();
}

module.exports = router;

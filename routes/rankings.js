const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ranking = require('../models/ranking');

// Getting all
router.get('/', auth, async (req, res) => {
  try {
    // TODO use a cursor here? so to stream the contents to the client-side
    // https://mongoosejs.com/docs/2.7.x/docs/querystream.html

    //console.log('MEM before', process.memoryUsage());

    const rankings = await Ranking.find();

    //console.log('MEM after', process.memoryUsage());

    res.json(rankings);

    // res.write('[')
    // TODO loop rankings one each, convert to json and write it
    //res.write(ranking)
    // res.end(']')
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
//add ranking to ite,
router.post('/add-ranking/:id/', getRanking, async (req, res) => {
  if (req.body.ranking != null) {
    res.ranking.rankings.push(req.body.ranking);
  }
  try {
    const updatedRanking = await res.target.save();
    res.json(updatedRanking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Getting One
router.get('/:id', getRanking, (req, res) => {
  res.json(res.ranking);
});

// Creating one
router.post('/', async (req, res) => {
  const ranking = new Ranking({
    url: req.body.url,
    selector: req.body.selector,
  });
  try {
    const newRanking = await ranking.save();
    res.status(201).json(newRanking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch('/:id', getRanking, async (req, res) => {
  if (req.body.name != null) {
    res.ranking.url = req.body.url;
  }
  if (req.body.selector != null) {
    res.ranking.selector = req.body.selector;
  }

  try {
    const updatedRanking = await res.ranking.save();
    res.json(updatedRanking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete('/:id', getRanking, async (req, res) => {
  try {
    await res.ranking.remove();
    res.json({ message: 'Deleted Ranking' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRanking(req, res, next) {
  let ranking;
  try {
    ranking = await Ranking.findById(req.params.id);
    if (ranking == null) {
      return res.status(404).json({ message: 'Cannot find ranking' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.ranking = ranking;
  next();
}
*/
module.exports = router;

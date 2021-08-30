const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const auth = require('../middleware/auth');

router.get('/test', (req, res) => {
  res.status(200).send('Test successful');
});

router.post('/test-protected', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ' + req.user.email);
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send('Email is required');
    }
    if (!password) {
      res.status(400).send('Password is required');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '7d',
        }
      );

      user.accessToken = accessToken;

      res.status(200).json({ user, accessToken });
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    res.status(500).send('Server error');
    console.error(err);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    if (!password) {
      return res.status(400).send('Password is required');
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User with this email already exist.');
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).send('Server error');
    console.error(err);
  }
});

module.exports = router;

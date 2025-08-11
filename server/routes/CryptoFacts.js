const express = require('express');
const router = express.Router();
const { CryptoFacts, sequelize } = require('../models');

router.get('/random', async (req, res) => {
  try {
    const fact = await CryptoFacts.findOne({
      order: sequelize.random()
    });
    res.json(fact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random fact' });
  }
});

module.exports = router;

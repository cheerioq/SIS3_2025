const express = require('express');
const router = express.Router();
const { Users, Coins } = require('../models');

router.get("/", async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'username', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Coins,
          as: 'Coins',
          attributes: ['amount'],
        },
      ],
    });

    const usersWithCoins = users.map(user => ({
      id: user.id,
      username: user.username,
      amount: user.Coins ? user.Coins.amount : 0, // single object, not array
    }));

    usersWithCoins.sort((a, b) => b.amount - a.amount);

    res.json(usersWithCoins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

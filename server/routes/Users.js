const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { sign } = require('jsonwebtoken');

// Register new user
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) return res.json({ error: "User not found" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) return res.json({ error: "Wrong username and password combination" });

    const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");

    res.json({ token: accessToken, username: username, id: user.id });
  });
});

// Validate token route
router.get('/auth', validateToken, (req, res) => {
  res.json(req.user);
});

// Get basic info of user by id
router.get("/basicinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id, {
      attributes: ["username", "createdAt", "updatedAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get coins owned by loggedin user 
router.get("/coins", validateToken, async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const coinsOwned = user.coinsOwned ? JSON.parse(user.coinsOwned) : [];
    res.json({ coinsOwned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user's owned coins 
router.post("/coins", validateToken, async (req, res) => {
  try {
    const { coinsOwned } = req.body;
    if (!Array.isArray(coinsOwned))
      return res.status(400).json({ error: "coinsOwned must be an array" });

    const user = await Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.coinsOwned = JSON.stringify(coinsOwned);
    await user.save();

    res.json({ message: "Coins updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get coins owned by any user by id (public)
router.get("/coins/:id", async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const coinsOwned = user.coinsOwned ? JSON.parse(user.coinsOwned) : [];
    res.json({ coinsOwned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
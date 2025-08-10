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

// New route: Get basic info of user by id
router.get("/basicinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id, {
      attributes: ["username", "createdAt", "updatedAt"], // only selected fields
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

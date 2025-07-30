
const express = require('express');
const router = express.Router();
const { Users } = require('../models'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

const {sign} = require('jsonwebtoken');

router.post("/", async (req, res) => {
   const{username, password} = req.body;
   bcrypt.hash(password, 10).then((hash) => {
    Users.create({
        username: username,
        password: hash,
    })
    res.json("SUCCESS");
   })
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({where: {username: username}});
    if (!user) res.json({error: "User not found"});

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) res.json({error: "Wrong username and password combination"});

        const accessToken = sign({username: user.username, id: user.id},"importantsecret"); 

        res.json(accessToken);

      });
    });


module.exports = router;
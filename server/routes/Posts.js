console.log("Posts router loaded");


const express = require('express');
const router = express.Router();
const { Posts } = require('../models'); // Adjust the path as necessary

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post("/", async (req, res) => {
    console.log("Received comment:", req.body);
    const post = req.body;
    await Posts.create(post);
    res.json(post);
});


module.exports = router;
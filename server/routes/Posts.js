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
  try {
    console.log("Received post:", req.body);
    const post = req.body;
    const createdPost = await Posts.create(post);
    res.json(createdPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

module.exports = router;
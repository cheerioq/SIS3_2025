console.log("Posts router loaded");


const express = require('express');
const router = express.Router();
const { Posts } = require('../models'); // Adjust the path as necessary

router.get("/", async (req, res) => {
   const listOfPosts = await Posts.findAll();
   res.json(listOfPosts);
});

router.post("/", async (req, res) => {

    const post = req.body;
    await Posts.create(post);
    res.json(post);
});


module.exports = router;
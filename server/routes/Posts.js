const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware'); 

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [{ model: Likes }] });
  console.log(JSON.stringify(listOfPosts, null, 2));
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


router.post("/", validateToken, async (req, res) => {
  try {
    console.log("Received post:", req.body);
    const { title, postText, username, coinSymbol } = req.body;

    
    const userId = req.user.id; 
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const createdPost = await Posts.create({
      title,
      postText,
      username,
      coinSymbol,
      userId,  
    });

    res.json(createdPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

router.get("/byuserId/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Posts.findAll({
      where: { userId: userId },
      include: [{ model: Likes }]
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts for user" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Comments } = require('../models'); 
const {validateToken} = require('../middlewares/AuthMiddleware'); 


router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comments.findAll({
      where: { PostId: postId },  // Capital P
      attributes: ['id', 'commentBody', 'PostId','username', 'createdAt', 'updatedAt']
    });

    res.json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments", details: err.message });
  }
});


router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  comment.username = req.user.username; 
  const createdComment = await Comments.create(comment);
  res.json(createdComment); 
});



module.exports = router;
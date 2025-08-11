const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comments.findAll({
      where: { postId: postId },  
      attributes: ['id', 'commentBody', 'postId', 'username', 'userId', 'createdAt', 'updatedAt']
    });

    res.json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments", details: err.message });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const comment = req.body;
    comment.username = req.user.username;
    comment.userId = req.user.id;

    const createdComment = await Comments.create(comment);
    res.json(createdComment);
  } catch (err) {
    console.error("❌ Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment", details: err.message });
  }
});

router.delete("/:commentId", validateToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const deleted = await Comments.destroy({
      where: {
        id: commentId,
        username: req.user.username
      }
    });

    if (deleted) {
      res.json({ message: "Comment deleted" });
    } else {
      res.status(404).json({ error: "Comment not found or you are not authorized" });
    }
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment", details: err.message });
  }
});

module.exports = router;

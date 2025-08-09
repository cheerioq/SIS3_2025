const express = require('express');
const router = express.Router();
const { Likes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');



router.post("/", validateToken, async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    console.log("Attempting like for postId:", postId, "by userId:", userId);

    const found = await Likes.findOne({
      where: {
        postId: postId,
        userId: userId
      }
    });

    if (!found) {
      await Likes.create({ postId: postId, userId: userId });
    } else {
      await Likes.destroy({
        where: {
          postId: postId,
          userId: userId
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("LIKE ERROR:", error); // <-- this logs the real issue
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;

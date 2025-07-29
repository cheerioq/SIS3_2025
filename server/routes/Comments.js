const express = require('express');
const router = express.Router();
const { Comments } = require('../models'); 

router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({
        where: { postId: postId }});
    if (comments) {
        res.json(comments);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post("/", async (req, res) => {
  const comment = req.body;
  await Comments.create(comment);
  res.json(comment);
});


module.exports = router;
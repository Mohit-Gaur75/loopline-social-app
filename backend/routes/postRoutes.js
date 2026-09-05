const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  getMyPosts,
} = require("../controllers/postController");
const auth = require("../middleware/auth");

router.get("/", getFeed); // public feed — no auth required to view
router.get("/mine", auth, getMyPosts);
router.post("/", auth, createPost);
router.put("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

module.exports = router;

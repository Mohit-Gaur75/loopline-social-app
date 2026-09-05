const Post = require("../models/Post");

// POST /api/posts  — create a post (text and/or image)
exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: "Post must contain text, an image, or both" });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

// GET /api/posts?page=1&limit=10 — public feed, newest first, paginated
exports.getFeed = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feed", error: err.message });
  }
};

// PUT /api/posts/:id/like — toggle like
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const alreadyLikedIndex = post.likes.findIndex((l) => l.user.toString() === userId);

    if (alreadyLikedIndex === -1) {
      post.likes.push({ user: userId, username: req.user.username });
    } else {
      post.likes.splice(alreadyLikedIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle like", error: err.message });
  }
};

// POST /api/posts/:id/comment — add a comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
};

// GET /api/posts/mine — posts by the logged-in user (bonus/profile use)
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your posts", error: err.message });
  }
};

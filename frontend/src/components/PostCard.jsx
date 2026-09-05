import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Collapse,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import * as postsApi from "../api/posts";

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label}`;
  }
  return "now";
};

const colorForUsername = (name = "") => {
  const palette = ["#6C5CE7", "#00B894", "#0984E3", "#E17055", "#D63031", "#00CEC9", "#FDCB6E"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const hasLiked = likes.some((l) => l.username === user?.username);

  const handleLike = async () => {
    if (!user) return; // logged-out viewers can't like
    // optimistic update
    setLikes((prev) =>
      hasLiked ? prev.filter((l) => l.username !== user.username) : [...prev, { username: user.username }]
    );
    try {
      const updated = await postsApi.toggleLike(post._id);
      setLikes(updated.likes);
    } catch {
      // revert on failure
      setLikes(post.likes || []);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setPosting(true);
    try {
      const updated = await postsApi.addComment(post._id, commentText.trim());
      setComments(updated.comments);
      setCommentText("");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ py: 3, borderBottom: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar sx={{ bgcolor: colorForUsername(post.username), width: 38, height: 38 }}>
          {post.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="subtitle1" sx={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              · {timeAgo(post.createdAt)}
            </Typography>
          </Stack>

          {post.text && (
            <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
              {post.text}
            </Typography>
          )}

          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="post"
              sx={{ mt: 1.5, maxWidth: "100%", maxHeight: 420, borderRadius: 2, display: "block" }}
            />
          )}

          <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton size="small" onClick={handleLike} sx={{ color: hasLiked ? "primary.main" : "text.secondary" }}>
                {hasLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {likes.length}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton size="small" onClick={() => setShowComments((s) => !s)} sx={{ color: "text.secondary" }}>
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {comments.length}
              </Typography>
            </Stack>
          </Stack>

          <Collapse in={showComments}>
            <Box sx={{ mt: 1.5 }}>
              {comments.map((c, i) => (
                <Box key={c._id || i} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {c.username}
                    </Box>{" "}
                    {c.text}
                  </Typography>
                </Box>
              ))}

              {user && (
                <Box component="form" onSubmit={handleComment} sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Write a comment…"
                    fullWidth
                    variant="standard"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                  <IconButton type="submit" size="small" disabled={posting || !commentText.trim()} sx={{ color: "primary.main" }}>
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Stack>
    </Box>
  );
}

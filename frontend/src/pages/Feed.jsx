import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import * as postsApi from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = useCallback(async (pageNum) => {
    const data = await postsApi.getFeed(pageNum, 10);
    return data;
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await loadFeed(1);
        setPosts(data.posts);
        setHasMore(data.hasMore);
        setPage(1);
      } catch {
        setError("Couldn't load the feed. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadFeed]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await loadFeed(nextPage);
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (post) => setPosts((prev) => [post, ...prev]);

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", px: 2 }}>
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      {!user && (
        <Typography variant="body2" sx={{ py: 2, color: "text.secondary" }}>
          You're viewing the public feed. Log in to post, like, or comment.
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Typography sx={{ py: 6, textAlign: "center" }} color="text.secondary">
          {error}
        </Typography>
      ) : posts.length === 0 ? (
        <Typography sx={{ py: 6, textAlign: "center" }} color="text.secondary">
          No posts yet. Be the first to share something.
        </Typography>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <Button onClick={handleLoadMore} disabled={loadingMore} variant="outlined">
                {loadingMore ? "Loading…" : "Load more"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

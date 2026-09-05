import client from "./client";

export const getFeed = (page = 1, limit = 10) =>
  client.get(`/posts?page=${page}&limit=${limit}`).then((res) => res.data);

export const createPost = (data) => client.post("/posts", data).then((res) => res.data);

export const toggleLike = (postId) => client.put(`/posts/${postId}/like`).then((res) => res.data);

export const addComment = (postId, text) =>
  client.post(`/posts/${postId}/comment`, { text }).then((res) => res.data);

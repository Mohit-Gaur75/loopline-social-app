import React, { useState, useRef } from "react";
import { Box, TextField, Button, Avatar, IconButton, Typography, Alert } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";
import * as postsApi from "../api/posts";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Please choose an image under 4MB.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim() && !imagePreview) {
      setError("Write something or add an image first.");
      return;
    }
    setSubmitting(true);
    try {
      const post = await postsApi.createPost({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onPostCreated?.(post);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish that post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 1.5, py: 3, borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Avatar sx={{ bgcolor: user?.avatarColor, width: 38, height: 38, mt: 0.5 }}>
        {user?.username?.[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <TextField
          placeholder="What's on your mind?"
          multiline
          minRows={2}
          fullWidth
          variant="standard"
          value={text}
          onChange={(e) => setText(e.target.value)}
          InputProps={{ disableUnderline: true }}
          sx={{ "& .MuiInputBase-input": { fontSize: "1.05rem" } }}
        />

        {imagePreview && (
          <Box sx={{ position: "relative", mt: 1, display: "inline-block" }}>
            <Box
              component="img"
              src={imagePreview}
              alt="preview"
              sx={{ maxWidth: "100%", maxHeight: 260, borderRadius: 2, display: "block" }}
            />
            <IconButton
              size="small"
              onClick={() => setImagePreview(null)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                bgcolor: "rgba(28,27,26,0.6)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(28,27,26,0.8)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1.5 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
          <IconButton component="label" size="small" sx={{ color: "secondary.main" }}>
            <ImageOutlinedIcon />
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
          </IconButton>

          <Button type="submit" variant="contained" disabled={submitting} sx={{ px: 3 }}>
            {submitting ? "Posting…" : "Post"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

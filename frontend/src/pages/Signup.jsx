import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    }
  };

  return (
    <Box sx={{ maxWidth: 380, mx: "auto", mt: { xs: 6, sm: 10 }, px: 2 }}>
      <Typography variant="h3" sx={{ fontSize: "2rem", mb: 0.5 }}>
        Join Loopline
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Share a thought, a photo, or both.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          fullWidth
          helperText="3-30 characters"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          fullWidth
          helperText="At least 6 characters"
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
        Already have an account?{" "}
        <MLink component={Link} to="/login" color="primary">
          Log in
        </MLink>
      </Typography>
    </Box>
  );
}

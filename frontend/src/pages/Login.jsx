import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log you in. Check your details.");
    }
  };

  return (
    <Box sx={{ maxWidth: 380, mx: "auto", mt: { xs: 6, sm: 10 }, px: 2 }}>
      <Typography variant="h3" sx={{ fontSize: "2rem", mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Log in to see what everyone's sharing.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
        />
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
        New here?{" "}
        <MLink component={Link} to="/signup" color="primary">
          Create an account
        </MLink>
      </Typography>
    </Box>
  );
}

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ maxWidth: 640, mx: "auto", width: "100%", px: { xs: 2, sm: 0 } }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: "text.primary", textDecoration: "none", fontSize: "1.5rem" }}
        >
          Loopline
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: user.avatarColor, fontSize: 14 }}>
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {user.username}
            </Typography>
            <Button size="small" color="inherit" onClick={handleLogout} sx={{ color: "text.secondary" }}>
              Log out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} to="/login" color="inherit" sx={{ color: "text.secondary" }}>
              Log in
            </Button>
            <Button component={Link} to="/signup" variant="contained" color="primary">
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

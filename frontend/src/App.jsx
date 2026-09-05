import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Box>
    </>
  );
}

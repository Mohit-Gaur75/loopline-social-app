const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

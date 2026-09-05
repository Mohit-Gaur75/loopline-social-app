const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatarColor: {
      // used to render a consistent colored initial-avatar on the frontend
      type: String,
      default: "#6C5CE7",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

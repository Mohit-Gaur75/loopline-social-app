const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // denormalized for fast feed reads
    text: { type: String, trim: true, maxlength: 2000 },
    image: { type: String }, // data URL or hosted image URL
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Enforce: at least one of text/image must be present
postSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    next(new Error("A post must contain text, an image, or both."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Post", postSchema);

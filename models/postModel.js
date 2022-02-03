const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "A Post must have a caption"],
  },
  image: {
    type: String,
    required: [true, "A Post must have a photo"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "A Post must have a user"],
  },
  likes: {
    type: [String],
  },
});

module.exports = mongoose.model("post", postSchema);
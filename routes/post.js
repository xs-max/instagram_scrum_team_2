const express = require("express");

const { addPost, likePost, getFeeds } = require("../controllers/post");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.patch('/like-post', likePost);

router.route("/")
    .post(addPost)
    .get(getFeeds);
// router.post("/login", login);

module.exports = router;

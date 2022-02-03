const express = require('express');

const {login, } = require('../controllers/auth');

const router = express.Router();
const {posts} = require("../controllers/post")


//upload picture
router.post("/upload/", upload)

module.exports = router;
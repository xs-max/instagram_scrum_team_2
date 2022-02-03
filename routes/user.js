const express = require('express');

const {login, signUp } = require('../controllers/auth');
const { getAllUsers, follow, unFollow } = require('../controllers/user');
const { protect } = require('../middlewares/auth');

const router = express.Router();


router.post("/signup", signUp);
router.post("/login", login);

router.use(protect);

router.get('/', getAllUsers);
router.patch('/follow/:id', follow);
router.patch('/unfollow/:id', unFollow);




module.exports = router;
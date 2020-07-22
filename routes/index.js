// modules
const express = require('express');
const router = express.Router();

// files
const users = require('./users');
const articles = require('./articles');
const comments = require('./comments');
const games = require('./games');

router.use('/users', users);
router.use('/articles', articles);
router.use('/comments', comments);
router.use('/games', games);

module.exports = router;
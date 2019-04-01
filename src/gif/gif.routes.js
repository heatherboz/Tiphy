const gif = require('./gif.controller');
const express = require('express');
const router = express.Router();
const authorize = require('../app.routes').authorize;

module.exports = router;
// 
// router.post('/signup', authorize, gif.likeGif);
router.get('/gifs', authorize, gif.likeGif);

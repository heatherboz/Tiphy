const user = require('./user.controller');
const gif = require('../gif/gif.controller')
const express = require('express');
const router = express.Router();
const authorize = require('../app.routes').authorize;

module.exports = router;

router.get('/signup', user.signup);
router.get('/login', user.login);
router.post('/login', user.authenticate);
router.get('/logout', user.logout);
router.get('/dashboard', authorize, user.showDashboard);
router.get('/gifs', authorize, user.showGifs);
router.get('/users', user.showAll);
router.get('/:user', user.show);
router.post('/signup', user.add);
router.post('/likeGif', gif.likeGif);
router.post('/:user', user.update);
router.delete('/:user', user.del);

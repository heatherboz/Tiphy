let Post = require('./post.model');
let Gif = require('../gif/gif.model')

module.exports = {
	index,
	getPosts,
	updateAll,
	deleteAll,
	create,
	getPost,
	update,
	del
}
// function topFive(req, res, next){
//
// }

//HOME PAGE
function index(req, res, next){
			Gif.find().sort({numLikes:-1}).limit(5).exec(function(err, projects){
				console.log(projects);
				res.render('index', {user: req.session.user, topfive: projects});
			});

};

//GET ALL POSTS
function getPosts(req, res, next) {
	Post.find(function (err, posts) {
		if (err) return res.send(err);
		res.json(posts);
	});
}

//UPDATE ALL POSTS
function updateAll(req, res, next) {
	res.send('update all');
}

//DELETE ALL POSTS
function deleteAll(req, res, next) {
	res.send('delete all');
}

//CREATE POST
function create(req, res, next) {
	var post = new Post({
		text: req.body.text,
		author: req.session.user
	});

	post.save(function (err, post) {
		if (err) return res.send(err.message);
		//res.json(post);
		res.redirect('/dashboard');
	});
}

//GET POST
function getPost(req, res, next) {
	Post.findById(req.params.id, function (err, post) {
		if (err) return res.send(err);
		res.json(post);
	});
}

//UPDATE POST
function update(req, res, next) {
	Post.findById(req.params.id, function (err, post) {
		if (err) return res.send(err);
		post.text = req.body.text;

		post.save(function (err, post) {
			if (err) res.send(err);
			res.json(post);
		});
	});
}

//DELETE POST
function del(req, res, next) {
	Post.findByIdAndRemove(req.params.id, function (err, post) {
		if (err) res.send(err);
		res.json({message: "removed"});
	});
}

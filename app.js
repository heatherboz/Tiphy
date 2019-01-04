// your application's code
var express = require('express'),
	router = express.Router();
	posts = require('./post/post.routes'),
	users = require('./user/user.routes'),
	gifs = require('./gif/gif.routes'),
	http = require('http'),
	path = require('path'),
	favicon = require('serve-favicon'),
	mongoose = require('mongoose'),
	dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog',
	db = mongoose.connect(dbUrl, {safe: true}),
	//Express middleware
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	//log requests to the terminal
	logger = require ('morgan'),
	errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');
	//Stores express as a function call variable
	var request = require("request");
	// var giphy = require('giphy-api')('WQbIPia5VcYwyRPD0sVa7udEsfjmkne9');

var app = express();
app.locals.appTitle = 'Tiphy';
//Express configurations
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
//Express middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
//exposes the res.session object in each request
//handler and stores data
app.use(session({
	secret: '2C44774A-D649-4D44-9535-46E296EF984F',
	resave: false,
	saveUninitialized: false}));
app.use(methodOverride());

//authentication middleware
app.use(function (req, res, next) {
	if (req.session && req.session.admin) {
		res.locals.admin = true;
	}
	next();
});



if ('development' === app.get('env')) {
	app.use(errorHandler());
}

//Pages and routes
app.use(users);
app.use(posts);
app.use(gifs);
router.all('*', function (req, res) {
	res.sendStatus(404);
});

var server = http.createServer(app);

	server.listen(process.env.PORT || 3000, function () {
		console.info('Express server listening on port');
	});

var shutdown = function () {
	server.close();
};

// if (require.main === module) {
// 	boot();
// } else {
// 	console.info('Running app as a module');
// 	exports.boot = boot;
// 	exports.shutdown = shutdown;
// }

// BELOW



//Uses pug to render the index page
//
// server.listen(3000);
// console.log('Listening on Port 3000!')

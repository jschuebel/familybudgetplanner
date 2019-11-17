var bodyParser = require('body-parser');
var express = require('express');
var session = require('client-sessions');
var settings = require("./settings")();
var fs = require('fs'); // required for file serving

var port = process.env.PORT || settings.defaultPort;

var app = express();

// API file for interacting with MongoDB
const api = require('server/api');

//middleware. use the body-parse before the request is handled.
app.use(function (req,res,next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	
});
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
	cookieName: 'session',
	secret:'adkhskdhakdoieueuwimc',
	duration: 30 * 60 * 1000,
	activeDuration: 5*60*1000,	
}));
app.use(function(req, res, next) {
		next();
})

// API location
app.use('/api', api);

app.get('/', function(req, res) {
	res.redirect('public/index.html');
//	res.render('index.jade');
});

/*
app.get("/", function( req, res) {
				res.writeHeader(500, "Internal error occurred", { "Content-Type": "text/html" });
				res.write("<html><head><title>500</title></head><body>500: Please supply disired method </body></html>");
				res.end();
});
*/

app.listen(port, function (err) {
	console.log("express listening port : " + port);
});

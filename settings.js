module.exports = function() {
	var config = {
		jsFiles : ['*.js', 'controllers/**/*.js', 'core/**/*.js'],
		dbConfig : {
			server: "RICL-EC1405154",
			database: "personal",
			user: "jschuebel",
			password: "fred",
			port: 1433
		},
		defaultPort : 9000
	};
	
	return config;
};


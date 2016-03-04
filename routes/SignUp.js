'use strict';
var db = require('./DB')
  , passwordHash = require('password-hash');

function securePassword(password){
	var hashedPassword = passwordHash.generate(password);
	var salt = hashedPassword.substring(hashedPassword.indexOf('$')+1, hashedPassword.indexOf('$',5));
	var hash = hashedPassword.substring(hashedPassword.indexOf('$',5)+1);
	
	var passD = {
			salt   : salt,
			hash : hash
	};
	return passD;
}

exports.addUser = function(req, res) {
	var user = req.body;
	console.log(user.master_password);
	if(user.master_password == 'admin123'){
		var pass = securePassword(user.password);
	
		db.UserLoginInfo.forge({
			userName: user.username,
			name: user.name, 
			salt: pass.salt, 
			hash: pass.hash
		}).save().then(function(savedUser){
			res.send(savedUser);
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
	}else{
		res.status(500).send();
	}
}
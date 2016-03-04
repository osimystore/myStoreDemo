'use strict';

var db = require('./DB')
  , passwordHash = require('password-hash');

var AdminPassword = "admin123";

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
	if(user.master_password == AdminPassword){
		var pass = securePassword(user.password);
	
		db.UserLoginInfo.forge({
			userName: user.userName,
			name: user.name,
			email: user.email,
			salt: pass.salt, 
			hash: pass.hash,
			type: user.type
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


exports.findIdNameType = function(req, res) {
    db.UserLoginInfo.query(function(qb) {
		qb.where('id', '=', req.user.id);
		}).fetch({columns: ['id','name','type']}).then(function(user) {
			if(user == null)
				res.status(500).send("Not Found");
			else{
				res.send(user);
			}
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.findAll= function(req, res){
	db.UserLoginInfo.query(function(qb) {
		qb.where('id', '!=', req.user.id);
	}).fetchAll({columns: ['id','name','email','type']}).then(function(Users) {
			/*for(var i=0; i<Users.models.length; i++){
				
				Users.models[i].attributes.password =;
			}*/
			res.send(Users);
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.findById = function(req, res) {
    var id = req.params.id;
    db.UserLoginInfo.query(function(qb) {
		qb.where('id', '=', id);
		}).fetch().then(function(user) {
			if(user == null)
				res.status(500).send("Not Found");
			else{
				//user.attributes.type= user.attributes.type.trim();
				res.send(user);
			}
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    if(user.master_password == AdminPassword){
    	db.UserLoginInfo.forge()
    		.query().where({id: Number(id)})
    			.update({
    				userName: user.userName,
    				name: user.name,
    				email: user.email,
    				type: user.type
    			}).then(function() {
    				res.status(200).send();
    			},
    			function(err) {
    				res.status(500).send();
    			});
    }else{
		res.status(500).send();
	}
};

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    if(req.headers.param_2 == AdminPassword) {
    	db.UserLoginInfo.query().where({id: Number(id)}).del().then(function() {
    			res.status(200).send();
    	},
    	function(err) {
    		res.status(500).send();
    	});
    }else{
    	res.status(500).send();
    }
};




exports.login = function(req, res){
	if(req.user){
		res.render('home');
	}
	else
		res.render('login', { message : req.flash('error') });
};

exports.home = function(req, res){
	if(req.user){
		res.render('home');
	}
	else
		res.render('login');
};

exports.SignUpPage = function(req, res){
	res.render('signup', { message : null });
};
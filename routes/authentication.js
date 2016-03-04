
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./DB');

exports.init = passport.initialize();
exports.session = passport.session();

passport.serializeUser(function(user, done) {
	  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/*passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});*/
	
	
passport.use(new LocalStrategy(function(username, password, done) {		  
	/**************************************Start Bookshelf Code to fetch db*****************/
	db.UserLoginInfo.query(function(qb) {
		qb.where('userName', '=', username);
		}).fetch().then(function(User) { 
			if(User==null){
				// res.render('index', { title: 'Login failed', authenticationMessage:'Sorry Username or Password is wrong'});
				return done(null, false, { message: 'Incorrect UserName.' });
			}
			else{
				/******************************Password verification Start*************************************/
				var passwordHash = require('password-hash');
				//console.log(passwordHash.generate('password123'));
				var salt = User.get('salt');
				salt = salt.trim();
				var hash = User.get('hash');
				hash = hash.trim();
				var hashPassword = 'sha1$' + salt + '$' + hash;
				if(passwordHash.verify(password, hashPassword)){
					user1 = {id: User.get('id'),type: User.get('type')};
					return done(null, user1);
				}
				else{
					return done(null, false, { message: 'Incorrect Password.' });
				}
				/******************************Password verification End*************************************/
			}	 
		});	
/**************************************End Bookshelf Code to fetch db*****************/
	}
));
exports.pass = passport;

exports.login = function(req, res){
	if(req.user)
		  res.render('index', { title: 'Home', user: req.user });
		else
			res.render('login', { title: 'Login Page', message : req.flash('error') });
};

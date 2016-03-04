var express = require('express')
  , path = require('path')
  , http = require('http')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , cookieSession = require('cookie-session')
  , flash = require('connect-flash')
  , passport = require('./routes/authentication')
  , routes = require('./routes/routes')
  , signUp = require('./routes/SignUp')
  , image = require('./routes/images')
  , pdf = require('./routes/pdfs')
  , user = require('./routes/user')
    , bower = require('bower');

/*
bower.commands.install(['jquery','backbone','underscore','bootstrap'],{save :true}).on('end',function(installed){
    console.log(installed);
});
*/

/*
bower.commands
    .install([], { save: true }, { interactive: true })
    // ..
    .on('prompt', function (prompts, callback) {
        inquirer.prompt(prompts, callback);
    });*/

/*bower.commands.search('jquery', {}).on('end', function (results) {
    console.log(results);
});*/

var app = express();

app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(flash());
/******************START OF PASSPORT SETUP******************/
//app.use(express.session({ secret: 'keyboard cat', resave: true, saveUninitialized:false }));
app.use(cookieSession({ secret: 'keyboard cat', resave: true, saveUninitialized:false }));
    
app.use(passport.init);
app.use(passport.session);
/******************END OF PASSPORT SETUP********************/
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

var ensureAuthenticated = function(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
};

app.get('/', routes.login);
app.get('/login', routes.login);

app.get('/SignUp', routes.SignUpPage);
app.post('/SignUp', signUp.addUser);

app.get('/home' ,ensureAuthenticated,routes.home);

app.get('/images',ensureAuthenticated, image.findAll);
app.get('/images/:id' ,ensureAuthenticated, image.findById);
app.post('/images' ,ensureAuthenticated, image.addImage);
app.put('/images/:id' ,ensureAuthenticated, image.updateImage);
app.delete('/images/:id' ,ensureAuthenticated, image.deleteImage);

app.get('/userImages' ,ensureAuthenticated, image.findUserImages);

app.get('/pdfs', ensureAuthenticated,pdf.findAll);
app.get('/pdfs/:id' ,ensureAuthenticated, pdf.findById);
app.post('/pdfs' ,ensureAuthenticated, pdf.addPdf);
app.put('/pdfs/:id' ,ensureAuthenticated, pdf.updatePdf);
app.delete('/pdfs/:id' ,ensureAuthenticated, pdf.deletePdf);

app.get('/userPdfs' ,ensureAuthenticated, pdf.findUserPdf);

app.get('/user', ensureAuthenticated, user.findIdNameType);

app.get('/users', ensureAuthenticated,user.findAll);
app.get('/users/:id' ,ensureAuthenticated, user.findById);
app.post('/users' ,ensureAuthenticated, user.addUser);
app.put('/users/:id' ,ensureAuthenticated, user.updateUser);
app.delete('/users/:id' ,ensureAuthenticated, user.deleteUser);

/******************START OF PASSPORT ROUTES******************/
//login request by submitting form
app.post('/login',
		  passport.pass.authenticate('local', { successRedirect: '/home',
		                                   failureRedirect: '/',
		                                   failureFlash: true})
);
/******************END OF PASSPORT ROUTES******************/

//logout request
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
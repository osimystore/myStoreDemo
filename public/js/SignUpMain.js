var SignUpRouter = Backbone.Router.extend({

    routes: {
    	"SignUp"	: "SignUp",
    	""			: "SignUp" 
    },

    /*initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },*/

    SignUp: function () {
    	var signup = new SignUp();
        $('#content').html(new SignUpView({model: signup}).el);
        //this.headerView.selectMenuItem('home-menu');
    }
});

utils.loadTemplate(['SignUpView'], function() {
    app = new SignUpRouter();
    Backbone.history.start();
});
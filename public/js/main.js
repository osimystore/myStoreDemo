var AppRouter = Backbone.Router.extend({

    routes: {
    	""                  : "home",
        "home"              : "home",
        "images"			: "list",
        "images/page/:page"	: "list",
        "images/add"        : "addImage",
        "images/:id"        : "imageDetails",
        
        "pdfs"				: "plist",
        "pdfs/page/:page"	: "plist",
        "pdfs/add"        : "addPdf",
        "pdfs/:id"        : "pdfDetails",
        	
        "users"				: "ulist",
        "users/page/:page"	: "ulist",
        "users/add"        : "addUser",
        "users/:id"        : "userDetails",

        "account/id"       : "userDetails",
        "userImages/:id"       : "userImages",
        "userImages/:id/:page"	: "userImages",
        "userPdfs/:id"      : "userPdf"

    },

    initialize: function () {
    	var userHeader = new UserHeader();
    	userHeader.fetch({success: function(){
            this.headerView = new HeaderView({model: userHeader});
            $('.header').html(this.headerView.el);
        },
        error: function () {
        	alert('Session Expired!!! Please login...');
        }});
        
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        //this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var imageList = new ImageCollection();
        imageList.fetch({success: function(){
            $("#content").html(new ImageListView({model: imageList, page: p}).el);
        },
        error: function () {
        	alert('Session Expired!!! Please login...');
        	window.history.back();
        }});
       // this.headerView.selectMenuItem('home-menu');
    },

    imageDetails: function (id) {
        var image = new Image({id: id});
        image.fetch({success: function(){
            $("#content").html(new ImageView({model: image}).el);
        },
        error: function () {
        	alert('Error in fatching Image Details!!! Please Try after sometime...');
        	window.history.back();
        }});
        this.headerView.selectMenuItem();
    },

	addImage: function() {
        var image = new Image();
        $('#content').html(new ImageView({model: image}).el);
        //this.headerView.selectMenuItem('add-menu');
	},
	
	plist: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var pdfList = new PdfCollection();
        pdfList.fetch({success: function(){
            $("#content").html(new PdfListView({model: pdfList, page: p}).el);
        },
        error: function () {
        	alert('Session Expired!!! Please login...');
        	//window.history.back();
        }});
        //this.headerView.selectMenuItem('home-menu');
    },

    pdfDetails: function (id) {
        var pdf = new Pdf({id: id});
        pdf.fetch({success: function(){
            $("#content").html(new PdfView({model: pdf}).el);
        },
        error: function () {
        	alert('Error in fatching Pdf Details!!! Please Try after sometime...');
        	window.history.back();
        }});
        this.headerView.selectMenuItem();
    },

	addPdf: function() {
        var pdf = new Pdf();
        $('#content').html(new PdfView({model: pdf}).el);
        //this.headerView.selectMenuItem('add-menu');
	},
	
	ulist: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var userList = new UserCollection();
        userList.fetch({success: function(){
            $("#content").html(new UserListView({model: userList, page: p}).el);
        },
        error: function () {
        	alert('Session Expired!!! Please login...');
        	//window.history.back();
        }});
        //this.headerView.selectMenuItem('home-menu');
    },

    userDetails: function (id) {
        var user = new User({id: id});
        user.fetch({success: function(){
            $("#content").html(new UserView({model: user}).el);
        },
        error: function () {
        	alert('Error in fatching User Details!!! Please Try after sometime...');
        	window.history.back();
        }});
        //this.headerView.selectMenuItem();
    },

	addUser: function() {
        var user = new User();
        $('#content').html(new UserView({model: user}).el);
        //this.headerView.selectMenuItem('add-menu');
	},

    userImages : function(id,page) {
        console.log(page);
        var p = page ? parseInt(page, 10) : 1;
        var imageList = new UserImageCollection();
        //console.log(id);
        imageList.fetch({data : $.param({id: id}),success: function(){
            $("#content").html(new UserImageListItemView({model: imageList, page: p}).el);
        },
            error: function () {
                alert('Session Expired!!! Please login...');
                window.history.back();
            }});
        // this.headerView.selectMenuItem('home-menu');
    },

    userPdf : function(id,page) {
        console.log(id+"===========");
        var p = page ? parseInt(page, 10) : 1;
        var pdfList = new UserPdfCollection();
        //console.log(id);
        pdfList.fetch({data : $.param({id: id}),success: function(){
            $("#content").html(new UserPdfListItemView({model: pdfList, page: p}).el);
        },
            error: function () {
                alert('Session Expired!!! Please login...');
                window.history.back();
            }});
        // this.headerView.selectMenuItem('home-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ImageView', 'ImageListItemView', 'PdfView', 'PdfListItemView', 'UserView', 'UserListItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
'use strict';
var db = require('./DB')
  , knex = db.knex
  , path = require('path')
  , cloudinary = require('./cloudinaryConfig')
  , fs = require("fs");

var tempPath = __dirname + '/upload/';
cloudinary = cloudinary.cloudinary;

function imgDataSplit(imageData)
{
	var comaLocation= imageData.indexOf(',');
    var actualData = imageData.slice(comaLocation+1);
    var originaldata = new Buffer(actualData, 'base64');
    
    var colonLocation = imageData.indexOf(':');
    var semicolonLocation = imageData.indexOf(';');
    var mimeType = imageData.slice(colonLocation+1,semicolonLocation);
	var imageD = {
			actualData   : actualData,
			originaldata : originaldata,
			mimeType	 : mimeType
	};
	return imageD;
}

function deleteImageRecord(id){
	db.Images.query().where({id: Number(id)}).del().then(function() {
		return false;
	},
	function(err) {
		console.log(err);
	});
}

exports.addImage = function(req, res) {
	var image = req.body;
    var imageDetails = imgDataSplit(image.imageData);
    
    db.Images.forge({
    	parent_id: req.user.id,
    	name: image.name, 
    	mime_type: imageDetails.mimeType, 
    	modified_by: req.user.id, 
    	imgFile: image.imgFile, 
    	description: image.description
    }).save().then(function(savedImage){
    	//Creating temp img
	    fs.writeFile( image.imgFile, imageDetails.actualData, 'base64', function(err) {
	    	console.log(err);
	    	res.status(500).send();
	    },function(sucess) {
	    	//uploding to cloud
	    	cloudinary.uploader.upload( image.imgFile,function(result){
		    	console.log(result);
		    	if(result.error){
		    		deleteImageRecord(savedImage.get('id'));
		    		fs.unlinkSync( image.imgFile);//deleting temp img
		    		res.status(500).send();
		    	}
		    	else{
		    		// deleting temp img
		    		fs.unlinkSync( image.imgFile);//deleting temp img
		    		savedImage.attributes.imageData= cloudinary.url(result.url);
		    		res.send(savedImage);
		    	}
		    },{	public_id: savedImage.get('id'), overwrite: true});
	    });
	},
	function(err) {
		console.log(err);
		res.status(500).send();
	});
}

exports.findById = function(req, res) {
    var id = req.params.id;
    db.Images.query(function(qb) {
		qb.where('id', '=', id);
		}).fetch().then(function(image) {
			if(image == null)
				res.status(500).send("Not Found");
			else{
				image.attributes.imageData= cloudinary.url(id);			
				res.send(image);
			}
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.findAll = function(req, res) {

		db.Images.query(function(qb) {
			qb.where('parent_id', '=', req.user.id);
			}).fetchAll().then(function(Images) {
				for(var i=0; i<Images.models.length; i++){
					Images.models[i].attributes.imageData =cloudinary.url(Images.models[i].get('id'));
				}
				res.send(Images);
			},
			function(err) {
				console.log(err);
				res.status(500).send();
			});

};

exports.updateImage = function(req, res) {
    var id = req.params.id;
    var image = req.body;
    db.Images.forge()
     	.query().where({id: Number(id)})
     		.update({
     			updated_at: knex.fn.now(),
     			name: image.name,
     			modified_by: req.user.id,
     			description: image.description
     	}).then(function() {
     		res.status(200).send();
		},
		function(err) {
			console.log("=================="+ err);
			res.status(500).send();
		});
}

exports.deleteImage = function(req, res) {
    var id = req.params.id;
    cloudinary.uploader.destroy(id, function(result) { 
    	console.log(result);
    	if(result.result == 'ok'){
    		db.Images.query().where({id: Number(id)}).del().then(function() {
    			res.status(200).send();
    		},
    		function(err) {
    			res.status(500).send();
    		});
    	}
    	else{
    		res.status(500).send();
    	}
    }, { invalidate: true });
}

exports.findUserImages = function(req, res) {
	var id = req.query.id;
	db.Images.query(function(qb) {
		qb.where('parent_id', '=', id);
	}).fetchAll().then(function(Images) {
				for(var i=0; i<Images.models.length; i++){
					Images.models[i].attributes.imageData =cloudinary.url(Images.models[i].get('id'));
				}
				res.send(Images);
			},
			function(err) {
				console.log(err);
				res.status(500).send();
			});

};
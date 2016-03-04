'use strict';
var db = require('./DB')
  , cloudinary = require('./cloudinaryConfig')
  , fs = require("fs");

var tempPath = __dirname + '/upload/';
var mimeType = 'data:application/pdf;base64,';
cloudinary = cloudinary.cloudinary;

function pdfDataSplit(pdfData)
{
	var comaLocation= pdfData.indexOf(',');
    var actualData = pdfData.slice(comaLocation+1);
    var originaldata = new Buffer(actualData, 'base64');
	var pdfD = {
			actualData   : actualData,
			originaldata : originaldata
	};
	return pdfD;
}

function deletePdfRecord(id){
	db.Pdfs.query().where({id: Number(id)}).del().then(function() {
		return false;
	},
	function(err) {
		console.log(err);
	});
}

exports.addPdf = function(req, res) {
    var pdf = req.body;
    var pdfDetails = pdfDataSplit(pdf.pdfData);
    db.Pdfs.forge({
    	parent_id: req.user.id,
    	filename: pdf.filename, 
    	original_filename: pdf.original_filename, 
    	description: pdf.description,
    	modified_by: req.user.id
    }).save().then(function(savedPdf){
	    fs.writeFile( pdf.original_filename, pdfDetails.actualData, 'base64', function(err) {
	      console.log(err);
	      res.status(500).send();
	    },function(sucess) {
	    	cloudinary.uploader.upload( pdf.original_filename,function(result){
		    	console.log(result);
		    	if(result.error){
		    		deletePdfRecord(savedPdf.get('id'));
		    		fs.unlinkSync( pdf.original_filename);
		    		res.status(500).send();
		    	}
		    	else{
		    		fs.unlinkSync( pdf.original_filename);//deleting temp pdf
					savedPdf.attributes.pdfData= result.url;
					res.send(savedPdf);
		    	}
		    },{	public_id: savedPdf.get('id'), overwrite: true , resource_type: 'raw'});
	    });
	},
	function(err) {
		console.log(err);
		res.status(500).send();
	});
}

exports.findById = function(req, res) {
    var id = req.params.id;
    db.Pdfs.query(function(qb) {
		qb.where('id', '=', id);
		}).fetch().then(function(pdf) {
			if(pdf == null)
				res.status(500).send("Not Found");
			else{
				pdf.attributes.pdfData= cloudinary.url(id,{resource_type: 'raw'})+'.pdf';
				res.send(pdf);
			}
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.findAll = function(req, res) {

		db.Pdfs.query(function(qb) {
			qb.where('parent_id', '=', req.user.id);
			}).fetchAll().then(function(Pdfs) {
			res.send(Pdfs);
		},
		function(err) {
			console.log(err);
			res.status(500).send();
		});
};

exports.updatePdf = function(req, res) {
    var id = req.params.id;
    var pdf = req.body;
    var pdfDetails = pdfDataSplit(pdf.pdfData);
    db.Pdfs.forge()
    	.query().where({id: Number(req.params.id)})
    		.update({
    			filename: pdf.filename, 
    			description: pdf.description,
    			updated_at: db.knex.fn.now()
    	}).then(function() {
    		res.status(200).send();
		},
		function(err) {
			res.status(500).send();
		});
}

exports.deletePdf = function(req, res) {
    var id = req.params.id;
    cloudinary.uploader.destroy(id+'.pdf', function(result) {
    	console.log(result);
    	if(result.result == 'ok'){
    		db.Pdfs.query().where({id: Number(req.params.id)}).del().then(function() {
    			res.status(200).send();
    		},
    		function(err) {
    			res.status(500).send();
    		})
    	}
    	else{
    		res.status(500).send();
    	}
    },{resource_type: 'raw' , invalidate: true});
}

exports.findUserPdf = function(req, res) {

	var id = req.query.id;

	db.Pdfs.query(function(qb) {
		qb.where('parent_id', '=', id);
	}).fetchAll().then(function(Pdfs) {
				res.send(Pdfs);
			},
			function(err) {
				console.log(err);
				res.status(500).send();
			});
};
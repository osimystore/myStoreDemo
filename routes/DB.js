var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : 'ec2-54-227-246-11.compute-1.amazonaws.com',
		user     : 'utvekaruluhvpb',
		password : 'VY5tQxI62Jwm08FWfIsI2_LAZU',
		database : 'd560hvi0eijrdu',
		charset  : 'utf8'    	
	}
});

//creating UserLoginInfo table
knex.schema.hasTable('UserLoginInfo').then(function(exists) {
	  if (!exists) {
	    return knex.schema.createTable('UserLoginInfo', function(t) {
	      t.increments('id').primary();
	      t.string('userName', 255);
	      t.string('name', 255);
	      t.string('email', 255);
	      t.string('salt', 255);
	      t.string('hash', 255);
	      t.string('type',50);
	    });
	  }
	});

//creating Images table
knex.schema.hasTable('Images').then(function(exists) {
	  if (!exists) {
	    return knex.schema.createTable('Images', function(t) {
	      t.increments('id').primary();
	      t.integer('parent_id');
	      t.timestamp('created_at').defaultTo(knex.fn.now());
	      t.timestamp('updated_at');
	      t.string('name', 255);
	      t.string('mime_type', 255);
	      t.integer('modified_by');
	      t.string('imgFile', 255);
	      t.string('description', 255);
	    });
	  }
	});

//creating Pdfs table
knex.schema.hasTable('Pdfs').then(function(exists) {
	  if (!exists) {
	    return knex.schema.createTable('Pdfs', function(t) {
	      t.increments('id').primary();
	      t.integer('parent_id');
	      t.timestamp('created_at').defaultTo(knex.fn.now());
	      t.timestamp('updated_at');
	      t.string('filename', 255);
	      t.string('original_filename', 255);
	      t.string('description', 255);
	      t.integer('modified_by');
	    });
	  }
	});



var bookshelf = require('bookshelf')(knex);

var UserLoginInfo = bookshelf.Model.extend({
	tableName: 'UserLoginInfo'
});

var Images = bookshelf.Model.extend({
	tableName: 'Images'
});

var Pdfs = bookshelf.Model.extend({
	tableName: 'Pdfs',
});

setTimeout(function(){
	UserLoginInfo.query(function(qb) {
		qb.where('userName', '=', 'User123');
		}).fetch().then(function(User) { 
			if(User==null){
				UserLoginInfo.forge({userName:'User123',name:'Sohail Sawant', email:'sohail@gmail.com', salt:'9ea7992e',hash:'1$885a50e3295a9afa3a6f4150efeb57c75b82b3b0', type: 'Admin'}).save().then(function(savedUser){
					console.log('Default User Created sucessfully');
				});
			}
			else{
				console.log('Default User already exist');
			}
		});
}, 2000);

exports.knex = knex;
exports.UserLoginInfo = UserLoginInfo;
exports.Images = Images;
exports.Pdfs = Pdfs;

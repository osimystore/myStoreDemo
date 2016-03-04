var cloudinary = require('cloudinary');

cloudinary.config({ 
	  cloud_name: 'dp8hb3o1e', 
	  api_key: '984697794848778', 
	  api_secret: 'W6xClECdCJNiAuvrdnFzqoJv_gc' 
	});

exports.cloudinary = cloudinary;
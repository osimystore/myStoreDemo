window.ImageView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteImage",
        //"drop #picture" : "dropHandler"
        	
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        var data;
        var that = this;
        change[target.name] = target.value;
        if(target.name == 'imgFile'){
        	var reader = new FileReader();
			reader.onload = function(event) {
				data = event.target.result;
				that.model.set({'imageData' : data});
			};
			reader.readAsDataURL(event.target.files[0]);
        }
        	
        //change[target.imgFile] = target.src;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    
    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveImage();
        return false;
    },

    saveImage: function () {
        var self = this;
        utils.showAlert('Uploading...!', ' please Wait', 'alert-warning');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('images/' + model.id, false);
                utils.showAlert('Success!', 'Image saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to save this Image', 'alert-error');
            }
        });
    },

    deleteImage: function () {
    	utils.showAlert('Deleting...!', ' please Wait', 'alert-warning');
        this.model.destroy({
            success: function () {
                alert('Image deleted successfully');
                window.history.back();
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this Image', 'alert-error');
            }
        });
        return false;
    },

    /*dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#imageData').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }*/
});
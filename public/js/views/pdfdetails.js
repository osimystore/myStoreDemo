window.PdfView = Backbone.View.extend({

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
        if(target.name == 'original_filename'){
        	var reader = new FileReader();
			reader.onload = function(event) {
				data = event.target.result;
				that.model.set({'pdfData' : data});
			};
			reader.readAsDataURL(event.target.files[0]);
        }
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
        this.savePdf();
        return false;
    },

    savePdf: function () {
        var self = this;
        utils.showAlert('Uploading...!', ' please Wait', 'alert-warning');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('pdf/' + model.id, false);
                utils.showAlert('Success!', 'Pdf saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to save this Pdf', 'alert-error');
            }
        });
    },

    deleteImage: function () {
    	utils.showAlert('Deleting...!', ' please Wait', 'alert-warning');
        this.model.destroy({
            success: function () {
                alert('Pdf deleted successfully');
                window.history.back();
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this Pdf', 'alert-error');
            }
        });
        return false;
    }
});
window.UserView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    
    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteUser"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        console.log(target.name + ' = ' + target.value);
        this.model.set(change);
        

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
        if(target.name == 're_password' || target.name == 'password'){
        	if(this.model.get('password') != this.model.get('re_password')){
        		utils.addValidationError("re_password", "Password Does not match!");
        	}else {
                utils.removeValidationError("re_password");
            }
        }
    },
    
    beforeSave: function () {
        var self = this;
        console.log(this.model.id);
        if(this.model.id != null){
        	console.log(this.model.id);
        	this.model.set('password', '012345');
        	this.model.set('re_password', '012345');
        	/*var change = {};
            change[password] = '012345';
            change[re_password] = '012345';
            this.model.set(change);*/
        }
        var check = this.model.validateAll();
        if (check.isValid === false) {
        	for (var key in check.messages)
        		alert(check.messages[key]);
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveUser();
        return false;
    },

    saveUser: function () {
        var self = this;
        utils.showAlert('Saving...!', ' please Wait', 'alert-warning');
        this.model.save(null, {
            success: function (model) {
                self.render();
                //app.navigate('images/', false);
                utils.showAlert('Success!', 'User Added successfully...', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to save this User', 'alert-error');
            }
        });
    },
    
    deleteUser: function () {
    	utils.showAlert('Deleting...!', ' please Wait', 'alert-warning');
    	var that =this;
        this.model.destroy({
        	   headers: {
        		   
        		      'param_1': this.model.id,
        		      'param_2': this.model.attributes.master_password
        		   },
        		   async:false,	
            success: function () {
                alert('User deleted successfully');
                window.history.back();
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this User', 'alert-error');
            }
        });
        return false;
    }
});
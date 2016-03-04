window.User = Backbone.Model.extend({

    urlRoot: "/users",

    idAttribute: "id",
    
    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
        
        this.validators.userName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a username"};
        };
        
        this.validators.email = function (value) {
        	var dollrPos = value.indexOf("@");
        	var dotPos = value.indexOf(".");
        	var len = value.length;
        	if(value.length < 0)
        		return {isValid: false, message: "You must enter a email"};
        	else if((dollrPos == -1) || (value.indexOf("@",dollrPos+1) != -1))
        		return {isValid: false, message: "Invalid email"};
        	else if((dotPos == -1) || (value.indexOf(".",dotPos+1) != -1) || dollrPos+2 > dotPos || dotPos == len-1)
            	return {isValid: false, message: "Invalid email"};
        	else
        		return {isValid: true};
        };
        
        this.validators.password = function (value) {
            return value.length > 5 ? {isValid: true} : {isValid: false, message: "Minimum 6 character reqiured"};
        };
        
        this.validators.re_password = function (value) {
            return value.length > 5 ? {isValid: true} : {isValid: false, message: "Minimum 6 character reqiured"};
        };
        
        this.validators.master_password = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a master_password"};
        };
        
        /*this.validators.type = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Type"};
        };*/
    },
    
    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        name: "",
        userName : "",
        email : "",
        password: "",
        re_password: "",
        master_password: "",
        type: "User",
        id : null
    }
});

window.UserCollection = Backbone.Collection.extend({
    model: User,
    url: "/users"
});
window.UserHeader = Backbone.Model.extend({

    urlRoot: "/user",

    idAttribute: "id",

    defaults: {
        name: "",
        type: "",
        id : null
    }
});
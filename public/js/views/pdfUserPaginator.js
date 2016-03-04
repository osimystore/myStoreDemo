window.PdfUserPaginator = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize:function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render:function () {
        var parent_id = this.model.models[0].attributes.parent_id;
        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 8);

        $(this.el).html('<ul />');

        for (var i=0; i < pageCount; i++) {
            $('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#userPdfs/" + parent_id + "/" +(i+1)+"'>" + (i+1) + "</a></li>");
        }

        return this;
    }
});
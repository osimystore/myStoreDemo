window.UserPdfListItemView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var pdfs = this.model.models;
        var len = pdfs.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new PdfListItemView({model: pdfs[i]}).render().el);
        }

        $(this.el).append(new PdfUserPaginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});


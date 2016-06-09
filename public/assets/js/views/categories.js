window.CategoriesView = Backbone.View.extend({

    events: {
        "click .addSpecification": "addSpecification"

    },

    addSpecification: function (e) {
        e.preventDefault();
        //obtem o form
        var $form = $(e.target).parent().parent();
        //cria um novo data form
        var fd = new FormData($form[0]);
        //inserts category and id on form
        fd.append("content", $form.attr("content"));
        fd.append("id", $form.attr("category"));
        //sends it
        var categ = new Category({});
        categ.insertSpecif(fd);


    },
    //Class Initializer
    initialize: function () {
        var self = this;

        self.data = self.collection.toJSON();
        console.log(self.data)
    },

    render: function () {
        var self = this;
        self.data.sort(sortJsonByCol('title'));
        $(this.el).html(this.template({collection: self.data}));
        return this;
    },
})
;

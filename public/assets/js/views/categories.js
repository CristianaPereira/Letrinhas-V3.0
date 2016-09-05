window.CategoriesView = Backbone.View.extend({

    events: {
        "click .addSpecification": "addSpecification",
        "click .addContent": "addContent",
        "click .editContent": "activateEditContent",
        "click .btnEditContent": "editContent"
    },

    addSpecification: function (e) {
        e.preventDefault();
        //obtem o form
        var $form = $(e.target).closest("form");
        //cria um novo data form
        var fd = new FormData($form[0]);
        //sends it
        var categ = new Category({});
        categ.insertSpecif(fd, $form.attr("category"), $form.attr("content"));
    },

    addContent: function (e) {
        e.preventDefault();
        //obtem o form
        var $form = $(e.target).closest("form");
        //cria um novo data form
        var fd = new FormData($form[0]);
        //sends it
        var categ = new Category({});
        categ.insertContent(fd, $form.attr("category"));
    },
    //exibe o input e o botao para edicao do content
    activateEditContent: function (e) {
        e.preventDefault();
        //obtem o id do content
        var contentID = $(e.currentTarget).attr("value");
        //obtem o texto do content
        var contentText = $("#" + contentID).find('label').html();

        //Remove a label e adiciona um input
        $("#" + contentID).empty().append(
            $('<div>', {class: 'input-group'}).append(
                $('<input>', {class: 'form-control', type: 'text', value: contentText, name: 'content'}),
                $('<input>', {type: 'hidden', value: contentID, name: 'id'}),
                $('<span>', {class: 'input-group-addon addon-button'}).append(
                    $('<button>', {class: 'btnEditContent'})
                ))
        )
    },

    //edita o content
    editContent: function (e) {
        e.preventDefault();
        console.log($(e.currentTarget).parents('form:first').serializeObject())
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
        $('.translations', this.el).i18n();
        return this;
    },
})
;

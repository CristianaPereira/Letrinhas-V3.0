window.ResolutionsView = Backbone.View.extend({
    events: {

        'click [type="checkbox"]': "filterBy",
        'mouseleave .listButton': "closeDD"
    },
    //Quando a resolution perder o foco, fecha a dd
    closeDD: function (e) {
        $(".dropdown.open").removeClass("open");
    },
    //Applys filters
    filterBy: function () {
        //Mostra todos os testes
        $(".listButton").show();
        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            $(".listButton[type=" + $(k).attr("value") + "]").hide();
        });
    },


    initialize: function () {
        var self = this;
        self.bd2 = 'let_resolutions';
        self.data = self.collection.toJSON();
    }
    ,


    //Class Renderer
    render: function () {

        var self = this;
        self.data.sort(sortJsonByCol('solved'));


        console.log(self.data);

        $(this.el).html(this.template({collection: self.data}));

        return this;

    }
});

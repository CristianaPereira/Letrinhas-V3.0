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

    }
    ,
    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Class Renderer
    render: function () {

        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        var data = self.collection.toJSON();
        console.log(data)
        $(this.el).html(this.template({collection: data}));

        return this;

    }
});

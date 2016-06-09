window.ResolutionsTextView = Backbone.View.extend({
    events: {

        'click [type="checkbox"]': "filterBy",
        'mouseleave .listButton': "closeDD"
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

        var data = self.model.toJSON();
        console.log(data)
        $(this.el).html(this.template({model: data}));

        return this;

    }
});

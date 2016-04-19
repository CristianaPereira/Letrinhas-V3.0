window.QuestionsMultimediaNew = Backbone.View.extend({
    events: {},

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },


    //Class Initializer
    initialize: function () {},

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        $(this.el).html(this.template());
        return this;
    }

});

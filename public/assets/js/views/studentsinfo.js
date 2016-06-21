window.StudentsInfo = Backbone.View.extend({
    events: {

    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },


    //Class Initializer
    initialize: function (id) {
        var self = this;
        self.data = this.model.toJSON();

    },

    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }
        console.log(self.data)
        $(this.el).html(this.template(self.data));

        return this;
    }

});

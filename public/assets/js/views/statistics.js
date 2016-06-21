window.StatisticsView = Backbone.View.extend({
    events: {},

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            return false;
        }
        return true;
    },

    //Class Initializer
    initialize: function () {
        this.data = this.collection.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }
        console.log(self.data)
        $(this.el).html(this.template({collection: self.data}));

        return this;
    }

});
window.StudentsInfo = Backbone.View.extend({
    events: {

    },

    //Class Initializer
    initialize: function (id) {
        var self = this;
        self.data = this.model.toJSON();

    },

    render: function () {
        var self = this;

        console.log(self.data)
        $(this.el).html(this.template(self.data));

        return this;
    }

});

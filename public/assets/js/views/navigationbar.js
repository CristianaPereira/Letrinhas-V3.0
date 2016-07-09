window.NavigationBarView = Backbone.View.extend({

    events: {},


    //Class Initializer
    initialize: function (name) {
    },

    //Class Renderer
    render: function () {
        var name = window.sessionStorage.getItem("name") || window.localStorage.getItem("name");
        var b64 = window.sessionStorage.getItem("b64") || window.localStorage.getItem("b64");

        $(this.el).html(this.template({
            name: name, b64: b64
        }))
        ;

        return this;
    }

});

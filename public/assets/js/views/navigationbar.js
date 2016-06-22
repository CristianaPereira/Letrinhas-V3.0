window.NavigationBarView = Backbone.View.extend({

    events: {
    },
    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            return false;
        }
        return true;
    },


    //Class Initializer
    initialize: function (name) {
    },

    //Class Renderer
    render: function () {
        $(this.el).html(this.template({
            name: window.sessionStorage.getItem("name"), b64: window.sessionStorage.getItem("b64")
        }))
        ;
        var self = this;
        //Check Local Auth
        if (!self.auth()) {
            showLoginModal($("body"));
        }

        return this;
    }

});

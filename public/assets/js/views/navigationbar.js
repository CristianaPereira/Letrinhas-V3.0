window.NavigationBarView = Backbone.View.extend({

    events: {
        "click #menuSair": "logout",
    },

    logout: function (e) {
        e.preventDefault();
        console.log("out");
        window.sessionStorage.removeItem("keyo");
        app.redirect('/#', {
            trigger: true
        });
    },

    //Class Initializer
    initialize: function() {},

    //Class Renderer
    render: function() {
        $(this.el).html(this.template());
        return this;
    }

});

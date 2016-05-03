window.NavigationBarView = Backbone.View.extend({

    events: {
        "click #menuSair": "logout",
        "click .navbar-collapse.in": "closeBar",
    },

    closeBar: function () {

        $(this).collapse('hide');


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
    initialize: function (id) {
        console.log("ini")
        this.$el.appendTo('body');
    },

    //Class Renderer
    render: function () {
        $(this.el).html(this.template());
        $("#userName").empty();
        $("#userName").append($("<img>", {
            "src": window.sessionStorage.getItem("imgb64"),
            width: "40px"
        }), window.sessionStorage.getItem("name"), ' <i class="fa fa-gear"></i>');

        return this;

    }

});

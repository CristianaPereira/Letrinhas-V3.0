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
    initialize: function (id) {
    },

    //Class Renderer
    render: function () {
        $(this.el).html(this.template());
        modem('GET', 'me', function (user) {
            $("#userName").empty();
            $("#userName").append(user.nome + ' <i class="fa fa-gear"></i>');
            console.log("getImg")
            window.sessionStorage.setItem("username", user._id);
        }, function (error) {
            showLoginModal($("body"));
            console.log('Error getting user ' + window.localStorage.getItem("ProfID"));
        });
        return this;
    }

});

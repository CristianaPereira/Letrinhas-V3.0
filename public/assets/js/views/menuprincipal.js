window.MenuPrincipalView = Backbone.View.extend({
    events: {

    },

    initialize: function () {
        var self = this;
    },



    render: function () {
        $(this.el).html(this.template());
        modem('GET', '/me',
            //Response Handler
            function (json) {
                console.log("render, view/menuprincipal \n");
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
            }
        );
        return this;
    },

});

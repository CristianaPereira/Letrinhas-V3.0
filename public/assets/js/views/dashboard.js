window.Dashboard = Backbone.View.extend({
    events: {},

    initialize: function () {
    },
    
    render: function () {
        $(this.el).html(this.template());
        modem('GET', '/me',
            //Response Handler
            function (json) {
                console.log("render, view/dashboard \n");
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
            }
        );
        return this;
    },

});

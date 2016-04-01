window.TestsView = Backbone.View.extend({
    events: {},

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },


    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if(!self.auth()){ return false; }

        $(this.el).html(this.template());

        //Return Tests
        modem('GET', 'tests',

            //Response Handler
            function (json) {
                console.log(json);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );
        
        return this;
    }

});

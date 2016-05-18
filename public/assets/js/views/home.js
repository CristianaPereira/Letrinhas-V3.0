window.Home = Backbone.View.extend({

    events: {
        "click #showlogin": "showlogin",
        "click #showDownload": "showDownload",
        "click .btn-info": "appDownload",
    },


    //Show Login Modal
    showlogin: function (e) {
        var self = this;

        //Check For BasicAuth Session Cookie
        var keyo = window.sessionStorage.getItem("keyo");

        if (keyo) {
            //Check User Authenticity
            modem('GET', 'me',

                //Response Handler
                function (json) {
                    console.log(json)
                    //If Session Already Present, Go to user main
                    app.navigate("/user", {
                        trigger: true
                    });
                },

                //Error Handling
                function (xhr, ajaxOptions, thrownError) {
                    //Remove Session Key if login atempt failed
                    window.sessionStorage.removeItem("keyo");
                }
            );

        }
        else {
            showLoginModal($("#content"));
        }
    },

    //Login Process
    login: function (e) {

        //Create Credentials
        var cre = $('#userEmail').val() + ':' + md5($("#psswrd").val());   //Credentials = Username:Password
        var creb = btoa(cre);                                         //Credentials Base64
        window.sessionStorage.setItem("keyo", creb);                  //Store Credentials Base64

        //Check User Authenticity
        modem('GET', 'me',

            //Response Handler
            function (json) {
                console.log(json);
                $("#mLogin").modal("hide");
                //Show menus
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);

                //Remove Session Key if login atempt failed
                window.sessionStorage.removeItem("keyo");

                //Checks Error Type
                if (json.message.statusCode == 404) {
                    console.log("Auth Error");
                }
                else {
                    console.log("Database Connetcion Error");
                }

            }
        );

    },

    //Show App Download Modal
    showDownload: function (e) {
        var self = this;

        //Check For BasicAuth Session Cookie
        var keyo = window.sessionStorage.getItem("keyo");

        if (keyo) {
            $("#mApp").modal("show");
        }
        else {
            self.item = "app";
            $("#mLogin").modal("show");
        }

    },

    //Download App (This Doesn't Prevent File Download By Link Request)
    appDownload: function (e) {

        //Check User Authenticity
        modem('GET', 'me',

            //Response Handler
            function (json) {
                //Hide App Download Modal
                $("#mApp").modal("hide");
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                e.preventDefault();

                //Remove Session Key if login atempt failed
                window.sessionStorage.removeItem("keyo");

                //Hide App Download Modal
                $("#mApp").modal("hide");

            }
        );
    },

    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {

        $(this.el).html(this.template());
        return this;
    }

});

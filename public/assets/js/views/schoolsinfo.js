/**
 * Created by 3nvy on 17/03/2016.
 */
window.SchoolsInfo = Backbone.View.extend({
    events: {
        "click #goBack": "goBack",
        "submit": "beforeSend",
        "click .deleteClass": "deleteClass"
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Go back to school list
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //
    beforeSend: function (e) {
        e.preventDefault();

        var self = this;

        var newClass = $("#newclassform").serializeArray();
        newClass.push({name: "school", value: self.school.id});

        //Send Info To Server
        modem('POST', 'schools/' + self.school.id + '/newclass',

            //Response Handler
            function (json) {
                document.location.reload(true);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

                switch (xhr.status) {
                    case 404:
                        app.navigate('schools', true);
                        break;

                    default:
                        //Default == 200 (OK)
                        document.location.reload(true);
                }

            },

            newClass
        );
    },

    //Delete Class
    deleteClass: function (e) {
        e.preventDefault();

        var self = this;

        var r = confirm("Tem a certeza que quer apagar a turma " + e.target.previousSibling.data + "?");

        if (r) {
            modem('POST', 'schools/' + this.school.id + '/removeclass',

                //Response Handler
                function () {
                    document.location.reload(true);
                },

                //Error Handling
                function (xhr, ajaxOptions, thrownError) {

                    console.log("heyo");

                    switch (xhr.status) {
                        case 404:
                            app.navigate('schools', true);
                            break;

                        default:
                            //Default == 200 (OK)
                            document.location.reload(true);
                    }
                },

                {_id: e.target.value}
            );
        }

    },


    //Class Initializer
    initialize: function (req) {
        this.school = req;
    },

    //Class Renderer
    render: function () {

        if (!this.auth()) return false;

        $(this.el).html(this.template());

        modem('GET', 'schools/' + this.school.id,

            //Response Handler
            function (json) {

                //Fill School Info
                $("#schoolImg").attr('src', json.b64);
                $("#schoolName").html(json.nome);
                $("#schoolAddress").html(json.morada);

                $("#classes").html("");
                $.each(json.turmas, function () {

                    var $class = $('<p>', {html: this.nome + " "})
                        .append(
                            $("<button>", {class: "deleteClass", value: this._id, html: "Apagar"})
                        );

                    $("#classes").append($class);

                });
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

                if (xhr.status === 404) {
                    app.navigate('schools', {
                        trigger: true
                    });
                }

            }
        );

        return this;
    }
});

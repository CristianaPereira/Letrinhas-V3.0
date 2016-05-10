window.StudentsView = Backbone.View.extend({
    events: {
        "click #newstudentbtn": "newStudent",
        "click #deletebtn": "deleteStudent",
        "click .fa-trash-o": "confirmDelete"
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Solicita confirmação para apagar o professor
    confirmDelete: function (e) {
        var id = ($(e.currentTarget).parent().attr("id"));
        var value = ($(e.currentTarget).parent().attr("value"));
        console.log(value)
        var modal = delModal("Apagar aluno",
            "Tem a certeza que pretende eliminar o aluno <label>" + value + " </label> ?",
            "deletebtn", $(e.currentTarget).parent().attr("id"));

        $('#studentsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Delete Student
    deleteStudent: function (e) {
        e.preventDefault();
        modem('POST', 'students/' + e.target.value + '/remove',

            //Response Handler
            function () {
                document.location.reload(true);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );


    },

    //Fill School Preview
    fillPreview: function (studentData) {
        var position = $("#studentsContent").offset();

        $("#studentsContent").css('max-height', ($("html").height() - position.top - 20) + 'px');
        var self = this;
        $('#studentsPreview').empty();

        var $divFoto = $("<div>", {
            class: "col-md-4"
        }).append('<img src="' + studentData.b64 + '"  class="dataImage">');

        var $divDados = $("<div>", {
            class: "col-md-8"
        }).append('<label class="dataTitle col-md-12 row">' + studentData.nome + '</label>')
            .append('<label class="col-md-4 lblDataDetails">Escola:</label> <label class="col-md-8">' + studentData.schoolDetails + '</label><br>')
            .append('<label class="col-md-4 lblDataDetails">Número:</label> <label class="col-md-8">' + studentData.numero + '</label><br>')

        $('#studentsPreview').append($divFoto, $divDados)
            .append('<div class="col-md-12" ><hr class="dataHr"></div><div id="classesList" class="col-md-12" align=left></div>')
        ;

    },


    //New Student Navigation
    newStudent: function (e) {
        e.preventDefault();
        app.navigate('/students/new', true);
    },

    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }
        //Render Template
        $(this.el).html(this.template());


        //Get Shools Information
        modem('GET', 'students',

            //Response Handler
            function (json) {
                //StudentsCounter
                $("#studentsBadge").text(json.length);
                //Append School Buttons To Template
                $("#studentsContent").empty();
                $.each(json, function (key, data) {
                    //Botao de editar
                    var $edit = $("<a>", {
                        //href: "#teachers/data.doc._id/edit",
                        href: "#students/" + data.doc._id + "/edit",
                        value: data.doc._id,
                        title: "Editar aluno",
                    }).append('<i class="fa fa-edit"></i>');
                    //Botao de eliminar
                    var $delete = $("<a>", {
                        href: "#students",
                        id: data.doc._id,
                        value: data.doc.nome,
                        title: "Apagar aluno",
                    }).append('<i class="fa fa-trash-o"></i>');

                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + data.doc.b64 + "><span>" + data.doc.nome + "</span>")
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
                        .click(function () {
                            self.fillPreview(data.doc);
                        });

                    $("#studentsContent").append($div);
                });
                self.fillPreview(json[0].doc);

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        )

        return this;
    },

});

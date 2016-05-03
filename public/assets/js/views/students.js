window.StudentsView = Backbone.View.extend({
    events: {
        "click #newstudentbtn": "newStudent",
        "click #editbtn": "editStudent",
        "click #deletebtn": "deleteStudent",
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Edit Student Navigation
    editStudent: function (e) {
        e.preventDefault();
        app.navigate('students/' + e.target.value, true);
    },
    //Solicita confirmação para apagar o professor
    confirmDelete: function (id, nome) {

        var modal = delModal("Apagar escola",
            "Tem a certeza que pretende eliminar o aluno <label>" + nome + " </label> ?",
            "deletebtn", id);

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

                $.each(json, function (i) {

                    //Botao de editar
                    var $edit = $("<a>", {
                        //href: "#teachers/data.doc._id/edit",
                        href: "#students/" + this.doc._id + "/edit",
                        val: this.doc._id,
                        title: "Editar aluno",
                    }).append('<i class="fa fa-edit"></i>');
                    //Botao de eliminar
                    var $delete = $("<a>", {
                        href: "#students",
                        val: this.doc._id,
                        title: "Apagar aluno",
                    }).append('<i class="fa fa-trash-o"></i>')
                        .click(function () {
                            self.confirmDelete(json[i].doc._id, json[i].doc.nome);
                        });


                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + this.doc.b64 + "><span>" + this.doc.nome + "</span>")
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
                        .click(function () {
                            self.fillPreview(json[i].doc);
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

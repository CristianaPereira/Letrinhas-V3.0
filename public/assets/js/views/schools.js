window.SchoolsView = Backbone.View.extend({
    events: {
        "click .schoolSelec": "schoolInfo",
        "click #newschoolbtn": "newSchool",
        "click #editbtn": "editSchool",
        "click #deletebtn": "deleteSchool",
        "click #showSchoolDetails": "showSchoolDetails",
        "keyup #schoolSearch": "searchSchool",
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Change School Info
    schoolInfo: function (e) {

        var self = this;

        //Get School Info
        modem('GET', 'schools/' + e.target.id,

            //Response Handler
            function (json) {
                self.fillPreview(json);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

    },

    //Navigate To School Details
    showSchoolDetails: function (e) {
        e.preventDefault();
        app.navigate('schools/' + e.target.value, {
            trigger: true
        });
    },

    //Navigate To School Edit Page
    editSchool: function (e) {
        e.preventDefault();
        app.navigate('schools/' + e.target.value + '/edit', {
            trigger: true
        });
    },

    //Fill School Preview
    fillPreview: function (json) {
        //Update Edit/Delete Button Values
        $("#schoolsPreview #editbtn").val(json._id);
        $("#schoolsPreview #deletebtn").val(json._id);

        //Set School Image
        $("#schoolsPreview img").attr("src", json.b64);

        //Set School Name
        $("#schoolsPreview #schoolName").attr("value", json._id).html(json.nome);

        //Set School Address
        $("#schoolsPreview #schoolAddress").html(json.morada);

        //Set School ID
        $("#showSchoolDetails").val(json._id);

        //Fill Class Info
        $("#schoolsPreview #classList").html("");
        if (json.turmas.length > 0) {

            $.each(json.turmas, function (i) {
                var $class = $('<div>', {class: "col-md-3"}).append(
                    $('<button>', {
                        id: "btnTurma" + i,
                        class: "btn btn-info mostraTurma",
                        value: this.id,
                        style: "font-size:11px"
                    })
                        .append(this.ano + "º Ano, " + this.nome)
                );

                $("#schoolsPreview #classList").append($class);

            });

        }
        else {
            //If School Has No Class
            $("#schoolsPreview #classList").append("<div class='col-md-12 alert-warning' align=center ><hr><label>Esta escola não tem turmas.</label></div>");
        }

    },

    //Go to new school template
    newSchool: function (e) {
        e.preventDefault();

        app.navigate('/schools/new', {
            trigger: true
        });
    },
    //Solicita confirmação para apagar o professor
    confirmDelete: function (id, nome) {

        var modal = delModal("Apagar escola",
            "Tem a certeza que pretende eliminar a escola <label>" + nome + " </label> ?",
            "deletebtn", id);

        $('#schoolsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Remove School
    deleteSchool: function (e) {
        var self = this;
        $('#modalConfirmDel').modal("hide");
        modem('POST', 'schools/' + e.target.value + '/remove',
            //Response Handler
            function () {
                sucssesMsg($("#schoolsDiv"), "Escola apagada com sucesso!");
                setTimeout(function () {
                    document.location.reload(true);
                }, 2000);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                console.log("ups");
            }
        );
    },

    //Search School
    searchSchool: function (e) {

        $('#schoolsContent').find('button').each(function () {

            var search = new RegExp(($("#schoolSearch").val()).toLowerCase());
            var source = ($(this).attr('name')).toLowerCase();


            if (search.test(source)) {
                $(this).show();
            }
            else {
                $(this).hide();
            }

        });

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

        $(this.el).html(this.template());
        //Get Shools Information
        modem('GET', 'schools',

            //Response Handler
            function (json) {
                $('#schoolsContent').empty();
                //Teachers Counter
                $('#schoolsBadge').text(json.length);
                //  $('#teachersContent').empty();
                //Preenche a lista de professores registados( e com estado activo)
                $.each(json, function (key, data) {
                    //Botao de editar
                    var $edit = $("<a>", {
                        //href: "#teachers/data.doc._id/edit",
                        href: "#schools/edit",
                        val: data.doc._id,
                        title: "Editar professor",
                    }).append('<i class="fa fa-edit"></i>')
                        .click(function () {
                            //  self.editTeacher($(this).val());
                        });

                    //Botao de eliminar
                    var $delete = $("<a>", {
                        href: "#schools",
                        val: data.doc._id,
                        title: "Apagar professor",
                    }).append('<i class="fa fa-trash-o"></i>')
                        .click(function () {
                            self.confirmDelete(data.doc._id, data.doc.nome);
                        });

                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + data.doc.imgb64 + "><span>" + data.doc.nome + "</span>")
                        .append($edit)
                        .append($delete)
                        .click(function () {
                            self.enchePreview(data.doc);
                        });

                    $('#schoolsContent').append($div);
                });
                //  self.fillPreview(json[0].doc);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;

    }

});

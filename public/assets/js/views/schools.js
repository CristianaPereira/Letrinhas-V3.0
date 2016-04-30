window.SchoolsView = Backbone.View.extend({
    events: {
        "click #deletebtn": "deleteSchool",
        "keyup #txtSearch": "searchSchool",
        "click #orderBy": "orderSchools"
    },

    //Remove School
    deleteSchool: function (e) {
        var self = this;
        $('#modalConfirmDel').modal("hide");
        modem('POST', 'schools/' + e.target.value + '/remove',
            //Response Handler
            function () {
                sucssesMsg($("#schoolsDiv"), "Escola apagada com sucesso!", 2000);
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

        $(".listButton").hide();
        $(".listButton:containsi(" + $(e.currentTarget).val() + ")").show();

    },

    orderSchools: function (e) {
        var mylist = $('#schoolsContent');

        var listitems = mylist.children('div').get();

        listitems.sort(function (a, b) {
            return $(a).children('span').text().toUpperCase().localeCompare($(b).children('span').text().toUpperCase());
        });
        //ordenar de forma descendente/ascendente
        if (!$(e.currentTarget).children('i').hasClass("fa-sort-alpha-asc")) {
            listitems = listitems.reverse();
            $(e.currentTarget).children('i').addClass("fa-sort-alpha-asc")
            $(e.currentTarget).children('i').removeClass("fa-sort-alpha-desc")
        } else {
            $(e.currentTarget).children('i').removeClass("fa-sort-alpha-asc")
            $(e.currentTarget).children('i').addClass("fa-sort-alpha-desc")
        }
        $.each(listitems, function (index, item) {
            mylist.append(item);
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

    //Preenche a div com os dados de um professor
    fillPreview: function (schoolData) {
        var self = this;

        $('#schoolsPreview').empty();

        var $divFoto = $("<div>", {
            class: "col-md-4"
        }).append('<img src="' + schoolData.b64 + '"  class="dataImage">');

        var $divDados = $("<div>", {class: "col-md-8"}).append(
            $('<label>', {
                class: "dataTitle col-md-12 row", text: schoolData.nome
            }),
            $('<label>', {
                class: "col-md-4 lblDataDetails", text: "Morada:"
            }),
            $('<label>', {
                class: "col-md-8 ", text: schoolData.morada
            }))


        $('#schoolsPreview').append($divFoto, $divDados)
            .append('<div class="col-md-12" ><hr class="dataHr"></div><div id="classesList" class="col-md-12" align=left></div>')
        ;
        $('#classesList').append('<div id="prfSchool" class="col-md-12" align=left></div> </br>');

        $.each(schoolData.turmas, function () {

            var $class = $('<button>', {
                class: "classBtn",
                html: this.ano + "º " + this.nome + " "
            })


            $("#classesList").append($class);

        });
        $("#classesList").prepend('<label id="assocClasses"> Existe ' + schoolData.turmas.length + ' turma(s) associada(s).</label>')
        //getAssocClasses(teacherData._id, teacherData.nome, false);

    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            showLoginModal($("body"));
        }
        return true;
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
                //Preenche a lista de professores registados( e com estado activo)
                $.each(json, function (key, data) {
                    //Botao de editar
                    var $edit = $("<a>", {
                        //href: "#teachers/data.doc._id/edit",
                        href: "#schools/" + data.doc._id + "/edit",
                        val: data.doc._id,
                        title: "Editar escola",
                    }).append('<i class="fa fa-edit"></i>');

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
                    }).append("<img src=" + data.doc.b64 + "><span>" + data.doc.nome + "</span>")
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
                        .click(function () {
                            self.fillPreview(data.doc);
                        });

                    $('#schoolsContent').append($div);
                });
                self.fillPreview(json[0].doc);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                //Se o erro retornado for de acesso negado, reencaminha o utilizador para a página de login
                if (JSON.parse(xhr.status)) {
                    showLoginModal($("#teachersDiv"));
                }
            }
        );

        return this;

    },

    //Class Initializer
    initialize: function () {
    }

});

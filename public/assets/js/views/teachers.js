window.TeachersView = Backbone.View.extend({

    events: {
        "click #newteacherbtn": "newTeacher",
        "click #btnDelProf": "deleteTeacher",
        "keyup #txtSearch": "searchProf",
    },

    //filtra os profs que correspondem à pesquisa (case insensitive)
    searchProf: function (e) {
        $(".listButton").hide();
        $(".listButton:containsi(" + $(e.currentTarget).val() + ")").show();
    },
    //New Teacher
    newTeacher: function (e) {
        e.preventDefault();
        app.navigate('/teachers/new', {
            trigger: true
        });
    },


    //Class Initializer
    initialize: function () {
    },

    //Solicita confirmação para apagar o professor
    confirmDelete: function (obj) {

        var modal = delModal("Apagar professor",
            "Tem a certeza que pretende eliminar o professor <label>" + obj + " </label> ?",
            "btnDelProf", obj);

        $('#teachersDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    deleteTeacher: function (e) {
        var self = this;
        $('#modalConfirmDel').modal("hide");
        //Apaga o professor seleccionado
        modem('POST', 'teachers/' + $(e.currentTarget).attr('value') + '/del',
            function (json) {
                console.log("apagado");

                sucssesMsg($("#teachersDiv"), "O utilizador " + $(e.currentTarget).attr('value') + " foi apagado com sucesso");

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

    editTeacher: function (obj) {
        app.navigate('/teachers/' + obj + "/edit", {
            trigger: true
        });
    },

    getTurmas: function (idProf, nomeProf) {
        var self = this;
        var nTurmas = 0;
        //Objecto Json com o nome das escolas e turmas
        var obj = jQuery.parseJSON("{}");
        //Obtem os nomes das escolas e respectivas turmas associadas ao professor idProf
        modem('GET', 'schools', function (schoolsList) {
                //Verifica a lista de escolas
                $.each(schoolsList, function (key, school) {
                    //Verifica a lista de turmas
                    $.each(school.doc.turmas, function (kTurma, turma) {
                        var trm = turma.ano + "º " + turma.nome;
                        //Verifica a lista de turmas
                        $.each(turma.professores, function (kProf, prof) {
                            if (prof.id == idProf) {
                                //Se a escola já estiver listada, e a turma não, adiciona a turma
                                if (obj[school.doc.nome]) {
                                    if (obj[school.doc.nome]['turma'].indexOf(trm) == -1) {
                                        obj[school.doc.nome]['turma'].push(trm);
                                    }
                                } else {
                                    obj[school.doc.nome] = {};
                                    obj[school.doc.nome]['id'] = school.doc.nome;
                                    obj[school.doc.nome]['turma'] = [];
                                    obj[school.doc.nome]['turma'].push(trm);
                                    nTurmas++;
                                }
                            }
                        });
                    });
                });
                $('#assocClasses').text(nomeProf + ', tem ' + nTurmas + ' turma(s) associada(s).');
                //Exibe os dado na view
                $.each(obj, function (kSch, sch) {
                    var $school = $("<div>", {
                        class: "col-md-8 col-sm-8"
                    }).append('<i class="fa fa-university"></i>' +
                        '<label style="margin-left: 7px;">' + sch.id + '</label>');
                    var $row = $("<div>", {
                        class: "row"
                    }).append($school);
                    $($row).append($school);
                    var $classes = $("<div>", {
                        class: "col-md-4 col-sm-4"
                    });
                    $.each(sch.turma, function (kValue, value) {
                        $classes.append('<label>' + value + '</label></br>')
                    });
                    $($row).append($classes);
                    $("#prfSchool").append($row);
                });
            },
            function (error) {
                console.log('Error getting schools list!');
            }
        )
        ;

    },

    enchePreview: function (teacherData) {
        var self = this;
        this.getTurmas(teacherData._id, teacherData.nome);
        $('#teachersPreview').empty();
        var permission;
        switch (teacherData.permissionLevel) {
            case '1' :
                permission = "Auxiliar";
                break;
            case '2' :
                permission = "Professor";
                break;
            case '3' :
                permission = "Administrador de Sistema";
                break;
            default:
                permission = "Utilizador";
        }
        ;

        var $divFoto = $("<div>", {
            class: "col-md-4"
        }).append('<img src="' + teacherData.imgb64 + '"  class="dataImage">');

        var $divDados = $("<div>", {
            class: "col-md-8"
        }).append('<label class="dataTitle col-md-12">' + teacherData.nome + '</label><br>')
            .append('<label class="col-md-12 dataSubTitle">' + permission + '</label><br>')
            .append('<label class="col-md-4 lblUserDetails">E-mail:</label> <label class="col-md-8">' + teacherData._id + '</label><br>')
            .append('<label class="col-md-4 lblUserDetails">Nome:</label> <label class="col-md-8">' + teacherData.nome + '</label><br>')
            .append('<label class="col-md-4 lblUserDetails">Telefone:</label> <label  class="col-md-8">' + teacherData.telefone + ' </label><br>')
            .append('<div id="SchoolTable" class="col-md-12" align="center" style="max-height:220px; overflow:auto"></div>');

        $('#teachersPreview').append($divFoto, $divDados)
            .append('<div class="col-md-12" ><hr class="dataHr"></div><div id="prfSchool" class="col-md-12" align=left><label id="assocClasses">' + teacherData.nome + ', não tem turmas associadas.</label></div>')
        ;
    },

//Class Renderer
    render: function () {
        var self = this;
        $(this.el).html(this.template());
        modem('GET', 'teachers',
            //Response Handler
            function (json) {
                //Teachers Counter
                $('#teachersBadge').text(json.length);
                //  $('#teachersContent').empty();
                //Preenche a lista de professores registados( e com estado activo)
                $.each(json, function (key, data) {
                    //Botao de editar
                    var $edit = $("<a>", {
                        //href: "#teachers/data.doc._id/edit",
                        href: "#teachers/edit",
                        val: data.doc._id,
                        title: "Editar professor",
                    }).append('<i class="fa fa-edit"></i>')
                        .click(function () {
                            self.editTeacher($(this).val());
                        });

                    //Botao de eliminar
                    var $delete = $("<a>", {
                        href: "#teachers",
                        val: data.doc._id,
                        title: "Apagar professor",
                    }).append('<i class="fa fa-trash-o"></i>')
                        .click(function () {
                            self.confirmDelete($(this).val());
                        });

                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + data.doc.imgb64 + "><span>" + data.doc.nome + "</span>")
                        .append($edit)
                        .append($delete)
                        .click(function () {
                            self.enchePreview(data.doc);
                        });

                    $('#teachersContent').append($div);
                });
                self.enchePreview(json[0].doc);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                //Error Handling Given The Error Nature
                //Se o erro retornado for de acesso negado, reencaminha o utilizador para a página de login
                if (JSON.parse(xhr.status)) {
                    failMsg($("#teachersDiv"), "Ocorreu um imprevisto. \n (" + JSON.parse(xhr.responseText).result + ").");
                    setTimeout(function () {
                        app.navigate('/inicio', {
                            trigger: true
                        });
                    }, 2000);
                }
            }
        );
        return this;
    },
})
;

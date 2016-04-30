window.TeachersView = Backbone.View.extend({

    events: {
        "click #newteacherbtn": "newTeacher",
        "click #btnDelProf": "deleteTeacher",
        "keyup #txtSearch": "searchProf",
        "click #orderBy": "orderProfs"
    },

    orderProfs: function () {
        var mylist = $('#teachersContent');

        var listitems = mylist.children('div').get();

        listitems.sort(function (a, b) {
            console.log($(a).children('span').text());
            return $(a).children('span').text().toUpperCase().localeCompare($(b).children('span').text().toUpperCase());
        });

        $.each(listitems, function (index, item) {
            mylist.append(item);
        });
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

                sucssesMsg($("#teachersDiv"), "O utilizador " + $(e.currentTarget).attr('value') + " foi apagado com sucesso", 2000);
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

    enchePreview: function (teacherData) {
        var self = this;

        $('#teachersPreview').empty();

        var $divFoto = $("<div>", {
            class: "col-md-3"
        }).append('<img src="' + teacherData.imgb64 + '"  class="dataImage">');

        var $divDados = $("<div>", {
            class: "col-md-8"
        }).append('<label class="dataTitle col-md-12">' + teacherData.nome + '</label><br>')
            .append('<label class="col-md-12 dataSubTitle">' + getUserRole(teacherData.permissionLevel) + '</label><br>')
            .append('<label class="col-md-4 lblDataDetails">E-mail:</label> <label class="col-md-8">' + teacherData._id + '</label><br>')
            .append('<label class="col-md-4 lblDataDetails">Nome:</label> <label class="col-md-8">' + teacherData.nome + '</label><br>')
            .append('<label class="col-md-4 lblDataDetails">Telefone:</label> <label  class="col-md-8">' + teacherData.telefone + ' </label><br>')

        $('#teachersPreview').append($divFoto, $divDados)
            .append('<div class="col-md-12" ><hr class="dataHr"></div><div id="classesList" class="col-md-12" align=left></div>')
        ;
        $('#classesList').append('<div id="prfSchool" class="col-md-12" align=left></div>');
        getAssocClasses(teacherData._id, teacherData.nome, false);
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
                //Preenche a lista de professores registados( e com estado activo)
                $.each(json, function (key, data) {
                    //Botao de editar
                    var $edit = $("<a>", {
                            href: "#teachers/" + data.doc._id + "/edit",
                            val: data.doc._id,
                            title: "Editar professor",
                        }).append('<i id="btnEdit" class="fa fa-edit"></i>')
                        ;

                    //Botao de eliminar
                    var $delete = $("<a>", {
                        href: "#teachers",
                        val: data.doc._id,
                        title: "Apagar professor",
                    }).append('<i class="fa fa-trash-o"></i>')
                        .click(function () {
                            self.confirmDelete($(this).val());
                        });
                    //Separa o nome para recolher apenas o primeiro e o utimo
                    var splName = (data.doc.nome).split(" ");
                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + data.doc.imgb64 + "><span>" + splName[0] + " " + splName[splName.length - 1] + "</span>")
                        //  .append($edit)
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
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
                    showLoginModal($("#teachersDiv"));
                    /* failMsg($("#teachersDiv"), "Ocorreu um imprevisto. \n (" + JSON.parse(xhr.responseText).result + ").");
                     setTimeout(function () {
                     app.navigate('/inicio', {
                     trigger: true
                     });
                     }, 2000);*/
                }
            }
        );
        return this;
    },
})
;

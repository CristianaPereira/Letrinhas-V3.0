window.ResolutionsView = Backbone.View.extend({
    events: {

        'click [type="checkbox"]': "filterBy",
    },


    //Applys filters
    filterBy: function () {
        //Mostra todos os testes
        $(".listButton").show();
        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            $(".listButton[type=" + $(k).attr("value") + "]").hide();
        });
    },


    initialize: function () {
        var self = this;
        self.bd2 = 'let_resolutions';

    }
    ,

    render: function () {
        var self = this;
        $(this.el).html(this.template());
        //Get students Information
        modem('GET', 'students',
            //Response Handler
            function (students) {
                console.log(students);
                modem('GET', 'resolutions',
                    function (resolutions) {
                        console.log(resolutions.length);
                        console.log(resolutions);
                        //resolutions Counter
                        $('#resolutionsBadge').text(resolutions.length);
                        //Preenche a lista de professores registados( e com estado activo)
                        $.each(resolutions, function (key, data) {
                            //Botao de editar
                            var $edit = $("<a>", {
                                href: "#resolutions/" + data.doc._id + "/edit",
                                val: data.doc._id,
                                title: "Corrigir resolução",
                            }).append('<i id="btnEdit" class="fa fa-edit"></i>');

                            //Botao de eliminar
                            var $delete = $("<a>", {
                                href: "#resolutions",
                                val: data.doc._id,
                                title: "Apagar resolução",
                            }).append('<i class="fa fa-trash-o"></i>')
                                .click(function () {
                                    self.confirmDelete($(this).val());
                                });
                            $.each(students, function (keys, student) {
                                if (student.id == data.doc.id_Aluno) {
                                    var $div = $("<div>", {
                                        class: "col-md-4"
                                    }).append($("<div>", {
                                        class: "boxButton divWidget",
                                        type: data.doc.type,
                                        value: data.doc.subject
                                    }).append(
                                            +'<label>Demo:</label>'
                                            + '<audio id="vozProf" controls style="width:100%">'
                                            + '<source src="http://127.0.0.1:5984/let_resolutions/' + data.doc._id + '/gravacao.mp3" type="audio/mp3">'
                                            + '</audio><hr> ' +

                                            "<img width='25px' src=" + student.doc.b64 + "><span>" + student.doc.nome + "</span>")
                                        .append($edit)
                                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete)));

                                    $('#resolutionsContent').append($div);
                                    return false;
                                }
                            });


                        });
                    },
                    //Error Handling
                    function (xhr, ajaxOptions, thrownError) {
                        //Error Handling Given The Error Nature
                        //Se o erro retornado for de acesso negado, reencaminha o utilizador para a página de login
                        if (JSON.parse(xhr.status)) {
                            showLoginModal($("#teachersDiv"));
                        }
                    });
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
            }
        );
        modem('GET', 'resolutions',

            //Response Handler
            function (json) {
                $.each(json, function (i, key) {
                });


            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
            }
        );
        return this;
    },
});

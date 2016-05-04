window.ResolutionsView = Backbone.View.extend({
    events: {},


    initialize: function () {
        var self = this;
        self.bd2 = 'dev_resolucoes';

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
                                        class: "boxButton divWidget"

                                    }).append(
                                            +'<label>Demo:</label>'
                                            + '<audio id="vozProf" controls style="width:100%">'
                                            + '<source src="photo/' + self.bd2 + '/' + data.doc._id + '/gravacao.amr" type="audio/amr">'
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

        return this;
    },
});

window.TestsView = Backbone.View.extend({
    events: {
        "click #deletebtn": "deleteTest"
    },

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

//Solicita confirmação para apagar o professor
    confirmDelete: function (id, nome, prof) {

        console.log(id, nome, prof)
        //Gets logged teacher data
        modem('GET', 'me',

            //Response Handler
            function (json) {

                if (json._id == prof) {
                    var modal = delModal("Apagar escola",
                        "Tem a certeza que pretende eliminar o teste <label>" + nome + " </label> ?",
                        "deletebtn", id);

                    $('#testsDiv').append(modal);
                    $('#modalConfirmDel').modal("show");
                }
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#testsDiv"), "Não foi possível apagar as perguntas. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );
    },

    //Remove School
    deleteTest: function (e) {
        var self = this;
        $('#modalConfirmDel').remove();
        modem('POST', 'tests/' + e.target.value + '/remove',
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
    //Text Preview
    enchePreview: function (test) {
        var self = this;
        //Clear Preview
        $("#testsPreview").empty();

        switch (test.type) {
            case 'text':
                self.textPreview(test);
                break;
            case 'list':
                self.listPreview(test);
                break;

        }
        ;


    },

    textPreview: function (test) {
        var self = this;


        //Test Description
        $("#testsPreview")
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: test.title
                }).append("<hr>"),
                $('<label>', {
                    class: "col-md-3 lblDataDetails", text: "Descrição:"
                }),
                $('<label>', {
                    class: "col-md-9 ", text: test.description
                }),
                $('<label>', {
                    class: "col-md-3 lblDataDetails", text: "Pergunta:"
                }),
                $('<label>', {
                    class: "col-md-9 ", text: test.question
                }),
                $('<label>', {
                    class: " questBox", text: test.content.text
                }),
                $('<audio>', {
                    class: "col-md-12",
                    "controls": "controls"
                })
                    .append(
                        $('<source>', {
                            src: self.site + "/" + self.bd2 + "/" + test._id + "/voice.mp3",
                            type: "audio/mpeg"
                        })
                    )
            )
            .append("<hr>");
    },

    listPreview: function (test) {
        // console.log(test)
        var self = this;
        //Coluna 1
        var $col1 = $('<div>', {
            class: " questBox"
        });
        //Coloca as palavras na coluna
        $.each(test.content.wordsCL1, function (i, word) {
            $col1.append($('<label>', {
                text: word
            }), '<br>')
        });
        //Coluna2
        var $col2 = $('<div>', {
            class: " questBox"
        });
        //Coloca as palavras na coluna
        $.each(test.content.wordsCL2, function (i, word) {
            $col2.append($('<label>', {
                text: word
            }), '<br>')
        });

        //Test Description
        $("#testsPreview")
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: test.title
                }).append("<hr>"),
                $('<label>', {
                    class: "col-md-3 lblDataDetails", text: "Descrição:"
                }),
                $('<label>', {
                    class: "col-md-9 ", text: test.description
                }),
                $('<label>', {
                    class: "col-md-3 lblDataDetails", text: "Pergunta:"
                }),
                $('<label>', {
                    class: "col-md-9 ", text: test.question
                }),
                $('<div>', {
                    class: " col-md-4"
                }).append(
                    $col1
                ),
                $('<div>', {
                    class: " col-md-4"
                }).append(
                    $col2
                ),
                $('<audio>', {
                    class: "col-md-12",
                    "controls": "controls"
                })
                    .append(
                        $('<source>', {
                            src: self.site + "/" + self.bd2 + "/" + test._id + "/voice.mp3",
                            type: "audio/mpeg"
                        })
                    )
            )
            .append("<hr>");
    },

    //Class Initializer
    initialize: function () {
        var self = this;
        self.bd2 = 'dev_perguntas';
        self.site = 'http://127.0.0.1:5984';//process.env.COUCHDB;
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }


        $(this.el).html(this.template());

        //Return Tests
        modem('GET', 'questions',

            //Response Handler
            function (json) {
                $('#testsBadge').text(json.length);

                //Append Test Buttons To Template
                $.each(json, function (i, quest) {

                    //     console.log(quest.doc)
                    //Select Test Type Image
                    // console.log(quest);
                    var $imgT = "../img/" + (quest.doc.type).toLowerCase() + ".png";


                    //Select quest Class Image
                    var subject = (quest.doc.subject).split(":");
                    console.log(subject[0])
                    var $imgC = "../img/" + subject[0] + ".png";


                    //Select BG Color
                    var $color = "#53BDDC";
                    if (quest.doc.isMine)
                        $color = "#60CC60";

                    var $edit = $("<a>", {
                            href: "#teachers/" + this.doc._id + "/edit",
                            val: this.doc._id,
                            title: "Editar teste",
                        }).append('<i id="btnEdit" class="fa fa-edit"></i>')
                        ;

                    //Botao de eliminar
                    var $delete = $("<a>", {

                        val: quest.doc._id,
                        title: "Apagar pergunta",
                    }).append('<i class="fa fa-trash-o"></i>')
                        .click(function () {
                            self.confirmDelete(quest.doc._id, quest.doc.title, quest.doc.profID);
                        });
                    //Separa o nome para recolher apenas o primeiro e o utimo
                    var $div = $("<div>", {
                        class: "listButton divWidget"
                    }).append("<img src=" + $imgT + "><img  src='" + $imgC + "'><span>" + quest.doc.title + "</span>")
                        //  .append($edit)
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
                        .click(function () {
                            self.enchePreview(quest.doc);
                        });


                    $("#testsContent").append($div);
                })
                ;
                self.enchePreview(json[0].doc);

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#testsContent"), "Não foi possível listar as perguntas. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );

        return this;
    }

});
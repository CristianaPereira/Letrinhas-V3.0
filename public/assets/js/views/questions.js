window.QuestionsView = Backbone.View.extend({
    events: {
        "click #deletebtn": "deleteQuestion",
        'click [type="checkbox"]': "filterBy",
        "click #orderBy": "orderQuestions"
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
                        "Tem a certeza que pretende eliminar o questione <label>" + nome + " </label> ?",
                        "deletebtn", id);

                    $('#questionsDiv').append(modal);
                    $('#modalConfirmDel').modal("show");
                }
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#questionsDiv"), "Não foi possível apagar as perguntas. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );
    },

    //Remove School
    deleteQuestion: function (e) {
        var self = this;
        $('#modalConfirmDel').remove();
        modem('POST', 'questions/' + e.target.value + '/remove',
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


    orderQuestions: function (e) {
        var mylist = $('#questionsContent');

        orderContentList(mylist, e);
    },

    //Applys filters
    filterBy: function (e) {
        //Mostra todos os testes
        $(".listButton").show();
        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            $(".listButton[type=" + $(k).attr("value") + "]").hide();
        });
    },

    //Text Preview
    enchePreview: function (question) {
        var self = this;
        //Clear Preview
        $("#questionsPreview").empty();

        //Question Description
        $("#questionsPreview")
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: question.title
                }).append("<hr>"),
                $('<div>', {
                    class: "form-group"
                }).append(
                    $('<label>', {
                        class: "col-md-3 lblDataDetails", text: "Descrição:"
                    }),
                    $('<label>', {
                        class: "col-md-9 ", text: question.description
                    })
                ),
                $('<div>', {
                    class: "form-group"
                }).append(
                    $('<label>', {
                        class: "col-md-3 lblDataDetails", text: "Pergunta:"
                    }),
                    $('<label>', {
                        class: "col-md-9 ", text: question.question
                    })
                ),

                $('<div>', {
                    class: "col-md-12", id: "questionBox"
                })
            )
        ;
        switch (question.type) {
            case 'text':
                self.textPreview(question);
                break;
            case 'list':
                self.listPreview(question);
                break;
            case 'interpretation':
                self.interpretationPreview(question);
                break;
            case 'multimedia':
                self.multimediaPreview(question);
                break;
        }
        ;
    },

    //Adds professor voice to view
    addVioice: function (source) {
        $("#questionsPreview")
            .append($('<audio>', {
                class: "col-md-12",
                "controls": "controls"
            })
                .append(
                    $('<source>', {
                        src: source,
                        type: "audio/mpeg"
                    })
                ))
    },

    textPreview: function (question) {
        var self = this;
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");
        $("#questionBox").append($('<label>', {class: 'questBox', text: question.content.text}));

    },

    listPreview: function (question) {
        // console.log(question)
        var self = this;
        //Carrega o so,
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");

        //Coloca as palavras nas coluna
        $.each(question.content.columns, function (i, column) {
            var words = $();
            $.each(column.words, function (iw, word) {
                words = words.add($('<label>', {
                        text: word
                    }).add('<br>')
                )
            });

            $("#questionsPreview").append(
                $('<div>', {
                    class: "col-md-" + (12 / question.content.columns.length)
                }).append(
                    $('<div>', {
                            class: "questBox centered"
                        }
                    ).append(words))
            );
        });
    },

    interpretationPreview: function (question) {
        // console.log(question)
        var self = this;

        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");
        $("#questionBox").append($('<div>', {class: 'questBox'}));
        var $text = $("#questionBox > div");

        //Separa o texto e marca as palavras
        var wordsList = question.content.text.split(" ");

        $.each(wordsList, function (i, word) {
            var $span = $('<span>', {text: word});
            if (question.content.sid.indexOf(i + "") != -1) {
                $span.addClass("markedWord")
            }
            $text.append($span, " ");
        });


    },

    multimediaPreview: function (question) {
        var self = this;


        //Se o questione for do tipo audio
        switch (question.content.questionType) {
            case "audio":
                //Adiciona o som
                self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");
                break;
            case "image":
                //Adiciona a imagem
                $("#questionBox").append($('<div>', {class: 'questBox centered'}).append(
                    $('<img>', {src: question.content.question})
                ));
                break;
            case "text":
                //Adiciona o texto
                $("#questionBox").append($('<label>', {class: 'questBox centered', text: question.content.question}));

                break;
        }
        //Mostra as opções de resposta
        var nWrongAnswers = question.content.answers.length;

        $.each(question.content.answers, function (i, key) {
                switch (question.content.answerType) {
                    case "text":
                        $("#questionsPreview")
                            .append($('<div>', {class: 'col-md-' + 12 / nWrongAnswers}).append(
                                ($('<button>', {class: 'asnwerBox', html: key.content})))
                            )
                        break;
                    case "image":
                        $("#questionsPreview")
                            .append($('<div>', {class: 'col-md-' + 12 / nWrongAnswers}).append(
                                ($('<img>', {class: 'asnwerBox', src: key.content})))
                            )
                        break;
                }

            }
        );
        //Efectua um shuffle ás respostas, para mudarem dinamicamente de posicoes
        $(".asnwerBox").shuffle();
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

        //Return Questions
        modem('GET', 'questions',

            //Response Handler
            function (json) {
                $('#questionsBadge').text(json.length);

                //Append Question Buttons To Template
                $.each(json, function (i, quest) {

                    //     console.log(quest.doc)
                    //Select Question Type Image
                    // console.log(quest);
                    var $imgT = "../img/" + (quest.doc.type).toLowerCase() + ".png";


                    //Select quest Class Image
                    var subject = (quest.doc.subject).split(":");
                    console.log(subject[0])
                    var $imgC = "../img/" + subject[0] + ".png";


                    //Select BG Color
                    var background = "none";
                    if (window.sessionStorage.getItem("username") == quest.doc.profID)
                        background = "#FBF6B4";

                    var $edit = $("<a>", {
                            href: "#teachers/" + this.doc._id + "/edit",
                            val: this.doc._id,
                            title: "Editar questione",
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
                        class: "listButton divWidget",
                        style: "background-color:" + background,
                        type: quest.doc.type
                    }).append("<img src=" + $imgT + "><img  src='" + $imgC + "'><span>" + quest.doc.title + "</span>")
                        //  .append($edit)
                        .append($("<div>", {class: "editDeleteOp"}).append($edit, $delete))
                        .click(function () {
                            self.enchePreview(quest.doc);
                        });

                    $("#questionsContent").append($div);
                })
                ;
                self.enchePreview(json[0].doc);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#questionsContent"), "Não foi possível listar as perguntas. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );

        return this;
    }

});
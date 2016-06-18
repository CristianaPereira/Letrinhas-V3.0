window.TestsView = Backbone.View.extend({
    events: {
        'click .listButton': "fillPreview",
        'click .fa-calendar': "assocTeste",
        'click #btnAtrTest': "atrTeste",
        "click #orderBy": "orderTests"
    },

    //Exibe o modal com os campos necessarios para associar o teste
    assocTeste: function (e) {
        console.log($(e.currentTarget).attr("testID"));

        //Mostra o titulo do teste
        $("#attrTest h4").html("Atribuir teste: " + $(e.currentTarget).attr("testName"));
        $("#testID").val($(e.currentTarget).attr("testID"))
        // $("#testsPreview").clone().appendTo(".modal-body");
        //$("#mLogin  #myCarousel").attr("id", "atrTest");
        // $("#mLogin  a").attr("href", "#atrTest");
        $("#attrTest").modal("show");
    },

    atrTeste: function (e) {
        e.preventDefault();
        var testDetails = $('#attrTestForm').serializeObject();
        //Obtem os dados to teste generico
        var genericTest = this.collection.getByID(testDetails.genericID);
        //Cria um novo model com os dados do teste generico e os dados especificos
        var assocTest = new Test(testDetails)
        //envia o post
        assocTest.assocTest(genericTest);
    },
    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            return false;
        }
        return true;
    },
    orderTests: function (e) {
        var mylist = $('#testsContent');

        orderContentList(mylist, e);
    },

    fillPreview: function (e) {
        //Se foi clicado no button e nao nos buttons da sopçoes
        if ($(e.target).hasClass("listButton")) {
            var self = this;
            //Recolhe a info do teste
            var test = this.collection.getByID($(e.currentTarget).attr("id"));

            //Recolhe a info de cada uma das perguntas do teste
            $(".carousel-indicators").empty();
            $("#myCarousel .carousel-inner").empty();
            $.each(test.questions, function (testKey, quest) {
                console.log(testKey)
                console.log(quest)
                //Adiciona o botao
                $(".carousel-indicators").append($('<li>', {
                    'data-target': '#myCarousel',
                    'data-slide-to': testKey
                }));


                var question = new Question({id: quest._id});
                question.fetch(function () {
                    //Adiciona o titulo
                    $("#previewModalTitle").text(test.title)
                    //Adiciona a div onde será apresentado o conteúdo
                    $("#myCarousel .carousel-inner").append($('<div>', {
                        class: 'item', html: quest.title, id: 'questionsPreview' + testKey
                    }));
                    //Exibe os dados do teste
                    self.enchePreview(question.attributes, testKey);
                    //Exibe a primeira pergunta do teste
                    $('#myCarousel .carousel-indicators li:first').addClass('active');
                    $('#myCarousel .carousel-inner > div:first').addClass('active');
                })

            });
        }


    },


    //Text Preview
    enchePreview: function (question, i) {
        //gets model info
        var self = this;
        //Clear Preview
        $("#questionsPreview" + i).empty();

        //Question Description
        $("#questionsPreview" + i)
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: question.title
                }).append("<hr>"),
                $('<div>', {
                    class: "form-group"
                }),
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
                    class: "col-md-12", id: "questionBox" + i
                })
            )
        ;

        switch (question.type) {
            case 'text':
                self.textPreview(question, i);
                break;
            case 'list':
                self.listPreview(question, i);
                break;
            case 'interpretation':
                self.interpretationPreview(question, i);
                break;
            case 'multimedia':
                self.multimediaPreview(question, i);
                break;
        }
        ;
    },

    //Adds professor voice to view
    addVioice: function (source, i) {
        $("#questionsPreview" + i)
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

    textPreview: function (question, iQ) {
        var self = this;
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3", iQ);
        $("#questionsPreview" + iQ + " #questionBox" + iQ).append($('<label>', {
            class: 'questBox',
            text: question.content.text
        }));

    },

    listPreview: function (question, iQ) {
        // console.log(question)
        var self = this;
        //Carrega o so,
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3", iQ);

        //Coloca as palavras nas coluna
        $.each(question.content.columns, function (i, column) {
            var words = $();
            $.each(column.words, function (iw, word) {
                words = words.add($('<label>', {
                        text: word
                    }).add('<br>')
                )
            });

            $("#questionsPreview" + iQ).append(
                $('<div>', {
                    class: "col-md-" + (12 / question.content.columns.length)
                }).append(
                    $('<div>', {
                            class: "questBox centered",
                            id: "questBox" + iQ
                        }
                    ).append(words))
            );
        });
    },

    interpretationPreview: function (question, iQ) {
        // console.log(question)
        var self = this;

        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3", iQ);
        $("#questionsPreview" + iQ + " #questionBox" + iQ).append($('<div>', {class: 'questBox'}));
        var $text = $("#questionsPreview" + iQ + " #questionBox" + iQ + " > div");

        //Separa o texto e marca as palavras
        var wordsList = question.content.text.split(" ");

        $.each(wordsList, function (i, word) {
            if (word == '<br>') {
                var $span = $('<br>', {});
            } else {
                var $span = $('<span>', {text: word});
                if (question.content.sid.indexOf(i + "") != -1) {
                    $span.addClass("markedWord")
                }

            }
            $text.append($span, " ");
        });


    },

    multimediaPreview: function (question, iQ) {
        var self = this;


        //Se o questione for do tipo audio
        switch (question.content.questionType) {
            case "audio":
                //Adiciona o som
                self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3", iQ);
                break;
            case "image":
                //Adiciona a imagem
                $("#questionBox" + iQ).append($('<div>', {class: 'questBox centered'}).append(
                    $('<img>', {src: question.content.question})
                ));
                break;
            case "text":
                //Adiciona o texto
                $("#questionBox" + iQ).append($('<label>', {
                    class: 'questBox centered',
                    text: question.content.question
                }));

                break;
        }
        //Mostra as opções de resposta
        var nWrongAnswers = question.content.answers.length;

        $.each(question.content.answers, function (i, key) {
                switch (question.content.answerType) {
                    case "text":
                        $("#questionsPreview" + iQ)
                            .append($('<div>', {class: 'col-md-' + 12 / nWrongAnswers}).append(
                                ($('<button>', {class: 'asnwerBox', html: key.content})))
                            )
                        break;
                    case "image":
                        $("#questionsPreview" + iQ)
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
        this.data = this.collection.toJSON();
        this.bd2 = 'let_questions';
        this.site = 'http://letrinhas.pt:5984';//process.env.COUCHDB;
        getStudents();
        getTypes();

    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        getFilters();
        $(this.el).html(this.template({collection: self.data}));

        return this;
    }

});
window.QuestionsView = Backbone.View.extend({
    events: {
        "click #deletebtn": "deleteQuestion",
        'click [type="checkbox"]': "filterBy",
        'click dropdown-submenu': "filterBy",
        'click .contentFilter': "filterBycontent",
        "keyup #txtSearch": "filterBy",
        'click .listButton': "enchePreview",

        "click #orderBy": "orderQuestions"
    },

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
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
                    var modal = delModal("Apagar pergunta",
                        "Tem a certeza que pretende eliminar a pergunta <label>" + nome + " </label> ?",
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
                sucssesMsg($("#schoolsDiv"), "Pergunta apagada com sucesso!");
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
    filterBy: function () {
        var typedText = $("#txtSearch").val();

        //Esconde todos os testes
        $(".listButton").hide();
        //Mostra apenas os que contém a string escrita
        $(".listButton:containsi(" + typedText + ")").show();

        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function (i, k) {
            console.log($(k).attr("value"))
            $(".listButton[type=" + $(k).attr("value") + "]").hide();
        });

        //Esconde os que ao correspondem conteudos seleccionados
        $.each($(".listButton:visible"), function (i, k) {
            //Se nao pertencerem à categoria escolhida, esconde-os
            if ($(k).attr("value").indexOf($("#filterSubject").attr("filter")) == -1) {
                $(k).hide();
            }
        });
        $("#questionsBadge").text($(".listButton:visible").length + "/" + this.data.length)

    },

    //Applys filters
    filterBycontent: function (e) {
        var self = this;
        $("#filterSubject").attr("filter", $(e.target).attr("value"));
        self.filterBy();
    },

    //Text Preview
    enchePreview: function (e) {
        question = this.collection.getByID($(e.currentTarget).attr("id"));
        var self = this;
        //Clear Preview
        $("#questionsPreview").empty();

        $("#questionsPreview")
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row", text: question.title
                }).append('<hr class="dataHr">'),

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
                "controls": "controls",
                id: "teacherVoice"
            })
                .append(
                    $('<source>', {
                        src: source,
                        type: "audio/mpeg"
                    })
                ))
    },

    textPreview: function (question) {
        console.log(question)
        var self = this;
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");

        //Separa o texto em paragrafos
        var $paragraph = question.content.text.split(/\n/);
        var words = $();
        var nWords = 0;
        //por cada paragrafo adiciona a palavra a lista, e a new line
        $.each($paragraph, function (iLine, line) {
            var $wordsList = line.split(" ");
            $.each($wordsList, function (i, word) {
                //Replace String With Selectable Span (Não esquecer os PARAGRAFOS)
                var wordTime = getObjects(question.content.wordTimes, 'pos', nWords)[0];
                //If word as associated time
                if (wordTime) {
                    words = words.add($('<span>', {
                        text: word + " ",
                        id: "wd" + nWords,
                        class: "word",
                        'data-start': wordTime.start
                    }))
                } else {
                    words = words.add($('<span>', {
                        text: word + " ",
                        id: "wd" + nWords

                    }))
                }
                //incrementa o nr de palavras (nao conta os breaks
                nWords++;
            });
            words = words.add('<br />')
        });

        $("#questionBox").append($('<div>', {class: 'questBox'}).append(
            words
        ));
        var pop = Popcorn("audio");

        $.each(question.content.wordTimes, function (id, time) {
            console.log(time)
            pop.footnote({
                start: time.start,
                end: time.end,
                text: '',
                target: 'wd' + time.pos,
                effect: "applyclass",
                applyclass: "selected"
            });
        });

        pop.play();

        //var mySnd = document.getElementById("teacherVoice");
        //mySnd.playbackRate = 0.5;
        $('.word').click(function () {
            var audio = $('audio');
            audio[0].currentTime = parseFloat($(this).data('start'), 10);
            audio[0].play();
        });
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
        var words = $();
        self.addVioice(self.site + "/" + self.bd2 + "/" + question._id + "/voice.mp3");
        $("#questionBox").append($('<div>', {class: 'questBox'}));
        var $text = $("#questionBox > div");


        //Separa o texto em paragrafos
        var $paragraph = question.content.text.split(/\n/);
        console.log($paragraph)
        var words = $();
        var nWords = 0;
        //por cada paragrafo adiciona a palavra a lista, e a new line
        $.each($paragraph, function (iLine, line) {
            var $wordsList = line.split(" ");
            $.each($wordsList, function (i, word) {
                //Replace String With Selectable Span (Não esquecer os PARAGRAFOS)

                if (question.content.sid.indexOf(nWords + "") != -1) {
                    words = words.add($('<span>', {
                        text: word + " ",
                        class: "markedWord"
                    }))
                } else {
                    words = words.add($('<span>', {
                        text: word + " "
                    }))
                }
                //incrementa o nr de palavras (nao conta os breaks
                nWords++;
            });
            words = words.add('<br />')

        });
        $text.append(words);
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
        self.bd2 = 'let_questions';
        self.site = 'http://127.0.0.1:5984';//process.env.COUCHDB;
        self.data = self.collection.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            showLoginModal($("body"));
        }
        getFilters();

        self.data.sort(sortJsonByCol('title'));

        $(this.el).html(this.template({collection: self.data}));

        return this;
    }

});
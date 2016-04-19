window.TestsView = Backbone.View.extend({
    events: {
        "click .testSelec": "changePreview",
        "click #newtestbtn": "newTest",
        "click #textTestbtn": "textTestNew"
    },

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Change Test Preview Object
    changePreview: function (e) {
        var self = this;
        var $test = "";

        //Find Test
        $.each(self.tests, function () {
            if (this.id == e.target.id) {
                $test = this.doc;
            }
        });

        //Select Test Type Preview
        switch ($test.tipo) {
            case 'Texto':
                self.textPreview($test);
                break;
            case 'Lista':
                self.listPreview($test);
                break;
            case 'Multimédia':
                self.multimediaPreview($test);
                break;
            case 'Interpretação':
                self.interpretationPreview($test);
                break;
        }
        ;

    },

    //Text Preview
    textPreview: function (test) {
        var self = this;

        //Clear Preview
        $("#testPreviewContainer").empty();

        //Test Description
        $("#testPreviewContainer")
            .append($("<label>", {html: "<b>Descrição:</b>"}))
            .append($("<span>", {html: test.descricao}))
            .append("<br>");

        //Write Questions
        $.each(test.perguntas, function () {

            var id = this;
            var pergunta = "";

            //Find Question
            $.each(self.questions, function () {
                if (id == this.id) {
                    pergunta = this.doc;
                }
            });

            $("#testPreviewContainer")
                .append($("<label>", {html: "Pergunta:"}))
                .append($("<span>", {html: pergunta.titulo}))
                .append($("<div>", {
                    class: "panel panel-default col-md-12",
                    align: "left",
                    style: "height:300px; overflow:auto",
                    html: pergunta.conteudo.texto
                }))
                .append("<br>");

        });
    },

    //List Preview
    listPreview: function (test) {
        var self = this;

        //Clear Preview
        $("#testPreviewContainer").empty();

        //Test Description
        $("#testPreviewContainer")
            .append($("<label>", {html: "<b>Descrição:</b>"}))
            .append($("<span>", {html: test.descricao}))
            .append("<br>");

        //Write Questions
        $.each(test.perguntas, function () {

            var id = this;
            var pergunta = "";

            //Find Question
            $.each(self.questions, function () {
                if (id == this.id)
                    pergunta = this.doc;
            });

            //Pre-Build Containers
            $("#testPreviewContainer")
                .append($("<label>", {html: "Pergunta:"}))
                .append($("<span>", {html: pergunta.titulo}))
                .append($("<div>", {
                    id: "answerContainer",
                    class: "panel panel-default col-md-12 ",
                    aling: "center",
                    style: "height:300px; overflow:auto"
                }))
                .append("<br>");

            /**
             * Check List Columns
             */

            //Column 1
            if (pergunta.conteudo.palavrasCL1.length > 0) {
                //Add Column
                $("#answerContainer")
                    .append($("<div>", {class: "col-md-4"})
                        .append($("<span>", {class: "badge btn-success", html: "Coluna 1"}))
                        .append(self.getColumns(pergunta.conteudo.palavrasCL1))
                    )
            }
            else
                $("#answerContainer").append($("<span>", {
                    class: "badge btn-warning",
                    html: "Este item não tem conteúdo"
                }))

            //Column 2
            if (pergunta.conteudo.palavrasCL2.length > 0) {
                //Add Column
                $("#answerContainer")
                    .append($("<div>", {class: "col-md-4"})
                        .append($("<span>", {class: "badge btn-success", html: "Coluna 2"}))
                        .append(self.getColumns(pergunta.conteudo.palavrasCL2))
                    )
            }
            else
                $("#answerContainer").append($("<span>", {
                    class: "badge btn-warning",
                    html: "Este item não tem conteúdo"
                }))

            //Column 3
            if (pergunta.conteudo.palavrasCL3.length > 0) {
                //Add Column
                $("#answerContainer")
                    .append($("<div>", {class: "col-md-4"})
                        .append($("<span>", {class: "badge btn-success", html: "Coluna 3"}))
                        .append(self.getColumns(pergunta.conteudo.palavrasCL3))
                    )
            }
            else
                $("#answerContainer").append($("<span>", {
                    class: "badge btn-warning",
                    html: "Este item não tem conteúdo"
                }))


            /**
             * Demo
             */

            $("#testPreviewContainer")
                .append($("<div>", {class: "col-md-12", align: "left"})
                    .append($("<label>", {html: "Demo:"}))
                    .append($("<audio controls>", {id: "vozProf", style: "width:100%"})
                        .append($("<source>", {
                            src: "photo/dev_perguntas/" + pergunta._id + "/voz.mp3",
                            type: "audio/mpeg"
                        }))
                    )
                )

        });

    },

    //Multimedia Preview
    multimediaPreview: function (test) {
        var self = this;

        //Clear Preview
        $("#testPreviewContainer").empty();

        //Test Description
        $("#testPreviewContainer")
            .append($("<label>", {html: "<b>Descrição:</b>"}))
            .append($("<span>", {html: test.descricao}))
            .append("<br>");

        //Write Questions
        $.each(test.perguntas, function ($pagNum) {

            var id = this;
            var pergunta = "";

            //Find Question
            $.each(self.questions, function () {
                if (id == this.id) {
                    pergunta = this.doc;
                }
            });

            $("#testPreviewContainer")
                .append($("<div>", {
                    id: "pages",
                    style: "height:474px; overflow:auto"
                }))
                .append("<br>");

            /**
             * BODY TYPE SELECTOR
             */
            var $body;

            switch (pergunta.conteudo.tipoDoCorpo) {
                case 'texto':
                    $body = $("<label>", {
                        style: "position:relative;top:20px; max-height:175px",
                        html: pergunta.conteudo.corpo
                    });
                    break;

                case 'imagem':
                    $body = $("<img>", {
                        style: "position:relative;top:20px; max-width:400px; max-height:160px",
                        src: "photo/dev_perguntas/" + pergunta._id + "/corpo.jpg"
                    });
                    break;

                case 'audio':
                    $body = $("<img>", {style: "position:relative;top:20px;"})
                        .append($("<img>", {style: "width:130px", src: "../img/paly_off.png"}))
                        .append("<br>")
                        .append($("<audio controls>", {style: "width:100%"})
                            .append($("<source>", {
                                src: "photo/dev_perguntas/" + pergunta._id + "/corpo.mp3",
                                type: "audio/mpeg"
                            }))
                        );

                    break;

                default:
                    break;
            }

            /**
             * OPTIONS SELECTOR
             */
            var $options = $("<div>", {id: "optionSelector"});
            var $size = 12 / pergunta.conteudo.opcoes.length;

            //Iterate Questions
            $.each(pergunta.conteudo.opcoes, function (i) {

                //Get Question Type
                switch (this.tipo) {
                    case 'texto':
                        $("#optionSelector")
                            .append($("<div>", {class: "col-sm-" + $size})
                                .append($("<span>", {
                                    class: "btn-sm btn-block",
                                    style: "position:relative;top:20px;background-color:#53BDDC; color:#ffffff; height:70px;",
                                    html: this.conteudo
                                }))
                            );
                        break;

                    case 'imagem':
                        $("#optionSelector")
                            .append($("<div>", {class: "col-sm-" + $size})
                                .append($("<span>", {
                                        class: "btn-sm btn-block",
                                        style: "background-color:#53BDDC; color:#ffffff; height:70px;",
                                        html: this.conteudo
                                    })
                                    .append($("<img>", {
                                        src: "photo/dev_perguntas/" + pergunta._id + "/op" + (i + 1) + ".jpg",
                                        style: "max-height:50px; max-width:50px"
                                    }))
                                )
                            );
                        break;

                    default:
                        break;

                }
            });

            /**
             * QUESTION BUILDER
             */
            $("#pages")
                .append($("<div>", {align: "left"})
                    .append($("<label>", {
                        class: "badge btn-success",
                        html: "Página " + $pagNum + ": " + pergunta.titulo
                    }))
                    .append("<br>")
                    .append($("<label>", {html: "Pergunta: ", style: "font-weight: bold"}))
                    .append($("<span>", {html: pergunta.pergunta}))
                )
                .append("<br>")
                .append($("<div>", {
                    class: "panel panel-default",
                    align: "center",
                    style: "height:200px; width:100%; color:#ffffff; background-color:#80c0ff;",
                    html: $body
                }))
                .append($("<div>", {
                    align: "center",
                    style: "height:140px; width:100%;",
                    html: $options
                }))
                .append("<hr>")
            ;

        });
    },

    //Interpretation Preview
    interpretationPreview: function ($test) {
        var self = this;

        //Clear Preview
        $("#testPreviewContainer").empty();

        //Test Description
        $("#testPreviewContainer")
            .append($("<label>", {html: "<b>Descrição:</b>"}))
            .append($("<span>", {html: $pergunta.descricao}))
            .append("<br>");

        //Write Questions
        $.each($test.perguntas, function () {

            var $id = this;
            var $pergunta = "";

            //Find Question
            $.each(self.questions, function () {
                if ($id == this.id) {
                    $pergunta = this.doc;
                }
            });

            $("#testPreviewContainer")
                .append($("<label>", {html: "Pergunta:"}))
                .append($("<span>", {html: $pergunta.titulo}))
                .append($("<div>", {
                    class: "panel panel-default col-md-12",
                    align: "justify",
                    style: "height:300px; overflow:auto",
                    html: $pergunta.conteudo.texto
                }))
                .append("<br>");

        });
    },

    //Gest Awnsers Columns
    getColumns: function (list) {
        var column = '';

        for (i = 0; i < list.length; i++) {
            column += '<br>' + list[i];
        }

        return column;
    },

    //Mark Text
    markText: function ($text, $positions) {
        var $self = this;
        var $text = "";
        var $s = '<span ';
        var $s1 = ' class="badge">';
        var $palavra = s;
        var $isCaracter = true;
        var $posicao = 1;
        var $index = 0;

        if (posicoes[index] == posicao) {
            palavra += s1;
            index++;
        }
        else {
            palavra += '>';
        }

        if (texto.length != 0) {
            for (var i = 0; i < texto.length; i++) {
                //de acordo com a tabela ascii 1º caracter possivel '!' CODE 33
                if (texto.charCodeAt(i) < 33) {
                    //se o caracter anterior for válido
                    if (isCaracter) {
                        //fecha a palavra
                        palavra += '</span> ';
                        posicao++;
                        //adiciona a palavra à linha
                        text += palavra;
                        //reinicia a palavra
                        palavra = s;

                        if (posicoes[index] == posicao) {
                            palavra += s1;
                            index++;
                        }
                        else {
                            palavra += '>';
                        }
                        //não e um caracter válido (ex: "enter", "space", "tab")
                        isCaracter = false;
                    }
                }
                else {
                    //adiciona o caracter à palavra
                    palavra += texto.charAt(i);
                    //confirma que era uma caracter
                    isCaracter = true;
                }
            }
            //entregar o resto
            if (palavra.length > 0) {
                palavra += '</span> ';
                text += palavra;
            }
        }
        return text;
    },

    //New Test Modal
    newTest: function () {
        $('#newTestModal').modal("show");
    },

    //New Text Test
    textTestNew: function () {
        $('#newTestModal').modal("hide");
        app.navigate('/questionsText/new', {
            trigger: true
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

        //Return Tests
        modem('GET', 'tests',

            //Response Handler
            function (json) {

                self.tests = json.tests;
                self.questions = json.questions;

                //Append Test Buttons To Template
                $("#testsContent").html("");
                $.each(self.tests, function (i) {

                    //Load First School Preview
                    if (i === 0) {
                        //self.fillPreview(this.doc);
                    }

                    //Select Test Type Image
                    var $imgT = '';
                    switch (this.doc.tipo) {
                        case 'Texto':
                            $imgT = "../img/testeTexto.png";
                            break;
                        case 'Lista':
                            $imgT = "../img/testLista.png";
                            break;
                        case 'Multimédia':
                            $imgT = "../img/testMul.png";
                            break;
                        case 'Interpretação':
                            $imgT = "../img/testInterpretacao.png";
                            break;
                        default:
                            $imgT = "../img/page-loader.gif";
                            break;
                    }
                    ;

                    //Select Test Class Image
                    var $imgC = '';
                    switch (this.doc.disciplina) {
                        case 'Português':
                            $imgC = "../img/portugues.png";
                            break;
                        case 'Inglês':
                            $imgC = "../img/ingles.png";
                            break;
                        case 'Matemática':
                            $imgC = "../img/mate.png";
                            break;
                        case 'Estudo do Meio':
                            $imgC = "../img/estudoMeio.png";
                            break;
                        case 'Outra língua':
                            $imgC = "../img/outroLinguas2.png";
                            break;
                        case 'Outra':
                            $imgC = "../img/outro.png";
                            break;
                        default:
                            $imgC = "../img/page-loader.gif";
                            break;
                    }
                    ;

                    //Select BG Color
                    var $color = "#53BDDC";
                    if (this.doc.isMine)
                        $color = "#60CC60";

                    //Construct Button
                    var $div = $("<button>", {
                        id: this.doc._id,
                        class: "btn btn-lg btn-block testSelec",
                        name: this.doc.titulo,
                        type: "button",
                        style: "height:60px; text-align:left; background-color: " + $color + "; color: #ffffff;"
                    })
                        .append(
                            "<img style='height:30px;' src='" + $imgT + "'>" +
                            "<img style='height:30px;' src='" + $imgC + "'>" +
                            "&nbsp;&nbsp;&nbsp;" +
                            this.doc.titulo
                        );

                    $("#testsContent").append($div);
                });

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#testsContent"), "Não foi possível listar os testes. \n (" + JSON.parse(xhr.responseText).error + ").");
            }
        );

        return this;
    }

});

window.ResolutionsNewView = Backbone.View.extend({
    events: {

        'click [type="checkbox"]': "filterBy",
        'click .subError': 'saveError',
        'change input': 'afterRender',
        'change select': 'recalcTestNote',
        'click .questBox > span': "resolWord",
        'click #subCorrection': "subCorrection",
        'mouseleave .listButton': "closeDD"
    },
    subCorrection: function (e) {
        e.preventDefault();
        var resolution = new Resolution();
        resolution.attributes.questions = [];
        //Recolhe cada um dos forms
        $.each($('form'), function (iForm, form) {
            var formData = $(form).serializeObject();
            console.log(formData);

            formData.id = $(form).attr("id");
            formData.type = $(form).attr("type");

            //Recolhe os erros dos tipos de texto e lista
            if (formData.type == "list" || formData.type == "text") {
                formData.errors = [];
                //recolhe os erros
                var errors = $("#" + formData.id + " *[class*='fluidity'],#" + formData.id + " [class*='accuracy'] ");
                $.each(errors, function (iErr, err) {
                    var wordIndex = $(err).attr("id").replace("wd", '');
                    var error = $(err).attr("class").split(":");
                    formData.errors.push({
                        index: wordIndex,
                        error: error[0],
                        subError: error[1]
                    })
                })
            }
            //Diferencia o teste das perguntas
            if (formData.type == "test") {
                resolution.attributes.test = (formData);
            } else {
                resolution.attributes.questions.push(formData);
            }

        });
        console.log(resolution.attributes)
        resolution.save(null, {
            success: function (user, response) {
                sucssesMsg($(".form"), response.text);
                 setTimeout(function () {
                 app.navigate("students", {
                 trigger: true
                 });
                 }, 1500);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(ajaxOptions.responseText);
                failMsg($("body"), json.text);
            }
        })
    },
    //Calcula a nota do teste de texto/lista segundo os parametros seleccionados
    recalcTestNote: function (e) {
        //console.log($(e.currentTarget))
        var self = this;
        //obtem o respectivo form
        var formName = $(e.currentTarget).closest('form').attr("id");
        console.log(formName)
        //Numero total de palavras
        var nWords = parseInt($("#" + formName + " #wordsCount").html());
        console.log(nWords)

        //Total dos parametros de dificuldade
        var difTotal = 0;

        //nota final
        var finalNote = 0;

        //Calcula o subtotal da precisao
        var accuracyError = parseInt($("#" + formName + " #accuracy").val());
        var accuracyNote = (100 - (accuracyError * 100 / nWords)) * 5 / 100 * parseInt($("#" + formName + " #accuracyDif").val());
        if ($.isNumeric(accuracyNote)) {
            difTotal += parseInt($("#" + formName + " #accuracyDif").val());
            finalNote += accuracyNote;
        }
        console.log("accuracyError " + accuracyError + " : " + accuracyNote)


        //Calcula o subtotal da fluidez
        var fluidityError = parseInt($("#" + formName + " #fluidity").val());
        var fluidityNote = (100 - (fluidityError * 100 / nWords)) * 5 / 100 * parseInt($("#" + formName + " #fluidityDif").val());
        if ($.isNumeric(fluidityNote)) {
            difTotal += parseInt($("#" + formName + " #fluidityDif").val());
            finalNote += fluidityNote;
        }

        console.log("fluidityError " + accuracyError + " : " + fluidityNote)

        //Calcula o subtotal da pontuacao
        var ponctuationNote = (parseInt($("#" + formName + " #ponctuation").val()) * parseInt($("#" + formName + " #ponctuationDif").val()));
        if ($.isNumeric(ponctuationNote)) {
            difTotal += parseInt($("#" + formName + " #ponctuationDif").val());
            finalNote += ponctuationNote;
        }
        console.log("ponctuationNote " + ponctuationNote + " : " + difTotal)

        //Calcula o subtotal da entoacao
        var inflectionNote = (parseInt($("#" + formName + " #inflection").val()) * parseInt($("#" + formName + " #inflectionDif").val()));
        if ($.isNumeric(inflectionNote)) {
            difTotal += parseInt($("#" + formName + " #inflectionDif").val());
            finalNote += inflectionNote;
        }
        console.log("inflectionNote " + inflectionNote + " : " + difTotal)

        //Calcula o subtotal do texto
        var textNote = (parseInt($("#" + formName + " #text").val()) * parseInt($("#" + formName + " #textDif").val()));
        if ($.isNumeric(textNote)) {
            difTotal += parseInt($("#" + formName + " #textDif").val());
            finalNote += textNote;
        }
        console.log("textNote " + ponctuationNote + " : " + difTotal)
        //Calcula o subtotal do tempo
        var timeNote = (parseInt($("#" + formName + " #time").val()) * parseInt($("#" + formName + " #timeDif").val()));
        if ($.isNumeric(timeNote)) {
            difTotal += parseInt($("#" + formName + " #timeDif").val());
            finalNote += timeNote;
        }
        console.log("timeNote " + timeNote + " : " + difTotal)
        console.log("finalNote " + finalNote + " : " + difTotal)
        //Passa para percentagem
        finalNote = ((finalNote / difTotal) * 100 / 5) || 0;

        //Coloca a nota final no input
        $("#" + formName + " input[name='note']").val(finalNote);
        self.afterRender();
    },
    //Regista os erros das palavras
    saveError: function (e) {
        var self = this;
        //obtem o erro erro:suberro
        var err = $(e.currentTarget).attr("err");

        //obtem o respectivo form
        var formName = $(e.currentTarget).closest('form').attr("id");

        //incrementa o total de erros

        $("#correctionDD").addClass(err)

        //Recalcula  a nota
        var accuracyError = $("#" + formName + " *[class*='accuracy']").length;
        console.log(accuracyError)
        var fluidityError = $("#" + formName + " *[class*='fluidity']").length;

        $("#" + formName + " #errorCount").html(fluidityError + accuracyError);
        $("#" + formName + " #fluidity").val(fluidityError);
        $("#" + formName + " #accuracy").val(accuracyError);

        self.recalcTestNote(e);

        $("#correctionDD").removeClass(err)


        //substitui a dd exixtente novamento pelo span e adiciona o erro
        $("#correctionDD").replaceWith($('<span>', {
            html: $("#correctionDD").attr('word'),
            id: $("#correctionDD").attr('wordId'),
            class: err,
        }));


    },

    resolWord: function (e) {
        var $target = $(e.currentTarget);
//TRoca o span pela dd dos erros
        $(e.currentTarget).replaceWith(showCorrectionDD($target.html(), $target.attr('id')))


    },

    initialize: function () {
        var self = this;
        self.bd2 = 'let_resolutions';

    }
    ,
//Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    afterRender: function () {
        var self = this;

        //Coloca as notas dos testes automaticos nas tabelas

        var $notes = $("input[name='note']");
        var totalNote = 0;
        var totalDif = 0;
        //Recolhe as notas e a dificuldade de cada teste
        $.each($notes, function (iNote, note) {
            var questNote = parseInt($(note).val());
            var questDif = parseInt($(note).attr("dif"));
            //Coloca o valor na tabela
            $("#finalNote" + $(note).attr("questionID")).html(questNote)
            totalNote += questNote * questDif;
            totalDif += questDif;
        });
        //Calcula a nota final do teste
        $("#testNote").val(totalNote / totalDif)

    },
//Class Renderer
    render: function () {

        var self = this;

//Check Local Auth
        if (!self.auth()) {
            return false;
        }
//conta o numero de palavras
//self.model.attributes.answer.wordsTotal = self.model.attributes.question.content.text.split(" ").length;
        self.data = self.model.toJSON();
        console.log(self.data)

        $(this.el).html(this.template({model: self.data}));
        console.log("já render")

        return this;

    }
});

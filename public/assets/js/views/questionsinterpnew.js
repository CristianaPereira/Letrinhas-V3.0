window.QuestionsInterpNew = Backbone.View.extend({
    events: {
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "change #uploadSoundFile": "uploadSoundFile",
        "click #markText": "markText",
        "click #writeText": "writeText",
        "click .selectable": "selectWord",
        "click #backbtn": "goBack",
        "blur .emptyField": "isEmpty",
        "mouseover #subTxt": "pop",
        "submit": "beforeSend"
    },
    //Initializes popover content
    pop: function () {
        setPopOver("Ano, Disciplina, Conteúdo, Especificação, Título, Pergunta, Texto");
    },
    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Verifies if an input is empty
    isEmpty: function (e) {
        if ($(e.currentTarget).val().length != 0) {
            $(e.currentTarget).removeClass("emptyField");
        }
    },

    //Go back to the last visited page
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();
        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        if (isValid) {
            //Generate Form Data
            var fd = new FormData($("#newInterpretationTestForm")[0]);

            //Generate Answers Locations
            var $sid = [];
            $("#inputPanel").find(".badge").each(function () {
                $sid.push((this.id).substring(3));
            });

            fd.append("sid", $sid);

            modem('POST', 'questions',
                function (json) {
                },
                //Error Handling
                function (xhr, ajaxOptions, thrownError) {
                },
                fd
            );

        }


    },

    //Show Voice Recorder Equalizer
    showEqualizer: function (e) {
        e.preventDefault();
        $("#myModalRecord").modal("show");
        initAudio();
    },

    //Initiate Voice Recording
    initRecord: function (e) {
        e.preventDefault();

        if ($("#record").attr("value") == 1) {
            $("#save").attr("style", "color:#80ccee;font-size:16px");
            $("#record").html('<span class="glyphicon glyphicon-record" style="color:#ee0000"></span> Gravar');
            $("#record").attr("value", 0);
        }
        else {
            $("#save").attr("style", "visibility:hidden");
            $("#record").html('<span class="glyphicon glyphicon-stop" style="color:#ee0000"></span> Parar');
            $("#record").attr("value", 1);
            $("#Rplayer").attr("style", "visibility:hidden;width:60%");
            $("#Rplayer").stop();
        }

        toggleRecording(e.target);
    },

    //Upload Sound File
    uploadSoundFile: function () {
        var files = $("#uploadSoundFile").prop('files');
        $("#soundPath")
            .attr("placeholder", files[0].name)
            .attr("value", files[0].name)
            .css('border', 'solid 1px #cccccc');
    },

    //Finalize Text Marking
    writeText: function (e) {
        e.preventDefault();

        $("#inputTextArea").show();
        $("#markText").show();

        $("#inputPanel").hide();
        $("#writeText").hide();

    },

    //Text Marking
    markText: function (e) {
        e.preventDefault();

        var self = this;

        alertMsg($(".form"), "Marcar o texto deve ser um processo final. \nCaso altere o texto ou pretenda remarcar o mesmo, todas as marcações anteriores serão removidas!")

        //Separa o texto em paragrafos
        var $paragraph = $("#inputTextArea").val().split(/\r|\n/);
        var words = $();
        var nWords = 0;
        //por cada paragrafo adiciona a palavra a lista, e a new line
        $.each($paragraph, function (iLine, line) {
            var $wordsList = line.split(" ");
            $.each($wordsList, function (i, word) {
                //Replace String With Selectable Span (Não esquecer os PARAGRAFOS)
                words = words.add($('<span>', {
                    text: word + " ",
                    id: 'sid' + nWords,
                    class: "selectable"
                }))
                //incrementa o nr de palavras (nao conta os breaks
                nWords++;
            });
            words = words.add('<br />')
        })
        $("#inputPanel").empty().append(words);

        $("#inputTextArea").hide();
        $("#markText").hide();

        $("#inputPanel").show();
        $("#writeText").show();
    },

    //Mark Word
    selectWord: function (e) {
        $(e.target).toggleClass("badge");
        console.log($(e.target).attr("id"))
    },

    //Make Unique String Array
    unique: function (list) {
        var result = [];
        $.each(list, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
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

        getCategories();
        $(this.el).html(this.template());
        return this;
    },

});

window.QuestionsTextNew = Backbone.View.extend({
    events: {
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "click #backbtn": "goBack",
        "change #uploadSoundFile": "uploadSoundFile",
        "blur .emptyField": "isEmpty",
        "submit": "beforeSend",
        "mouseover #subTxt": "pop"
    },
    //Initializes popover content
    pop: function () {

        setPopOver("Ano, Disciplina, Conteúdo, Especificação, Título, Pergunta, Texto e Som.");

    },

    //Go back to the last visited page
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //Verifies if an input is empty
    isEmpty: function (e) {
        if ($(e.currentTarget).val().length != 0) {
            $(e.currentTarget).removeClass("emptyField");
        }
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
            $('#content').append(loadingSpinner());
            modem('POST', 'questions',
                function () {
                    sucssesMsg($("body"), "Pergunta inserida com sucesso!");
                    setTimeout(function () {
                        app.navigate("questions", {
                            trigger: true
                        });
                    }, 1500);
                },
                //Error Handling
                function (xhr, ajaxOptions, thrownError) {
                    failMsg($("body"), "Não foi possível inserir a nova pergunta.");
                },
                new FormData($("#newTextTestForm")[0])
            );

        }

    },

    //Show Voice Recorder Equalizer
    showEqualizer: function (e) {
        e.preventDefault();
        console.log("somm")
        $("#myModalRecord").modal("show");
        //Limpa a div
        $("#rTexto").empty();
        //Clona o texto
        $("#InputTexto").clone().appendTo("#rTexto");

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
    uploadSoundFile: function (obj) {
        var files = $("#uploadSoundFile").prop('files');
        var reader = new FileReader();
        var sound = document.getElementById('teacherVoice');
        reader.onload = (function (audio) {
            return function (e) {
                audio.src = e.target.result;
            };
        })(sound);
        reader.readAsDataURL(files[0]);

        $("#soundPath")
            .attr("placeholder", files[0].name)
            .attr("value", files[0].name)
            .css('border', 'solid 1px #cccccc');
        $("#teacherVoice source").attr("src", files[0].name);
        var mySnd = document.getElementById("teacherVoice");
        //mySnd.playbackRate = 0.5;
        console.log(mySnd.playbackRate)
    },

    //Class Initializer
    initialize: function () {
        var self = this;
        self.bd = 'let_tests';
        self.bd2 = 'let_questions';
        self.site = 'http://185.15.22.235:5984';
    },

    //Class Renderer
    render: function () {
        var self = this;

        getCategories();

        $(this.el).html(this.template());
        return this;

    },

})
;
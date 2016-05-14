window.QuestionsTextEdit = Backbone.View.extend({
    events: {
        'load #selectSubject': 'create',
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "click #backbtn": "goBack",
        "change #uploadSoundFile": "uploadSoundFile",
        "change #selectSubject": "alert",
        "blur .emptyField": "isEmpty",
        "submit": "beforeSend",
        "mouseover #subTxt": "pop"
    },

    alert: function () {
        //alert("asdfas");
    },
    //Initializes popover content
    pop: function () {
        $("#selectSubject").val("6b348c67c111a8e7f010c054b4001b85");
        console.log("here")
        setPopOver("Titulo, Discuplina, Ano escolar, Pergunta, Descrição, Texto e Audio");
    },

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            return false;
        }
        return true;
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
        modem('PUT', 'questions/' + this.model.toJSON().id,
            function (json) {
                success($("body"), "OK", 1000);

            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("body"), "Não foi possível inserir a nova pergunta. \n (" + JSON.parse(xhr.responseText).result + ").");
            },
            new FormData($("#newTextTestForm")[0])
        )
        ;
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

    //Class Initializer
    initialize: function () {
        var self = this;
    },

    create: function () {
        console.log("sd")
    },

    //Class Renderer
    render: function () {
        var self = this;
        //Check Local Auth
        if (!self.auth()) {
            return false;
        }


        $(self.el).html(self.template(self.model.toJSON()));
        getSetCategories(self.model.toJSON().subject);

        var question = new Question({id: "Q1462970445206"})
        var questionDetails = {
            "id": "Q1462970445206",
            "title": "Stewie s",
            "subject": "6b348c67c111a8e7f010c054b4001b85:undefined:undefined",
            "question": "quantos models",
            "description": "Descicao model",
            "content": {
                "text": "angulo model"
            },
            "profID": "reginacenoura@gmail.com",
            "creationDate": "2016-05-11T12:40:45.206Z"
        };
        question.set({title: 'Stewie Griffin'}); // This triggers a change and will alert;
        console.log(question)

        question.save(questionDetails, {

            success: function (user) {
                alert(JSON.stringify(user));
            }
        });


        var data = this.model.toJSON();
        console.log(data)
        return self;

    },

})
;
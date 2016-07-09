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
        setPopOver("Titulo, Discuplina, Ano escolar, Pergunta, Descrição, Texto e Audio");
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
        console.log($("#newTextTestForm")[0]);
        $('#content').append(loadingSpinner());
        modem('PUT', 'questions/' + this.data._id,
            function (json) {
                sucssesMsg($("body"), "Pergunta editada com sucesso!");
                setTimeout(function () {
                    app.navigate("questions", {
                        trigger: true
                    });
                }, 1500);

            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

                var json = JSON.parse(xhr.responseText);
                failMsg($("body"), json.text);
                setTimeout(function () {
                    app.navigate('/user', {
                        trigger: true
                    });
                }, json.text.length * 50);
            },
            new FormData($("#newTextTestForm")[0])
        );
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
    afterRender: function () {
        var self = this;
        //seleecciona o ano escolar
        $("#selectAno").val(self.data.schoolYear)

    },
    //Class Renderer
    render: function () {
        var self = this;

        self.data = this.model.toJSON();
        console.log(self.data)

        $(self.el).html(self.template(self.data));
        getCategories(self.data.subject);

        return self;

    },

});
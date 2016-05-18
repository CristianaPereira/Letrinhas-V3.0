window.QuestionsListNew = Backbone.View.extend({
    events: {
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "change #uploadSoundFile": "uploadSoundFile",
        "click #backbtn": "goBack",
        "submit": "beforeSend"
    },

    //Check Auth
    auth: function () {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Go back to the last visited page
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();
        console.log(new FormData($("#newListTestForm")[0]))
        //Recolhe as listas
        var wordsLists = $(".list");
        var lists = [];
        //Adiciona as listas que estivrem preenchidas
        $.each(wordsLists, function (i, list) {
            //Se a coluna não estiver vazia, separa as palavras para um array
            if ($(list).val()) {
                lists.push({words: $(list).val().replace(/\n/g, " ").split(" ")});
            }
        });
        $("#columns").val(JSON.stringify(lists));

        modem('POST', 'questions',
            function (json) {
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
            },
            new FormData($("#newListTestForm")[0])
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
            .css('border', 'solid 1px #cccccc');
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

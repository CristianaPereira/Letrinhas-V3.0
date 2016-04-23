window.QuestionsInterpNew = Backbone.View.extend({
    events: {
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "change #uploadSoundFile": "uploadSoundFile",
        "click #markText": "markText",
        "click .selectable": "selectWord",
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

    //Text Marking
    markText: function (e) {
        e.preventDefault();

        var self = this;

        alert("Atenção: \nMarcar o texto deve ser um processo final. \nCaso altere o texto ou pretenda remarcar o mesmo, todas as marcações anteriores serão removidas!");

        var $text = $("#inputTextArea").val();

        var $words = $("#inputTextArea").val()
            .replace(/(\r\n|\n|\r)/gm, " ")  //Replaces all 3 types of line breaks with a space
            .replace(/\s+/g, " ")            //Replace all double white spaces with single spaces
            .split(" ");

        //Make Array Unique
        $words = self.unique($words);

        //Replace String With Selectable Span
        for(var i in $words){
            $text = $text.replace($words[i], "<mark class='selectable'>" + $words[i] + "</mark>");
        }

        $("#inputPanel").append($text);

        /*
        for (var i in $words) {

            $("#inputPanel")
                .append($("<span>", {
                    class: "selectable",
                    html: $words[i] + " "
                }))
        }
        */

        $("#inputTextArea").hide();
        $("#markText").hide();

        $("#inputPanel").show();
        $("#writeText").show();

    },

    //Mark Word
    selectWord: function (e) {

        console.log(e.target);
        $(e.target).toggleClass("badge");

        //$("#"+e.target.id).hide();
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

        $(this.el).html(this.template());
        return this;
    },

});

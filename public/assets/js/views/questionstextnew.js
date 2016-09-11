window.QuestionsTextNew = Backbone.View.extend({
    events: {
        "click #showEqualizer": "showEqualizer",
        "click #record": "initRecord",
        "click #backbtn": "goBack",
        "change #uploadSoundFile": "uploadSoundFile",
        "blur .emptyField": "isEmpty",
        "blur #inputText": "applyText",
        "submit": "beforeSend",
        "click .soundAdjust": "adjustSound",
        "click .next": "nextStep",
        "click .previous": "previousStep",
        "click #wordsList .selectable": "addTiming",
        'click .jumpToWord': 'jumpToWord',
        'click .adjustBack': 'adjustBack',
        'click .adjustFront': 'adjustFront',
        'click .removeTime': 'removeTime',
        'mouseleave': 'leave',
        'keydown .selected': 'keyAction'

    },
    //MARKED WORDS BUTTONS
    jumpToWord: function (e) {
        //Procura os dados da palavra e reproduz
        var x = document.getElementById("teacherVoice1");
        x.currentTime = $(e.currentTarget).closest('.word.selected').attr('data-start');
        x.play();
    },
    adjustBack: function (e) {
        var $word = $(e.currentTarget).closest('.word.selected');
        $word.attr('data-start', ( parseFloat($word.attr('data-start')) - (0.1)).toFixed(5))
    },
    adjustFront: function (e) {
        var $word = $(e.currentTarget).closest('.word.selected');
        $word.attr('data-start', ( parseFloat($word.attr('data-start')) + (0.1)).toFixed(5))
    },
    removeTime: function (e) {
        console.log($(e.target))
        var $word = $(e.currentTarget).closest('.word.selected');
        $word.children('div').remove();
        $word.removeClass('word')
        $word.removeClass('selected')
        $word.removeAttr('data-start')

    },

    //MARK WORDs
    addTiming: function (e) {
        console.log($(e.target))
        //Se a palavra nao estiver marcada ainda
        if ($(e.target).hasClass('selectable')) {
            var x = document.getElementById("teacherVoice1");
            var pop = Popcorn("#teacherVoice1");
            $(e.target).attr('data-start', (x.currentTime - 0.3).toFixed(3))
            $(e.target).addClass('word');
            $(e.target).append(
                '<div class="wordOptions">' +
                '<div class="input-group-addon"><i class="fa fa-backward adjustBack"></i></div>' +
                '<div class="input-group-addon"><i class="fa fa-play-circle-o jumpToWord"></i></div>' +
                '<div class="input-group-addon"><i class="fa fa-forward adjustFront"></i></div>' +
                '<div class="input-group-addon"><i class="fa fa-close removeTime"></i></div>' +

                '</div>'
            )
            pop.footnote({
                start: $(e.target).attr('data-start'),
                text: '',
                target: $(e.target).attr('id'),
                effect: "applyclass",
                applyclass: "selected"
            });
            pop.play();
        }
        // this.applyTimings();
    },
    adjustSound: function (e) {
        e.preventDefault();

        var x = document.getElementById("teacherVoice1");
        x.playbackRate = (x.playbackRate + (0.1 * $(e.target).val())).toFixed(1);
        console.log(x.playbackRate)

        $("#soundSpeed").html(x.playbackRate * 100 + '%');
    },

    //PREVIOUS--NEXT CONTROLS
    previousStep: function (e) {
        e.preventDefault();
        var prevId = $(e.currentTarget).parents('.tab-pane').prev().attr("id");
        $('[href="#' + prevId + '"]').tab('show');
    },
    nextStep: function (e) {
        e.preventDefault();
        var $parentTab = $(e.currentTarget).parents('.tab-pane');
        //If all mandatory inputs are filled, goes to next tab
        if (this.validateDetails($parentTab.attr("id"))) {

            var nextId = $parentTab.next().attr("id");
            $('[href="#' + nextId + '"]').tab('show');
        }
    },
    //Validates first TAB
    validateDetails: function (parentID) {
        //Se algum dos campos estiver vazio
        var allListElements = $('#' + parentID + ' .mandatory');
        console.log(allListElements)
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        return isValid;
    },

    applyText: function (e) {
        var text = $(e.currentTarget).val();
        $("#wordsList").empty();
        //Separa o texto em paragrafos
        var $paragraph = text.split(/\n/);
        var words = $();
        var nWords = 0;
        //por cada paragrafo adiciona a palavra a lista, e a new line
        $.each($paragraph, function (iLine, line) {
            var $wordsList = line.split(" ");
            $.each($wordsList, function (i, word) {

                words = words.add($('<span>', {
                    text: word + " ",
                    id: "wd" + nWords,
                    class: 'selectable'

                }))

                //incrementa o nr de palavras (nao conta os breaks
                nWords++;
            });
            words = words.add('<br />')
        });

        $("#wordsList").append(words);


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
        var $wordTimes = [];
        $.each($(".selectable.word"), function (i, word) {
            $wordTimes.push({pos: $(word).attr('id').replace('wd', ''), start: $(word).attr('data-start')})
        });

        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        var fd = new FormData($("#newTextTestForm")[0])
        fd.append("wordTimes", JSON.stringify($wordTimes))
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
                fd
            );
        }
    }
    ,

    //Show Voice Recorder Equalizer
    showEqualizer: function (e) {
        e.preventDefault();

        //Limpa a div
        $("#rTexto").empty();
        //Clona o texto
        $("#InputTexto").clone().appendTo("#rTexto");

        initAudio();
    }
    ,

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
    }
    ,

    //Upload Sound File
    uploadSoundFile: function (obj) {
        var files = $("#uploadSoundFile").prop('files');
        var reader = new FileReader();
        var sound = document.getElementById('teacherVoice');
        var sound2 = document.getElementById('teacherVoice1');
        reader.onload = (function (audio) {
            return function (e) {
                audio.src = e.target.result;
                sound2.src = e.target.result;
                sound2.playbackRate = 0.5;
            };
        })(sound);
        reader.readAsDataURL(files[0]);

        //Adujta o som para 50%

        $("#soundSpeed").html('50%');

        $("#soundPath")
            .attr("placeholder", files[0].name)
            .attr("value", files[0].name)
            .css('border', 'solid 1px #cccccc');
    }
    ,

    //Class Initializer
    initialize: function () {
        var self = this;
        self.bd = 'let_tests';
        self.bd2 = 'let_questions';
        self.site = 'http://185.15.22.235:5984';
    }
    ,

    //Class Renderer
    render: function () {
        var self = this;

        getCategories();

        $(this.el).html(this.template());
        return this;

    }
    ,

})
;
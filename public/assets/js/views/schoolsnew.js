window.SchoolsNew = Backbone.View.extend({
    events: {
        "click #backbtn": "goBack",
        "blur .emptyField": "isEmpty",
        "submit": "beforeSend",
        "change #filePicker": "convertPhoto",
        "click #btnCrop": "getFoto",
        "mouseover #subEscola": "pop"
    },
    //Initializes popover content
    pop: function () {

        setPopOver("Nome, Morada e Fotografia");

    },
    //Convert Photo To defined size
    convertPhoto: function (e) {
        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper(".form", image, 300, 16 / 9);

        }
        reader.readAsDataURL(file);
    },
    //crops a foto
    getFoto: function (e) {
        e.preventDefault();
        var canvas = $("#preview")[0];
        var dataUrl = canvas.toDataURL('image/jpeg');

        $("#base64textarea").val(dataUrl);
        $("#iFoto").attr('src', dataUrl);
        $(".cropBG").remove();
        $(".profile-pic").removeClass("emptyField");
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
            modem('POST', 'schools',
                //Response Handler
                function (json) {
                    sucssesMsg($(".form"), "Escola inserida com sucesso!", 1000);
                    setTimeout(function () {
                        app.navigate("schools/" + json + "/edit", {
                            trigger: true
                        });
                    }, 1200);
                },

                //Error Handling
                function (xhr, ajaxOptions, thrownError) {
                    failMsg($(".form"), "Lamentamos mas não foi possível inserir a escola!", 1000);
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);

                },

                $("#newschoolform").serializeArray()
            );
        }
    },

    //Cancel New School
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },


    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        $(this.el).html(this.template());
        $('#infoPop').popover();
        return this;
    }
});

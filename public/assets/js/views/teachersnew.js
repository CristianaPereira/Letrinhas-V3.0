window.TeachersNewView = Backbone.View.extend({
    events: {
        "click #newteacherbtn": "beforeSend",
        "click #buttonCancelar": "goBack",
        "change #filePicker": "convertPhoto",
        "click #btnCrop": "getFoto",
        "click #addTurma": "addTurma",
        "click #rmvTurmas": "rmvTurmas",
        "blur .emptyField": "isEmpty",
        "blur #inputEmail": "isEmailAvail"
    },

    //Exibe o cropper
    //Convert Photo To Base64 String
    convertPhoto: function (e) {
        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper("#newteacherform", image, 300, 1);
            console.log(image.src);

        }
        reader.readAsDataURL(file);
    },
    //Recorta a foto
    getFoto: function (e) {
        e.preventDefault();
        var canvas = $("#preview")[0];
        var dataUrl = canvas.toDataURL('image/jpeg');
        $("#base64textarea").val(dataUrl);
        $("#iFoto").attr('src', dataUrl);
        console.log(dataUrl);
        $(".cropBG").remove();
    },
    //Adiciona a escola e a turma ao objecto
    addTurma: function () {
        assocClass();
    },

    //Desassocia todas as escolas e respectivas turmas
    rmvTurmas: function () {
        $("#teacherClasses").val("{}");
        $("#assocTurma").empty();
    },


    //Verifica se o e-mail já esta registado
    isEmailAvail: function () {
        //Se o email ja estiver a ser usado

        return true;
    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        var isValid = true;
        e.preventDefault();

        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        $.each(allListElements, function (key, elem) {
            if ($(elem).val() != null && $(elem).val().length == 0) {
                $(elem).addClass("emptyField");
                $("#validationLbl").text("Todos os campos de preenchimento obrigatório");
                isValid = false;
            }
        });


        //Se o pin não for um numero
        if (!isNumber($("#inputPin").val())) {
            $("#inputPin").addClass("emptyField");
            $("#validationLbl").text("O pin deverá conter apenas dígitos. (0-9)");
            return false;
        }
        if (!this.isEmailAvail()) {
            return false;
        }
        if (!matchingPswds($("#InputPasswd").val(), $("#ConfirmPasswd").val())) {
            $("#InputPasswd").addClass("emptyField");
            $("#ConfirmPasswd").addClass("emptyField");
            $("#validationLbl").text("As passwords não coincidem.");
            return false;
        }
        if (isValid) {
            this.send();
        }

    },

    //Volta para a página dos professores
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

    //Sending Request To Server
    send: function () {

        //Crypt Passwords
        $("#InputPasswd").val(md5($("#InputPasswd").val()));
        $("#oldPasw").val(md5($("#oldPasw").val()));
        //Crypt PIN
        var pin = $("#inputPin").val();
        $("#inputPin").val(md5(pin));
        //Tipo de utilizador
        $("#dbUserType").val($("#dbUserType").prop('selectedIndex') + 1);
        //Send Form Submit To Server
        modem('POST', 'teachers',
            //Response Handler
            function (json) {
                sucssesMsg($("#newteacherform"), "Utilizador inserido com sucesso", 2000);
                setTimeout(function () {
                    app.navigate('/teachers', {
                        trigger: true
                    });
                }, 2000);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#newteacherform"), "Não foi possível inserir o novo utilizador. \n (" + JSON.parse(xhr.responseText).result + ").");
            },
            new FormData($("#newteacherform")[0])
        );
    },

    //Class Initializer
    initialize: function () {
        //Get Schools If User Has Required Permissions
        populateDDSchools();
    }
    ,
    //Class Renderer
    render: function () {
        $(this.el).html(this.template());
        //Check User LoggedIn
        if (!window.sessionStorage.getItem("keyo")) {
            //Redirect
            app.navigate('/MenuPrincipal', {
                trigger: true
            });
            return false;
        }
        return this;
    }
})
;

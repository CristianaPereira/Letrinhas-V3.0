window.TeachersNewView = Backbone.View.extend({
    events: {
        "click #newteacherbtn": "beforeSend",
        "click #buttonCancelar": "goBack",
        "change #filePicker": "convertPhoto",
        "click #addTurma": "addTurma",
        "click #rmvTurmas": "rmvTurmas",
        "blur .emptyField": "isEmpty",
        "blur #inputEmail": "isEmailAvail"
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

    //Convert Photo To Base64 String
    convertPhoto: function (e) {
        var file = e.target.files[0];
        // Load the image
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function () {
                //Image Resize
                var canvas = document.createElement('canvas');
                var MAX_WIDTH = 450;
                var MAX_HEIGHT = 350;
                var width = image.width;
                var height = image.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);

                var dataUrl = canvas.toDataURL('image/jpeg');
                $("#base64textarea").val(dataUrl);

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    },

    //Verifica se o e-mail já esta registado
    isEmailAvail: function () {
        //Se o email ja estiver a ser usado
        modem('GET', 'teachers/' + $("#inputEmail").val(),
            function (json) {
                if (json != null) {
                    $("#inputEmail").addClass("emptyField");
                    $("#validationLbl").text("O email " + $("#inputEmail").val() + " já está a ser utilizado.");
                    return false;
                }
            },
            function (xhr, ajaxOptions, thrownError) {

            }
        );
        $("#validationLbl").text("");
        $("#inputEmail").removeClass("emptyField");
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
        console.log(isValid);
        if (isValid) {
            this.send();
        }

    },

    //Volta para a página dos professores
    goBack: function () {
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
                sucssesMsg($("#newteacherform"), "Utilizador inserido com sucesso");
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
            $("#newteacherform").serialize()
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

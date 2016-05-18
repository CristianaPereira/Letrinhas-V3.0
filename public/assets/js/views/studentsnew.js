window.StudentsNewView = Backbone.View.extend({
    events: {
        "click #backbtn": "back",
        "blur .emptyField": "isEmpty",
        "submit": "beforeSend",
        "change #filePicker": "convertPhoto",
        "click #btnCrop": "getFoto",
        "mouseover #newstudentbtn": "pop"
    },
    //Initializes popover content
    pop: function () {

        setPopOver("Nome, Número, Fotografia, Escola e Turma");

    },
    //Verifies if an input is empty
    isEmpty: function (e) {
        if ($(e.currentTarget).val().length != 0) {
            $(e.currentTarget).removeClass("emptyField");
        }
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
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

    //Convert Photo To Base64 String
    convertPhoto: function (e) {

        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper(".form", image, 300, 1);

        }
        reader.readAsDataURL(file);

    },

    //Return to last visited page
    back: function (e) {
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
            var studentDetails = $('#newstudentform').serializeObject();
            console.log(studentDetails)
            //Cria um novo model
            var student = new Student(studentDetails);

            student.save(null, {
                success: function () {
                    sucssesMsg($(".form"), "Aluno inserido com sucesso!");
                    setTimeout(function () {
                        app.navigate("students", {
                            trigger: true
                        });
                    }, 1500);
                },
                error: function () {
                    failMsg($(".form"), "Lamentamos mas não foi possível inserir o aluno!", 1000);
                }
            });
        }

    },

    //Class Initializer
    initialize: function () {
        //Get Schools If User Has Required Permissions
        populateDDSchools();
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

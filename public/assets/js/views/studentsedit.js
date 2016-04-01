window.StudentsEdit = Backbone.View.extend({
    events: {
        "click #backbtn": "goBack",
        "submit": "beforeSend",
        "change #filePicker": "convertPhoto",
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
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

    //Cancel New School
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //Before Sending Server Request
    beforeSend: function(e){
        e.preventDefault();

        var self = this;

        //Send Student Changes to Server
        modem('POST', 'students/' + self.student.id,

            //Response Handler
            function () {
                sucssesMsg($("#editstudentform"), "Aluno editado com sucesso");
                setTimeout(function () {
                    app.navigate('/students', {
                        trigger: true
                    });
                }, 2000);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#editstudentform"), "Não foi possível editar o aluno. \n (" + JSON.parse(xhr.responseText).error + ").");
            },

            $("#editstudentform").serializeArray()
        );

    },

    //Class Initializer
    initialize: function (req) {
        this.student = req;
    },

    render: function () {
        var self = this;

        //Check Local Auth
        if(!self.auth()){ return false; }

        $(this.el).html(this.template());

        //Get Student Info
        modem('GET', 'students/' + self.student.id,

            //Response Handler
            function (json) {
                $("#studentName").val(json.nome);
                $("#studentNumber").val(json.numero);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;
    }

});

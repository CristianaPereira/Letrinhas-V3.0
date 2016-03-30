window.SchoolsEdit = Backbone.View.extend({
    events: {
        "submit": "beforeSend",
        "click #cancelbtn": "goBack",
        "change #filePicker": "convertPhoto",
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
    
    //Before Submit
    beforeSend: function(e){
        e.preventDefault();

        var self = this;

        modem('POST', 'schools/' + self.school.id,

            //Response Handler
            function () {

                sucssesMsg($("#schooleditform"), "Escola editada com sucesso");
                setTimeout(function () {
                    app.navigate('/schools', {
                        trigger: true
                    });
                }, 2000);

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#schooleditform"), "Não foi possível editar a escola. \n (" + JSON.parse(xhr.responseText).error + ").");
            },

            $("#schooleditform").serializeArray()
        );

    },

    //Go Back To Previous Page
    goBack: function(e){
        e.preventDefault();
        window.history.back();
    },


    //Class Initializer
    initialize: function (id) {
        this.school = id;
    },

    //Class Renderer
    render: function () {
        var self = this;

        $(this.el).html(this.template());

        modem('GET', 'schools/' + self.school.id,

            //Response Handler
            function (json) {

                $("#schoolName").val(json.nome);
                $("#schoolAddress").val(json.morada);

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;
    }
});

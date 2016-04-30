window.SchoolsNew = Backbone.View.extend({
    events: {
        "click #backbtn": "goBack",
        "submit": "beforeSend",
        "change #filePicker": "convertPhoto",
        "click #btnCrop": "getFoto"
    },

    //Convert Photo To Base64 String
    convertPhoto: function (e) {
        var file = e.target.files[0];

        // Load the image
        var reader = new FileReader();

        reader.onload = function (readerEvent) {
            var image = new Image();
            image.src = readerEvent.target.result;
            showCropper(".form", image, 600, 300, 16 / 9);

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
        $(".cropBG").remove();
    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();
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

                console.log(xhr);
                console.log(ajaxOptions);
                console.log(thrownError);

                //Redirect If Everyting Ok
                if (xhr.status == 200) {
                    console.log("School Created Successfully");
                    app.navigate('schools', {
                        trigger: true
                    });
                }

            },

            $("#newschoolform").serializeArray()
        );

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
        return this;
    }
});

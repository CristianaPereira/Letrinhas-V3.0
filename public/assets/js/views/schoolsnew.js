window.SchoolsNew = Backbone.View.extend({
    events: {
        "click #backbtn": "goBack",
        "submit": "beforeSend",
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

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();

        modem('POST', 'schools',

            //Response Handler
            function () {
                console.log("School Created Successfully");
                app.navigate('schools', {
                    trigger: true
                });
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

                console.log(xhr);
                console.log(ajaxOptions);
                console.log(thrownError);

                //Redirect If Everyting Ok
                if(xhr.status == 200){
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

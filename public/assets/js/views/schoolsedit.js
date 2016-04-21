window.SchoolsEdit = Backbone.View.extend({
    events: {
        "submit": "beforeSend",
        "click #cancelbtn": "goBack",
        "click #addNewClass": "addClass",
        "change #filePicker": "convertPhoto",
        "click #btnDelClass": "deleteClass",
        "click .deleteClass": "confirmDelete",

    },


    //Solicita confirmação para apagar a turma
    confirmDelete: function (e) {
        var modal = delModal("Apagar professor",
            "Tem a certeza que quer apagar a turma " + $(e.target).val() + "?",
            "btnDelClass", e.target.id);

        $('.form').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Delete Class
    deleteClass: function (e) {
        e.preventDefault();
        $('#modalConfirmDel').modal("hide");
        modem('POST', 'schools/' + this.school.id + '/removeclass',
            //Response Handler
            function () {
                document.location.reload(true);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#classes"), "Não foi possível remover a turma. \n (" + JSON.parse(xhr.responseText).error + ").");
            },
            {_id: $(e.target).val()}
        );


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
                $("#iFoto").attr("src", dataUrl);

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    },

    //Before Submit
    beforeSend: function (e) {
        e.preventDefault();

        var self = this;
        console.log($("#schooleditform").serializeArray());
        modem('POST', 'schools/' + self.school.id,

            //Response Handler
            function () {

                sucssesMsg($("#schooleditform"), "Escola editada com sucesso", 500);
                setTimeout(function () {
                    document.location.reload(true);
                }, 500);

            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#schooleditform"), "Não foi possível editar a escola. \n (" + JSON.parse(xhr.responseText).error + ").");
            },

            $("#schooleditform").serializeArray()
        );

    },

    //Go Back To Previous Page
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    addClass: function (e) {
        e.preventDefault();
        var self = this;

        var newClass = $("#newclassform").serializeArray();
        newClass.push({name: "school", value: self.school.id});

        //Send Info To Server
        modem('POST', 'schools/' + self.school.id + '/newclass',
            //Response Handler
            function () {
                self.render();
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#classes"), "Não foi possível adicionar a tuurma. \n (" + JSON.parse(xhr.responseText).error + ").");
            },
            newClass
        );
    },

    //Class Initializer
    initialize: function (id) {
        var self = this;
        self.school = id;
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
                $("#iFoto").attr("src", json.b64);
                $("#base64textarea").val(json.b64);
                json.turmas.sort(sortJsonByCol('ano'));
                $.each(json.turmas, function () {

                    $("#classesList").append(
                        $('<div>', {
                            class: "row"
                        }).append(
                            $('<p>', {
                                html: this.ano + "º " + this.nome + " ",
                                class: "col-md-4 col-sm-4"
                            }),
                            $("<div>", {
                                class: "col-md-8 col-sm-8",
                            }).append($("<button>", {
                                id: this._id,
                                value: this.ano + "º " + this.nome,
                                class: "deleteClass round-button fa fa-trash"
                            }))
                        )
                    );

                });
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {

            }
        );

        return this;
    }
});

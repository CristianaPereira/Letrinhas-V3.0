window.SchoolsEdit = Backbone.View.extend({
    events: {
        "submit": "beforeSend",
        "click #cancelbtn": "goBack",
        "click #addNewClass": "addClass",
        "blur .emptyField": "isEmpty",
        "change #filePicker": "convertPhoto",
        "change select": "isEmpty",
        "click #btnCrop": "getFoto",
        "click #btnDelClass": "deleteClass",
        "click .deleteClass": "confirmDelete",
        "mouseover #btnEditDetails": "pop"

    },

    //Initializes popover content
    pop: function () {

        setPopOver("Nome, Morada e Fotografia");

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
            image.src = readerEvent.target.result;
            showCropper(".form", image, 300, 16 / 9);
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

//Verifies if an input is empty
    isEmpty: function (e) {
        isElemValid($(e.currentTarget));
    },
    //Before Submit
    beforeSend: function (e) {
        e.preventDefault();

        var self = this;
        //Se algum dos campos estiver vazio
        var allListElements = $("#schooleditform .mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        if (isValid) {
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

                new FormData($("#schooleditform")[0])
            );
        }
    },

    //Go Back To Previous Page
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },

    addClass: function (e) {
        e.preventDefault();

        var self = this;
        //Se algum dos campos estiver vazio
        var allListElements = $("#newclassform .mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);
        //If they are
        if (isValid) {
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
        }
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

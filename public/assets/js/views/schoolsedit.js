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
            "Tem a certeza que quer apagar a turma " + $(e.target).attr("value") + "?",
            "btnDelClass", e.target.id);

        $('.form').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Delete Class
    deleteClass: function (e) {
        e.preventDefault();
        $('#modalConfirmDel').modal("hide");
        modem('POST', 'schools/' + this.data.id + '/removeclass',
            //Response Handler
            function () {
                document.location.reload(true);
            },

            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#classes"), "Não foi possível remover a turma. \n (" + JSON.parse(xhr.responseText).error + ").");
            },
            new FormData($('<form>', {}).append(
                $('<input>', {name: "_id", value: $(e.target).attr("value")})
            )[0])
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
            modem('POST', 'schools/' + self.data.id,

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
            //Send Info To Server
            modem('POST', 'schools/' + this.data.id + '/newclass',
                //Response Handler
                function () {
                    //Response Handler
                    document.location.reload(true);
                },
                //Error Handling
                function (xhr, ajaxOptions, thrownError) {
                    failMsg($("#classes"), "Não foi possível adicionar a tuurma. \n (" + JSON.parse(xhr.responseText).error + ").");
                },
                new FormData($("#newclassform")[0])
            );
        }
    },

    //Class Initializer
    initialize: function (id) {
        var self = this;
        self.data = self.model.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;

        $(this.el).html(this.template(self.data));

        return this;
    }
});

window.StudentsNewView = Backbone.View.extend({
    events: {
        "click #backbtn": "back",
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

    //Return to last visited page
    back: function (e) {
        e.preventDefault();
        window.history.back();
    },

    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();

        //Send Form Via Ajax
        modem('POST', 'students',
            //Response Handler
            function () {
                sucssesMsg($("#newstudentform"), "Aluno criado com sucesso",2000);
                setTimeout(function () {
                    app.navigate('/students', {
                        trigger: true
                    });
                }, 2000);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#newstudentform"), "Não foi possível criar o novo aluno. \n (" + JSON.parse(xhr.responseText).error + ").");
            },
            //Data To Send
            $("#newstudentform").serializeArray()
        );


    },

    //Class Initializer
    initialize: function () {
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        $(this.el).html(this.template());

        modem('GET', 'schools',

            //Response Handler
            function (json) {
                // Preencher o select escola, com as escolas existentes e respetivas turmas:
                //e o select que vai ajudar a devolver os ID's ao form e fazer a correta atualização na escola
                var s = '<option value=""></option>';
                var d = '<option value=""></option>';
                for (i = 0; i < json.length; i++) {
                    s += '<optgroup label="' + json[i].doc.nome + '">';
                    //e adicionar as turmas...

                    for (j = 0; j < json[i].doc.turmas.length; j++) {
                        s += '<option value="' + json[i].doc.nome + '">' + json[i].doc.turmas[j].ano
                            + 'º, ' + json[i].doc.turmas[j].nome + '</option>';
                        d += '<option value="' + json[i].doc._id + '">' + json[i].doc.turmas[j]._id + '</option>';
                    }
                    s += "</optgroup>";
                }
                $("#selectTurma").html(s);
                $("#hidenTurma").html(d);
                //no hidden, contém no value o id da escola
                //e no text o id da turma.

                //adicionar os eventos para o select da turma.
                var myEl = document.getElementById('selectTurma');
                myEl.addEventListener('change', function () {
                    var i = this.selectedIndex;
                    //igualar os indexes
                    var hidden = document.getElementById('hidenTurma');
                    hidden.selectedIndex = i;
                    //addicionar os id's necessários de escola:turma;
                    var r = hidden.options[i].value + ':' + hidden.options[i].text;
                    $("#hidenIDTurma").val(r);

                }, false);

            },

            //Error Handling
            function (xhr, ajaxOptions, throwError) {
                var json = JSON.parse(xhr.responseText);
                console.log("\Erro");
                console.log(json.message.error);
                console.log(json.result);
            });
        return this;
    },


});

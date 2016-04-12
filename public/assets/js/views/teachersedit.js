window.TeachersEditView = Backbone.View.extend({
    events: {
        "click #buttonCancelar": "buttonCancelar",
        "click #addTurma": "addTurma",
        "click #btnEditDetails": "beforeSend",
        "click #btnEditTurmas": "editTurmas",
        "click #btnEditPsw": "editPsw",
        "change #inputFoto": "carregaFoto",
        "change #filePicker": "convertPhoto",
        "mouseover #pwdIcon": "verPwd",
        "mouseout #pwdIcon": "escondePwd",
        "keyup #ConfirmPasswd": "confirmPwd",


    },
    //Sends an udate classes to server
    editTurmas: function (e) {
        var self = this;
        e.preventDefault();
        modem('POST', 'teachers/editClasses',
            //Response Handler
            function (json) {
                sucssesMsg($("#editTeacherView"), "Turmas associadas com sucesso.");
                setTimeout(function () {
                    getAssocClasses($("#inputEmail").val(), $("#InputNome").val(), true);
                    $("#teacherClasses").val("{}");
                    $("#assocTurma").empty();
                }, 2000);

            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#editTeacherView"), "Não foi possível alterar os dados. \n (" + JSON.parse(xhr.responseText).result + ").");
                console.log("NOT OK");

            },
            $("#teacherClasses").serialize() + "&email=" + encodeURIComponent($("#inputEmail").val())
        );

    },
    //Before Sending Request To Server
    beforeSend: function (e) {
        var isValid = true;
        e.preventDefault();
        //Send Form Submit To Server
        modem('POST', 'teachers/editDetails',
            //Response Handler
            function (json) {
                sucssesMsg($("#newteacherform"), "Dados alterados com sucesso.");
                setTimeout(function () {
                    app.navigate('/teachers', {
                        trigger: true
                    });
                }, 2000);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#newteacherform"), "Não foi possível alterar os dados. \n (" + JSON.parse(xhr.responseText).result + ").");
            },
            $("#frmEditDetails").serialize() + "&email=" + encodeURIComponent($("#inputEmail").val())
        );
    },

    //Before Sending Request To Server
    editPsw: function (e) {
        var isValid = true;
        e.preventDefault();
        $("#txtOldPasswd").val(md5($("#txtOldPasswd").val()));
        $("#txtNewPassword").val(md5($("#txtNewPassword").val()));
        //Send Form Submit To Server
        modem('POST', 'teachers/editPasswd',
            //Response Handler
            function (json) {
                sucssesMsg($("#newteacherform"), "Dados alterados com sucesso.");
                setTimeout(function () {
                    app.navigate('/teachers', {
                        trigger: true
                    });
                }, 2000);
            },
            //Error Handling
            function (xhr, ajaxOptions, thrownError) {
                failMsg($("#newteacherform"), "Não foi possível alterar a password. \n (" + JSON.parse(xhr.responseText).result + ").");
            },
            $("#frmEditPasswd").serialize() + "&email=" + encodeURIComponent($("#inputEmail").val())
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
                $("#iFoto").attr('src', dataUrl);

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    },

    //Adiciona a escola e a turma ao objecto
    addTurma: function () {
        assocClass();
    },

    confirmPwd: function () {
        if ($("#InputPasswd").val() == $("#ConfirmPasswd").val()) {
            $("#confIcon").addClass("glyphicon-ok");
            $("#confIcon").removeClass("glyphicon-remove");
            $("#confIcon").attr("style", "color:#66dd66");
        }
        else {
            $("#confIcon").addClass("glyphicon-remove");
            $("#confIcon").removeClass("glyphicon-ok");
            $("#confIcon").attr("style", "color:#dd6666");

        }
    },

    escondePwd: function () {
        $("#pwdIcon").attr("style", "color:#cccccc");
        $("#InputPasswd").attr("type", "password");
    },

    verPwd: function () {
        $("#pwdIcon").attr("style", "color:#66cc66");
        $("#InputPasswd").attr("type", "text");

    },

    buttonCancelar: function (e) {
        e.preventDefault();
        window.history.back();
    },

    initialize: function (id) {
        var self = this;
        self.bd = 'dev_professores';
        self.site = 'http://185.15.22.235:5984';
        self.teacherID = id;
    },

    render: function () {
        var self = this;
        $(this.el).html(this.template());
        //Gets teacher data and shows his/her info
        modem('GET', 'teachers/' + self.teacherID.id, function (prof) {
            console.log(prof);
            $(".titleImage").attr('src', prof.imgb64);
            $("#iFoto").attr('src', prof.imgb64);
            $(".titleText").text(prof.nome);

            $("#InputNome").val(prof.nome);
            $("#inputEmail").val(prof._id);
            $("#InputTelefone").val(prof.telefone);

            $("#dbUserType > option").eq(prof.permissionLevel - 1).attr('selected', 'selected');
            $('#classesList').append('<div id="prfSchool" class="col-md-12" align=left><label id="assocClasses">' + prof.nome + ', não tem turmas associadas.</label></div>');
            ;
            getAssocClasses(prof._id, prof.nome, true);
            if (prof.estado) {
                document.getElementById('selectEstado').selectedIndex = 0;
            }
            else {
                document.getElementById('selectEstado').selectedIndex = 1;
            }

        }, function (error) {
            console.log('Error getting teacher list!');
        });

        //Preenche as dd das escolas e das turmas
        populateDDSchools();


        return this;
    }
});

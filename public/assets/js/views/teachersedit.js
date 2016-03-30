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
                    self.getTurmas($("#inputEmail").val(), $("#InputNome").val());
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

    getTurmas: function (idProf, nomeProf) {
        var self = this;
        var nTurmas = 0;
        $("#prfSchool").empty();
        //Objecto Json com o nome das escolas e turmas
        var obj = jQuery.parseJSON("{}");
        //Obtem os nomes das escolas e respectivas turmas associadas ao professor idProf
        modem('GET', 'schools', function (schoolsList) {
                //Verifica a lista de escolas
                $.each(schoolsList, function (key, school) {
                    //Verifica a lista de turmas
                    $.each(school.doc.turmas, function (kTurma, turma) {
                        var trm = turma.ano + "º " + turma.nome;
                        //Verifica a lista de turmas
                        $.each(turma.professores, function (kProf, prof) {
                            if (prof.id == idProf) {
                                //Se a escola já estiver listada, e a turma não, adiciona a turma
                                if (obj[school.doc.nome]) {
                                    if (obj[school.doc.nome]['turma'].indexOf(trm) == -1) {
                                        obj[school.doc.nome]['turma'].push(trm);
                                    }
                                } else {
                                    obj[school.doc.nome] = {};
                                    obj[school.doc.nome]['id'] = school.doc.nome;
                                    obj[school.doc.nome]['turma'] = [];
                                    obj[school.doc.nome]['turma'].push(trm);
                                    nTurmas++;
                                }
                            }
                        });
                    });
                });
                $('#assocClasses').text(nomeProf + ', tem ' + nTurmas + ' turma(s) associada(s).');
                //Exibe os dado na view
                $.each(obj, function (kSch, sch) {
                    var $school = $("<div>", {
                        class: "col-md-8 col-sm-8"
                    }).append('<i class="fa fa-university"></i>' +
                        '<label style="margin-left: 7px;">' + sch.id + '</label>');
                    var $row = $("<div>", {
                        class: "row"
                    }).append($school);
                    $($row).append($school);
                    var $classes = $("<div>", {
                        class: "col-md-4 col-sm-4"
                    });
                    $.each(sch.turma, function (kValue, value) {
                        $classes.append('<label>' + value + ' </label>' +
                            '<i class="fa fa-remove" tooltip="Remover" style="margin-left: 5px;"></i></br>')
                    });
                    $($row).append($classes);
                    $("#prfSchool").append($row);
                });
            },
            function (error) {
                console.log('Error getting schools list!');
            }
        )
        ;

    },

    render: function () {
        var self = this;
        $(this.el).html(this.template());
        //Gets teacher data and shows his/her info
        modem('GET', 'teachers/' + self.teacherID.id, function (prof) {
            $("#InputNome").val(prof.nome);
            $("#editHead").html('<img src="../img/letrinhas2.png" style="height:40px">'
                + '<img src="../img/docentes.png"  style="height:40px;" >'
                + "Editar dados de " + prof.eMail);
            $("#inputEmail").val(prof._id);
            $("#InputPasswd").val(prof.pwd);
            $("#inputPin").val(prof.pin);
            $("#InputTelefone").val(prof.telefone);
            $("#iFoto").attr('src', prof.imgb64);
            $("#dbUserType").eq(1).prop('selected', true);

            $('#classesList').append('<div id="prfSchool" class="col-md-12" align=left><label id="assocClasses">' + prof.nome + ', não tem turmas associadas.</label></div>')
            ;
            self.getTurmas(prof._id, prof.nome);
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

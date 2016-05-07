/**
 * Created by Cris on 17/03/2016.
 */
/*

 $("<div>", { class: "col-md-8 col-sm-8" }
 */


/*
 modem('GET', 'me',

 //Response Handler
 function (json) {
 $.each(json, function (i, key) {
 });


 },

 //Error Handling
 function (xhr, ajaxOptions, thrownError) {
 }
 );




 */
//Populates schools and classes dropdowns ( for edit and new teacher)
window.populateDDSchools = function () {
    //Get Schools If User Has Required Permissions
    modem('GET', 'schools',
        //Response Handler (populates dropdowns)
        function (json) {
            var schoolsList = '<select class="form-control  mandatory" id="dbEscolas">';
            schoolsList += '<option disabled selected>Escola</option>';
            var classList = '<span class="input-group-addon btn-white"><i class="fa fa-book">' +
                '</i></span><select class="form-control mandatory" id="dbTurmas">';
            classList += '<option disabled selected>Turma</option>';
            //Lista as escolas
            for (i = 0; i < json.length; i++) {
                schoolsList += '<option id="' + json[i].doc._id + '">' + json[i].doc.nome + '</option>';
            }
            schoolsList += "</select>";
            classList += "</select>";
            $("#selectEscolas").append(schoolsList);
            $("#selectTurmas").html(classList);

            var myEl = document.getElementById('dbEscolas');
            myEl.addEventListener('change', function () {
                var i = this.selectedIndex;
                var selectedSchool = $(this).children(":selected").attr("id");
                for (i = 0; i < json.length; i++) {
                    if (json[i].doc._id === selectedSchool) {
                        classList = '<span class="input-group-addon btn-white"><i class="fa fa-users"></i></span><select class="form-control" id="dbTurmas">';
                        classList += '<option disabled selected>Turma</option>';
                        for (j = 0; j < json[i].doc.turmas.length; j++) {
                            classList += '<option id="' + json[i].doc.turmas[j]._id + '">' + json[i].doc.turmas[j].ano + 'º' + json[i].doc.turmas[j].nome + '</option>';
                        }
                    }
                }
                classList += "</select>";
                $("#selectTurmas").html(classList);
            }, false);
        },

        //Error Handling
        function (xhr, ajaxOptions, thrownError) {
            //Error Handling
            failMsg($("#newteacherform"), "Ocorreu um erro. \n (" + JSON.parse(xhr.responseText).result + ").");
            setTimeout(function () {
                app.navigate('/teachers', {
                    trigger: true
                });
            }, 2000);
        }
    );
};

window.assocClass = function () {
    var escola = $("#dbEscolas").children(":selected").attr("id");
    var turma = $("#dbTurmas").children(":selected").attr("id");
    if (escola != undefined && turma != undefined) {
        var obj = jQuery.parseJSON($("#teacherClasses").val());
        //Se a escola já estiver listada, e a turma não, adiciona a turma
        if (obj[escola]) {
            if (obj[escola].turmas.indexOf(turma) == -1) {
                obj[escola].turmas.push(turma);
            } else {
                return false;
            }
        } else {
            obj[escola] = {};
            obj[escola]['id'] = escola;
            obj[escola].turmas = [];
            obj[escola].turmas.push(turma);
        }
        $("#teacherClasses").val(JSON.stringify(obj));
        $("#assocTurma").append('<span><b>' + $("#dbTurmas").children(":selected").text() + '</b>, '
            + $("#dbEscolas").children(":selected").text() + '; <i id="' + escola + ':' + turma + '" class="fa fa-trash" onclick="desassocClass(this)"></i><br></span>');
    }
};

//Gets a list of schools and classes associated to some teacher
window.getAssocClasses = function (idProf, nomeProf, editable) {
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
                        if (prof._id == idProf) {
                            var $class = '<li >' + trm + '</li>';
                            if (editable) {
                                $class = '<li >' + trm + ' <i id="' + school.doc._id + ':' + turma._id + '" class="fa fa-remove"  onclick = "removeClass(this)" ></i></li>';
                            }
                            //Se a escola já estiver listada, e a turma não, adiciona a turma
                            if (!$('div#' + school.doc._id).length) {
                                var $row = $("<div>", {
                                    class: "row",
                                    id: school.doc._id
                                }).append($("<div>", {
                                    class: "col-md-8 col-sm-8"
                                }).append('<i class="fa fa-university"></i>' +
                                    '<label style="margin-left: 7px;">' + school.doc.nome + '</label>').append('<ul>' + $class + '</ul>'));
                                $("#prfSchool").append($row);

                            } else {
                                $('div#' + school.doc._id + "  ul").append($class);
                            }
                            nTurmas++;
                        }
                    });
                });
            });
            $("#prfSchool").prepend('<label id="assocClasses">' + nomeProf + ', tem ' + nTurmas + ' turma(s) associada(s).</label>');

        },
        function (error) {
            console.log('Error getting schools list!');
        }
    );


};

window.removeClass = function (elem) {
    var classe = (elem.id).split(":");
    modem('POST', 'teachers/rmvClass',
        //Response Handler
        function (json) {

            getAssocClasses($("#inputEmail").val(), $("#InputNome").val(), true);


        },
        //Error Handling
        function (xhr, ajaxOptions, thrownError) {
            failMsg($("#newteacherform"), "Não foi possível alterar os dados. \n (" + JSON.parse(xhr.responseText).result + ").");
        },
        '&email=' + encodeURIComponent($("#inputEmail").val()) + '&school=' + encodeURIComponent(classe[0]) + '&class=' + encodeURIComponent(classe[1])
    )
    ;
};

window.desassocClass = function (elem) {
    var obj = jQuery.parseJSON($("#teacherClasses").val());
    var data = elem.id.split(":");
    var index = obj[data[0]]['turmas'].indexOf(data[1]);
    //Remove a turma da lista
    $.each(obj, function (iSchool, school) {
        if (school.id == data[0]) {
            $.each(school.turmas, function (iTurma, turma) {
                if (turma == data[1]) {
                    obj[iSchool].turmas.splice(iTurma, 1);
                    console.log(school.turmas.length);
                    if (school.turmas.length == 0) {
                        delete obj[iSchool];
                    }
                }
            })
        }
    });
//Remove a entrada
    $(elem).parent().remove();
    $("#teacherClasses").val(JSON.stringify(obj));
};

//Return a String identifier of a level
window.getUserRole = function (permissionLevel) {
    switch (permissionLevel) {
        case '1' :
            return "Auxiliar";
            break;
        case '2' :
            return "Professor";
            break;
        case '3' :
            return "Administrador de Sistema";
            break;
        default:
            return "Utilizador";
    }
};
window.getCategories = function () {
    //Gets all registed categories
    modem('GET', 'category',

        //Response Handler
        function (json) {

            $.each(json, function (i, key) {
                console.log(key.doc);
                $("#selectSubject").append($("<option>", {html: key.doc.subject, id: key.doc._id, value: key.doc._id}));

                //Populates dd with the contents of selects subject
                var myEl = document.getElementById('selectSubject');

                myEl.addEventListener('change', function () {
                    var selectedSubject = $(this).children(":selected").attr("id");
                    if (key.doc._id === selectedSubject) {
                        //Limpa a dd
                        $("#selectContent").html("");
                        $.each(key.doc.content, function (id, content) {
                            $("#selectContent").append($("<option>", {
                                html: content.name,
                                id: content._id,
                                value: content._id
                            }));
                        });
                    }
                }, false);

                //Populates dd with the contents of selects subject
                var myEll = document.getElementById('selectContent');
                myEll.addEventListener('change', function () {
                    var selectedSubject = $("#selectSubject").children(":selected").attr("id");
                    var selectedContent = $(this).children(":selected").attr("id");
                    if (key.doc._id === selectedSubject) {
                        //Limpa a dd
                        $("#selectSpecification").html("");
                        $.each(key.doc.content, function (id, content) {
                            if (content._id === selectedContent) {
                                $.each(content.specification, function (ids, specif) {
                                    $("#selectSpecification").append($("<option>", {
                                        html: specif.name,
                                        id: specif._id,
                                        value: specif._id
                                    }));
                                });
                            }
                        });
                    }
                }, false);

            });
        },

        //Error Handling
        function (xhr, ajaxOptions, thrownError) {
        }
    );
};
window.setPopOver = function (campos) {
    $('#infoPop').popover({
        placement: 'left',
        toggle: 'popover',
        trigger: "hover",
        content: '<i class="fa fa-square-o"></i>' +
        " Todos os campos são de preenchimento obrigatório. <br />" +
        "(" + campos + ")",
        html: true
    });
};

//Checks if all form inputs are OK
window.isFormValid = function (elementsList) {
    var isValid = true;
    $.each(elementsList, function (key, elem) {

        if (!$(elem).val()) {
            //Se for o b64, muda a border do pai
            if ($(elem).is("[type=hidden]")) {
                $(elem).parent().addClass("emptyField");
                return;
            }
            //Se o elemento for um select
            if ($(elem).is("select")) {
                $(elem).parent().addClass("emptyField");
                $(elem).addClass("emptyField");
                return;
            }
            $(elem).addClass("emptyField");
            isValid = false;
            $("#infoPop").css("color", "#c9302c");
            $('#infoPop').popover("show");
            setTimeout(function () {
                $('#infoPop').popover("hide");
            }, 1500);
        }
    });
    return isValid;
}

//Checks if an element is ok
window.isElemValid = function (elem) {
    if ($(elem).val()) {
        //Se for o b64, muda a border do pai
        if ($(elem).is("[type=hidden]")) {
            $(elem).parent().removeClass("emptyField");
            return;
        }
        //Se o elemento for um select
        if ($(elem).is("select")) {
            $(elem).parent().removeClass("emptyField");
            $(elem).removeClass("emptyField");
            return;
        }
        $(elem).removeClass("emptyField");

    }
}

//Aperfeiçoamente da funcao ":contains" do JQuery para case insensitive
//(http://stackoverflow.com/questions/187537/is-there-a-case-insensitive-jquery-contains-selector)
$.extend($.expr[':'], {
    'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});
//Verifica se as duas Strings são iguais
window.matchingPswds = function (password, confPassword) {
    if (password == confPassword) {
        return true;
    }
    else {
        return false;

    }
};

//Mostra o formulário de login no form indicado
window.showLoginModal = function (form) {

    var $loginModal = $("<div>", {
            class: "modal fade", tabindex: "-1", id: "mLogin", role: "dialog",
            "aria-labelledby": "myModalLabel", "aria-hidden": "true"
        }).append(
        $("<div>", {class: "modal-dialog"}).append(
            $("<div>", {class: "modal-content"}
                // MODAl HEATHER
            ).append(
                $("<div>", {class: "modal-header"}).append(
                    $("<button>", {
                        type: "button", class: "close", "data-dismiss": "modal", "aria-label": "Close"
                    }),
                    $("<h3>", {
                        class: "modal-title", text: "Controlo de acesso"
                    })
                )
                // MODAl HEATHER
            ).append(
                $("<div>", {
                    class: "modal-body",
                }).append(
                    $("<div>", {
                        class: "row form-group",
                    }).append(
                        $("<div>", {
                            class: "col-sm-12",
                        }).append(
                            $("<input>", {
                                id: "userEmail", class: "form-control", placeholder: "E-mail", name: "email",
                                type: "email", autofocus: "autofocus", autocomplete: "on"
                            })
                        ).append($("<span>", {
                            id: "imgMail", class: "glyphicon glyphicon-envelope"
                        }))
                    )
                    )
                    .append(
                        $("<div>", {
                            class: "row form-group",
                        }).append(
                            $("<div>", {
                                class: " col-sm-12",
                            }).append(
                                $("<input>", {
                                    id: "psswrd", class: "form-control", placeholder: "Palavra-passe", name: "password",
                                    type: "password"
                                })
                            ).append($("<span>", {
                                id: "pwdIcon", class: "glyphicon glyphicon-lock"
                            }))
                        )
                    )
            ).append(
                $("<div>", {
                    class: "modal-footer",
                }).append(
                    $("<button>", {
                        type: "submit", id: "loginbtn", class: "btn btn-lg btn-login btn-block",
                        text: "Entrar",
                        onClick: "attemptLogin()"
                    })
                )
            )
        ))
        ;
    $(form).append($loginModal);

    $("#mLogin").modal("show");
};

//Mostra o formulário de login no form indicado
//showCropper("nomeFormulario/div", maxWidth da tela, Width do resultado, height do resultado , ratio (1=quadrado) (16/9=rectangulo);
window.showCropper = function (form, base_image, resWidth, aspectRatio) {

    console.log(base_image.height);
    console.log(base_image.width);

    //Se a imagem for verticalmente maior
    if (base_image.width < base_image.height) {
        var maxHeight = 300;
        var maxWidth = base_image.width * maxHeight / base_image.height;
    } else {
        var maxWidth = 400;
        var maxHeight = base_image.height * maxWidth / base_image.width;
    }

    //Carrega
    var resHeight = resWidth / aspectRatio;

    base_image.onload = function () {

        var $cropperModal = $("<div>", {
            id: "cropperPanel",
            class: "panel panel-info",
            width: maxWidth + 40
        }).append(
            $("<div>", {class: "panel-heading"}
                // MODAl HEATHER
            ).append(
                $("<div>", {}).append(
                    $("<button>", {
                        type: "button", class: "close", "data-dismiss": "modal", "aria-label": "Close"
                    }),
                    $("<h3>", {
                        class: "modal-title", text: "Recorte de imagem"
                    })
                )
                // MODAl HEATHER
            )).append(
            $("<div>", {class: "panel-body"}).append(
                '<div><canvas id="viewport" width="' + maxWidth + '" height="' + maxHeight + '" ></canvas>' +
                '<canvas id="preview" width="' + resWidth + 'px" height="' + resHeight + 'px" style="display: none;"></canvas></div>'
            )
        ).append(
            $("<div>", {}).append(
                $("<button>", {
                    type: "submit", id: "btnCrop", class: "btn btn-lg btn-login btn-block",
                    text: "Recortar"
                })
            ));
        $(form).append($("<div>", {class: 'cropBG'}).append($cropperModal));

        var canvas = document.getElementById('viewport'),
            context = canvas.getContext('2d');


        context.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, maxWidth, maxHeight);


        //-------
        $('#viewport').Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            allowSelect: true,
            allowMove: true,
            allowResize: true,
            bgOpacity: 0.35,
            aspectRatio: aspectRatio
            //aspectRatio: 16 / 9
        });
    }


};


function updatePreview(c) {

    if (parseInt(c.w) > 0) {
        // Show image preview
        var imageObj = $("#viewport")[0];
        var canvas = $("#preview")[0];
        var context = canvas.getContext("2d");

        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0) {
            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        }

    }
}


//Tenta efectuar login
window.attemptLogin = function () {
    //Create Credentials
    var cre = $('#userEmail').val() + ':' + md5($("#psswrd").val());   //Credentials = Username:Password
    window.sessionStorage.setItem("keyo", btoa(cre));                  //Store Credentials Base64

    //Check User Authenticity
    modem('GET', 'me',

        //Response Handler
        function (json) {
            //Hides Login Modal
            $("#mLogin").modal("hide");
            //Reloads actual view
            document.location.reload(true);
        },
        //Error Handling
        function (xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);

            //Remove Session Key if login atempt failed
            window.sessionStorage.removeItem("keyo");

            //Checks Error Type
            if (json.message.statusCode == 404) {
                console.log("Auth Error");
            }
            else {
                console.log("Database Connetcion Error");
            }

        }
    );
};

window.sortJsonByCol = function (property) {

    'use strict';
    return function (a, b) {
        var sortStatus = 0;

        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
        return sortStatus;
    };

};

/**
 * Created by Cris on 17/03/2016.
 */

//Populates schools and classes dropdowns ( for edit and new teacher)
window.populateDDSchools = function () {
    //Get Schools If User Has Required Permissions
    modem('GET', 'schools',
        //Response Handler (populates dropdowns)
        function (json) {
            var schoolsList = '<select class="form-control  mandatory" id="dbEscolas">';
            schoolsList += '<option disabled selected>Escola</option>';
            var classList = '<span class="input-group-addon btn-white"><i class="fa fa-users">' +
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
window.getAssocClasses = function (idProf, nomeProf) {
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
                                    nTurmas++;
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
                    $classes.append('<label>' + value + '</label></br>')
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
}

window.desassocClass = function (elem) {
    var obj = jQuery.parseJSON($("#teacherClasses").val());
    var data = elem.id.split(":");
    var index = obj[data[0]]['turmas'].indexOf(data[1]);
    /*   if (index != -1) {
     //Se for a unica turma da escola, remove a turma e a escola
     if (obj[data[0]].turma.length == 1) {
     delete obj[data[0]];
     } else {
     obj[data[0]].turma.splice(index, 1);
     }
     }*/
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
}
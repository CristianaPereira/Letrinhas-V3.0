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
            if (obj[escola]['turma'].indexOf(turma) == -1) {
                obj[escola]['turma'].push(turma);
            } else {
                return false;
            }
        } else {
            obj[escola] = {};
            obj[escola]['id'] = escola;
            obj[escola]['turma'] = [];
            obj[escola]['turma'].push(turma);
        }
        $("#teacherClasses").val(JSON.stringify(obj));
        $("#assocTurma").append('<label> - ' + $("#dbTurmas").children(":selected").text() + '</label><span>, '
            + $("#dbEscolas").children(":selected").text() + '; </span><br>');
    }
};
window.SchoolsView = Backbone.View.extend({
    events: {
        "click #orderBy": "orderSchools",
        "keyup #txtSearch": "searchSchool",
        'click .listButton': "enchePreview",
        "click .delete": "confirmDelete",
        "click #deletebtn": "deleteSchool",
    },

    orderSchools: function (e) {
        var mylist = $('#schoolsContent');

        var listitems = mylist.children('div').get();

        listitems.sort(function (a, b) {
            return $(a).children('span').text().toUpperCase().localeCompare($(b).children('span').text().toUpperCase());
        });
        //ordenar de forma descendente/ascendente
        if (!$(e.currentTarget).children('i').hasClass("fa-sort-alpha-asc")) {
            listitems = listitems.reverse();
            $(e.currentTarget).children('i').addClass("fa-sort-alpha-asc")
            $(e.currentTarget).children('i').removeClass("fa-sort-alpha-desc")
        } else {
            $(e.currentTarget).children('i').removeClass("fa-sort-alpha-asc")
            $(e.currentTarget).children('i').addClass("fa-sort-alpha-desc")
        }
        $.each(listitems, function (index, item) {
            mylist.append(item);
        });
    },

    //Search School
    searchSchool: function (e) {

        $(".listButton").hide();
        $(".listButton:containsi(" + $(e.currentTarget).val() + ")").show();

    },

    enchePreview: function (e) {
        var self = this;
        //gets model info
        schoolData = self.model.getByID($(e.currentTarget).attr("id"));

        $('#schoolsPreview').empty();

        var $hr = '<div class="col-md-12" ><hr class="dataHr"></div>';
        var $divFoto = $("<div>", {
            class: "col-md-5"
        }).append('<img src="' + schoolData.b64 + '"  class="dataImage">');

        var $divDados =

            $("<div>", {class: "col-md-7 row"}).append(
                $('<div>', {
                    class: "row"
                }).append(
                    $('<label>', {
                        class: "fa fa-map", text: " " + schoolData.address
                    })
                ))
        $('#schoolsPreview').append($('<label>', {
                class: "dataTitle col-md-12", text: schoolData.name
            }), $hr, $divFoto, $divDados)
            .append($hr, '<div id="classesList" class="col-md-12" align=left></div>')
        ;
        $('#classesList').append('<div id="prfSchool" class="col-md-12" align=left></div> </br>');

        $.each(schoolData.classes, function () {

            var $class = $('<button>', {
                class: "classBtn",
                html: this.year + "º " + this.name + " "
            })


            $("#classesList").append($class);

        });
        $("#classesList").prepend('<label id="assocClasses"> Existe ' + schoolData.classes.length + ' turma(s) associada(s).</label>')
        //getAssocClasses(teacherData._id, teacherData.nome, false);

    },

    //Solicita confirmação para apagar o professor
    confirmDelete: function (e) {

        var id = $(e.currentTarget).parent().parent().attr("id");
        var nome = $(e.currentTarget).parent().parent().attr("value");

        var modal = delModal("Apagar escola",
            "Tem a certeza que pretende eliminar a escola <label>" + nome + " </label> ?",
            "deletebtn", id);

        $('#schoolsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Remove School
    deleteSchool: function (e) {
        var self = this;
        $('#modalConfirmDel').modal("hide");
        var school = new School({id: e.target.value})

        school.destroy({
            success: function () {
                sucssesMsg($("#schoolsDiv"), "Escola apagada com sucesso!");
                setTimeout(function () {
                    document.location.reload(true);
                }, 2000);
            },
            error: function (model, response) {
                console.log(response)
                failMsg($("#schoolsDiv"), "Não foi possível remover a turma. \n (" + JSON.parse(response.responseText).result + ").");
            }
        });

    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Class Renderer
    render: function () {

        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        var data = self.model.toJSON();
        $(this.el).html(this.template({collection: data}));

        return this;

    }

});

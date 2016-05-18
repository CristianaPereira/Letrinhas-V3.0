window.StudentsView = Backbone.View.extend({
    events: {
        "click #newstudentbtn": "newStudent",
        "click #deletebtn": "deleteStudent",
        'click .listButton': "fillPreview",
        "click .delete": "confirmDelete"
    },

    //Check Auth
    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    //Solicita confirmação para apagar o professor
    confirmDelete: function (e) {
        var id = $(e.currentTarget).parent().parent().attr("id");
        var nome = $(e.currentTarget).parent().parent().attr("value");

        var modal = delModal("Apagar escola",
            "Tem a certeza que pretende eliminar a escola <label>" + nome + " </label> ?",
            "deletebtn", id);


        $('#studentsDiv').append(modal);
        $('#modalConfirmDel').modal("show");
    },

    //Delete Student
    deleteStudent: function (e) {
        e.preventDefault();
        $('#modalConfirmDel').modal("hide");
        var student = new Student({id: e.target.value})

        student.destroy({
            success: function () {
                sucssesMsg($("#studentsDiv"), "Aluno apagado com sucesso!");
                setTimeout(function () {
                    document.location.reload(true);
                }, 1000);
            },
            error: function (model, response) {
                console.log(response)
                failMsg($("#studentsDiv"), "Não foi possível remover o aluno. \n (" + JSON.parse(response.responseText).result + ").");
            }
        });


    },

    //Fill School Preview
    fillPreview: function (e) {

        var self = this;
        //gets model info
        studentData = self.collection.getByID($(e.currentTarget).attr("id"));
        $('#studentsPreview').empty();
        var $hr = '<div class="col-md-12" ><hr class="dataHr"></div>';
        var $divFoto = $("<div>", {
            class: "col-md-3"
        }).append('<img src="' + studentData.b64 + '"  class="dataImage">');

        var $divDados = $("<div>", {
            class: "col-md-9"
        }).append('<label class="col-md-4 lblDataDetails">Escola:</label> <label class="col-md-8">' + studentData.schoolDetails + '</label><br>')
            .append('<label class="col-md-4 lblDataDetails">Número:</label> <label class="col-md-8">' + studentData.number + '</label><br>')

        $('#studentsPreview').append(
            $('<label>', {
                class: "dataTitle col-md-12", text: studentData.name
            }), $hr,
            $divFoto, $divDados)
            .append('<div class="col-md-12" ><hr class="dataHr"></div>')
        ;
    },


    //New Student Navigation
    newStudent: function (e) {
        e.preventDefault();
        app.navigate('/students/new', true);
    },

    //Class Initializer
    initialize: function () {
        this.data = this.collection.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;

        //Check Local Auth
        if (!self.auth()) {
            return false;
        }

        self.data.sort(sortJsonByCol('name'));
        //Render Template
        $(this.el).html(this.template({collection: self.data}));

        return this;
    },

});

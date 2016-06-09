window.UserView = Backbone.View.extend({
    events: {
        "click #btnUserEdit": "editUser",
    },

    verAluno: function (btn) {
        //Variavel a enviar, para depois poder buscar os dados do aluno a consultar
        window.sessionStorage.setItem("Aluno", $(btn).attr("val"));
        app.navigate('student/view', {
            trigger: true
        });
    },

    editUser: function (obj) {
        //Variavel a enviar, para depois poder buscar os dados do professor a editar
        window.sessionStorage.setItem("ProfEditar", window.localStorage.getItem('ProfID'));
        app.navigate('teachers/edit', {
            trigger: true
        });
    },

    initialize: function () {
        var self = this;
    },

    render: function () {
        var self = this;

        var data = self.model.toJSON();
        console.log(data)
        $(self.el).html(self.template(data));

        return this;
    }

});

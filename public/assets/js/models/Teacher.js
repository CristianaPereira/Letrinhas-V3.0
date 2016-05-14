var Teacher = Backbone.Model.extend({
    initialize: function () {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'me', function (teacherData) {
            self.set("_id", teacherData._id);
            self.set("nome", teacherData.nome);
            self.set("imgb64", teacherData.imgb64);
            self.set("telefone", teacherData.telefone);
            self.set("schools", teacherData.classes);
            self.set("permissionLevel", getUserRole(teacherData.permissionLevel));
            after_fetch();
        }, function (error) {
            console.log('Error getting my data!');
            var json = JSON.parse(xhr.responseText);
            error_launch(json.message);
        });
    }
});

var Teachers = Backbone.Collection.extend({
    model: Teacher,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'teachers',
            function (json) {
                for (i = 0; i < json.length; i++) {
                    self.models.push(new Teacher(json[i].doc));
                }
                after_fetch();
            },
            function () {
            }
        );
    },
    //Gets specific item from collection
    getByID: function (id) {
        var self = this;
        return (
            self.models.find(function (model) {
                return model.get('_id') === id;
            }).attributes
        )
    }
});
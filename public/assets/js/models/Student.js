var Student = Backbone.Model.extend({
    urlRoot: 'students',
    defaults: {},
    initialize: function (options) {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'students/' + this.id,
            function (json) {
                self.attributes = (json);
                console.log(self)
                after_fetch();
            },
            //Precisamos enviar para a Tabela escolas o id do professor.
            function (xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                error_launch(json.message);
            }
        );
    }
});

var Students = Backbone.Collection.extend({
    model: Student,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'students',
            function (json) {
                for (i = 0; i < json.length; i++) {
                    self.models.push(new Student(json[i].doc));
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
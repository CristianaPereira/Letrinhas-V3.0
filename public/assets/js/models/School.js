var School = Backbone.Model.extend({
    urlRoot: 'schools',
    defaults: {},
    initialize: function (options) {

    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'schools/' + this.id,
            function (json) {
                console.log(json)
                //Adiciona os dados ao model
                self.attributes = (json);
                //Ordena as classes por ano
                self.attributes.classes.sort(sortJsonByCol('name'));
                self.attributes.classes.sort(sortJsonByCol('year'));
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

var Schools = Backbone.Collection.extend({
    model: School,
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'schools',
            function (json) {
                for (i = 0; i < json.length; i++) {
                    self.models.push(new School(json[i].doc));
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
        console.log(self.models);
        return (
            self.models.find(function (model) {
                return model.get('_id') === id;
            }).attributes
        )
    }
});
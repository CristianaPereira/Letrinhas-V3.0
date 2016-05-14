var School = Backbone.Model.extend({
    urlRoot: 'schools',
    defaults: {},
    initialize: function (options) {
        this.on("save", function (model) {
            var name = model.get("name"); // 'Stewie Griffin'
            alert("Changed my name to " + name);
        });
    },
    fetch: function (after_fetch) {
        var self = this;
        modem('GET', 'schools/' + this.id,
            function (json) {
                self.set("name", json.name);
                self.set("id", json._id);
                self.set("address", json.address);
                self.set("b64", json.b64);
                json.classes.sort(sortJsonByCol('ano'));
                self.set("classes", json.classes);
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
        return (
            self.models.find(function (model) {
                return model.get('_id') === id;
            }).attributes
        )
    }
});